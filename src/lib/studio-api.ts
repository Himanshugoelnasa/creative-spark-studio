import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { makeVisualDataUrl, makeVoiceWavDataUrl } from "@/lib/mock-media";

export type GenerationRow = Database["public"]["Tables"]["generations"]["Row"];
export type AssetRow = Database["public"]["Tables"]["assets"]["Row"];
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type GenerationType = Database["public"]["Enums"]["generation_type"];

async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("You need to be signed in.");
  return data.user.id;
}

export function useCredits() {
  return useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const userId = await requireUserId();
      const { data, error } = await supabase
        .from("credits")
        .select("balance, updated_at")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data ?? { balance: 0, updated_at: new Date().toISOString() };
    },
  });
}

export function useGenerations(type?: GenerationType | GenerationType[], limit = 50) {
  const types = type ? (Array.isArray(type) ? type : [type]) : undefined;
  return useQuery({
    queryKey: ["generations", types ?? "all", limit],
    queryFn: async () => {
      let query = supabase
        .from("generations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (types) query = query.in("type", types);
      const { data, error } = await query;
      if (error) throw error;
      return data as GenerationRow[];
    },
  });
}

export function useAssets() {
  return useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as AssetRow[];
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_archived", false)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as ProjectRow[];
    },
  });
}

export function useCreditLedger() {
  return useQuery({
    queryKey: ["credit-ledger"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return data;
    },
  });
}

export interface GenerateInput {
  type: GenerationType;
  prompt: string;
  negativePrompt?: string;
  model: string;
  modelName: string;
  cost: number;
  metadata?: Record<string, unknown>;
  /** image/video frame size */
  width?: number;
  height?: number;
  /** voice */
  durationSeconds?: number;
  voicePitch?: number;
  assetName: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Mocked generation pipeline: persists a real generation row, streams progress,
 * synthesizes an output locally, then debits credits and files the asset.
 */
export function useGenerate() {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async (input: GenerateInput) => {
      const userId = await requireUserId();

      const { data: credits } = await supabase
        .from("credits")
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();
      const balance = credits?.balance ?? 0;
      if (balance < input.cost) {
        throw new Error(`Not enough credits — this run costs ${input.cost}, you have ${balance}.`);
      }

      const { data: created, error: createError } = await supabase
        .from("generations")
        .insert({
          user_id: userId,
          type: input.type,
          prompt: input.prompt,
          negative_prompt: input.negativePrompt ?? null,
          model: input.model,
          status: "processing",
          progress: 5,
          credits_cost: input.cost,
          started_at: new Date().toISOString(),
          metadata: { ...(input.metadata ?? {}), model_name: input.modelName },
        })
        .select()
        .single();
      if (createError) throw createError;

      const stages =
        input.type === "voice"
          ? ["Parsing script", "Shaping prosody", "Rendering voice", "Mastering audio"]
          : input.type === "image"
            ? ["Interpreting prompt", "Composing latents", "Refining detail", "Upscaling"]
            : ["Building storyboard", "Animating keyframes", "Interpolating motion", "Encoding"];

      for (let i = 0; i < stages.length; i += 1) {
        setStage(stages[i]!);
        const pct = Math.round(((i + 1) / stages.length) * 92);
        setProgress(pct);
        await sleep(input.type === "video" ? 900 : 550);
        await supabase.from("generations").update({ progress: pct }).eq("id", created.id);
      }

      const seed = `${created.id}:${input.prompt}`;
      const isVoice = input.type === "voice";
      const outputUrl = isVoice
        ? makeVoiceWavDataUrl(seed, input.durationSeconds ?? 6, input.voicePitch ?? 200)
        : makeVisualDataUrl(seed, input.width ?? 1024, input.height ?? 1024, {
            motion: input.type !== "image",
          });
      const thumbUrl = makeVisualDataUrl(seed, 512, 512, { motion: input.type !== "image" });

      const { data: completed, error: completeError } = await supabase
        .from("generations")
        .update({
          status: "completed",
          progress: 100,
          output_url: outputUrl,
          thumbnail_url: thumbUrl,
          completed_at: new Date().toISOString(),
        })
        .eq("id", created.id)
        .select()
        .single();
      if (completeError) throw completeError;

      await supabase.from("assets").insert({
        user_id: userId,
        generation_id: created.id,
        name: input.assetName,
        kind: isVoice ? "audio" : input.type === "image" ? "image" : "video",
        folder: isVoice ? "Voiceovers" : input.type === "image" ? "Images" : "Video",
        url: outputUrl,
        thumbnail_url: thumbUrl,
        mime_type: isVoice ? "audio/wav" : "image/svg+xml",
        source: "generated",
      });

      await supabase
        .from("credits")
        .update({ balance: balance - input.cost, updated_at: new Date().toISOString() })
        .eq("user_id", userId);

      await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: -input.cost,
        kind: "spend",
        description: `${input.modelName} · ${input.type}`,
        generation_id: created.id,
      });

      setProgress(100);
      setStage("Done");
      return completed as GenerationRow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["credit-ledger"] });
      toast.success("Generation complete");
    },
    onError: (error: Error) => {
      setProgress(0);
      setStage("");
      toast.error(error.message);
    },
  });

  return { ...mutation, progress, stage };
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase
        .from("generations")
        .update({ is_favorite: value })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["generations"] }),
  });
}

export function useDeleteGeneration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("assets").delete().eq("generation_id", id);
      const { error } = await supabase.from("generations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Deleted");
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const userId = await requireUserId();
      const { data, error } = await supabase
        .from("projects")
        .insert({ user_id: userId, name, description: description ?? null })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useBuyCredits() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ credits, name }: { credits: number; name: string }) => {
      const userId = await requireUserId();
      const { data } = await supabase
        .from("credits")
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();
      const balance = (data?.balance ?? 0) + credits;
      const { error } = await supabase
        .from("credits")
        .update({ balance, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      if (error) throw error;
      await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: credits,
        kind: "purchase",
        description: `${name} pack (demo checkout)`,
      });
      return balance;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["credit-ledger"] });
      toast.success("Credits added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
