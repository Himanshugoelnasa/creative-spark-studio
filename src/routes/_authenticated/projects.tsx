import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FolderKanban, Pencil, Plus, Trash2 } from "lucide-react";

import { AppShell } from "@/components/studio/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  useCreateProject,
  useDeleteProject,
  useProjects,
  useRenameProject,
  type ProjectRow,
} from "@/lib/studio-api";

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Aurava" },
      {
        name: "description",
        content: "Group Aurava generations into projects and manage them from one workspace.",
      },
      { property: "og:title", content: "Projects — Aurava" },
      {
        property: "og:description",
        content: "Create, rename and archive creative projects in the Aurava studio.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects = [] } = useProjects();
  const { data: assets = [] } = useAssets();
  const create = useCreateProject();
  const rename = useRenameProject();
  const remove = useDeleteProject();

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [renaming, setRenaming] = useState<ProjectRow | null>(null);
  const [newName, setNewName] = useState("");
  const [deleting, setDeleting] = useState<ProjectRow | null>(null);

  return (
    <AppShell
      title="Projects"
      subtitle={`${projects.length} active projects`}
      actions={
        <Button onClick={() => setCreating(true)}>
          <Plus className="mr-2 size-4" /> New project
        </Button>
      }
    >
      <div className="mx-auto max-w-6xl">
        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center">
            <FolderKanban className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No projects yet — create one to organise your renders.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="glass-panel rounded-3xl p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{p.name}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {p.description ?? "No description"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {p.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  {assets.filter((a) => a.project_id === p.id).length} assets · updated{" "}
                  {new Date(p.updated_at).toLocaleDateString()}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRenaming(p);
                      setNewName(p.name);
                    }}
                  >
                    <Pencil className="mr-1.5 size-3.5" /> Rename
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleting(p)}>
                    <Trash2 className="mr-1.5 size-3.5" /> Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>Projects group renders into one campaign.</DialogDescription>
          </DialogHeader>
          <Label htmlFor="p-name">Name</Label>
          <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
          <Label htmlFor="p-desc">Description</Label>
          <Textarea
            id="p-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button
              disabled={!name.trim()}
              onClick={() => {
                create.mutate({
                  name: name.trim(),
                  ...(description.trim() ? { description: description.trim() } : {}),
                });
                setName("");
                setDescription("");
                setCreating(false);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!renaming} onOpenChange={(v) => !v && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>Update how this project appears in your workspace.</DialogDescription>
          </DialogHeader>
          <Label htmlFor="p-rename">Name</Label>
          <Input id="p-rename" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenaming(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (renaming && newName.trim())
                  rename.mutate({ id: renaming.id, name: newName.trim() });
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
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.name}” will be removed. Assets stay in your library.
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
