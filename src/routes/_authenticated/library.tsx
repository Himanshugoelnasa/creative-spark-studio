import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Pencil, Search, Trash2 } from "lucide-react";

import { AppShell } from "@/components/studio/AppShell";
import { MediaPreview } from "@/components/studio/MediaPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useAssets,
  useDeleteAsset,
  useRenameAsset,
  useToggleAssetFavorite,
  type AssetRow,
} from "@/lib/studio-api";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({
    meta: [
      { title: "Creation Library — Aurava" },
      {
        name: "description",
        content: "Browse, favorite, rename and delete every asset your Aurava studio has produced.",
      },
      { property: "og:title", content: "Creation Library — Aurava" },
      {
        property: "og:description",
        content: "Filter and manage generated images, clips and voiceovers in one library.",
      },
    ],
  }),
  component: LibraryPage,
});

const FILTERS = ["all", "image", "video", "audio", "favorites"] as const;

function LibraryPage() {
  const { data: assets = [], isLoading } = useAssets();
  const rename = useRenameAsset();
  const favorite = useToggleAssetFavorite();
  const remove = useDeleteAsset();

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<AssetRow | null>(null);
  const [renaming, setRenaming] = useState<AssetRow | null>(null);
  const [newName, setNewName] = useState("");
  const [deleting, setDeleting] = useState<AssetRow | null>(null);

  const visible = useMemo(() => {
    return assets.filter((a) => {
      const matchFilter =
        filter === "all" ? true : filter === "favorites" ? a.is_favorite : a.kind === filter;
      const matchQuery = a.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchFilter && matchQuery;
    });
  }, [assets, filter, query]);

  return (
    <AppShell title="Creation Library" subtitle={`${assets.length} assets in your workspace`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors ${
                  filter === f
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets"
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading assets…</p>
        ) : visible.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
            No assets match this view yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((a) => (
              <article key={a.id} className="glass-panel group rounded-2xl p-3">
                <button onClick={() => setOpen(a)} className="block w-full text-left">
                  <MediaPreview
                    kind={a.kind === "audio" ? "audio" : a.kind === "video" ? "video" : "image"}
                    url={a.kind === "audio" ? null : a.url}
                    thumbnail={a.thumbnail_url}
                    seed={a.id}
                  />
                </button>
                <p className="mt-3 line-clamp-1 text-sm font-medium text-foreground">{a.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <Badge variant="secondary">{a.folder}</Badge>
                  <div className="flex items-center gap-0.5">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Favorite"
                      onClick={() => favorite.mutate({ id: a.id, value: !a.is_favorite })}
                    >
                      <Heart
                        className={`size-4 ${a.is_favorite ? "fill-primary text-primary" : ""}`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Rename"
                      onClick={() => {
                        setRenaming(a);
                        setNewName(a.name);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete"
                      onClick={() => setDeleting(a)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{open?.name}</DialogTitle>
            <DialogDescription>
              {open?.kind} · {open?.folder} ·{" "}
              {open ? new Date(open.created_at).toLocaleString() : ""}
            </DialogDescription>
          </DialogHeader>
          {open ? (
            <MediaPreview
              kind={open.kind === "audio" ? "audio" : open.kind === "video" ? "video" : "image"}
              url={open.url}
              thumbnail={open.thumbnail_url}
              seed={open.id}
              className={open.kind === "audio" ? "min-h-40" : "aspect-video"}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={!!renaming} onOpenChange={(v) => !v && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename asset</DialogTitle>
            <DialogDescription>Give this creation a clearer name.</DialogDescription>
          </DialogHeader>
          <Label htmlFor="asset-name">Name</Label>
          <Input id="asset-name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenaming(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (renaming && newName.trim()) {
                  rename.mutate({ id: renaming.id, name: newName.trim() });
                }
                setRenaming(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this asset?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.name}” will be removed from your library. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting) remove.mutate(deleting.id);
                setDeleting(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
