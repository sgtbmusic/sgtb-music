import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fileToBase64, formatBytes, MAX_UPLOAD_BYTES } from "@/lib/fileToBase64";
import { parseCredentials } from "@/lib/site";
import { trpc } from "@/lib/trpc";
import type { Creator } from "@shared/types";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type CreatorEditorDialogProps = {
  creator: Creator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When true the dialog creates a brand new profile slot. */
  createMode?: boolean;
};

export function CreatorEditorDialog({
  creator,
  open,
  onOpenChange,
  createMode = false,
}: CreatorEditorDialogProps) {
  const utils = trpc.useUtils();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [credentialText, setCredentialText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (createMode) {
      setName("");
      setRole("");
      setHandle("");
      setBio("");
      setCredentialText("");
      setImageUrl(null);
      setImageKey(null);
      return;
    }
    setName(creator?.name ?? "");
    setRole(creator?.role ?? "");
    setHandle(creator?.handle ?? "");
    setBio(creator?.bio ?? "");
    setCredentialText(parseCredentials(creator?.credentials).join("\n"));
    setImageUrl(creator?.imageUrl ?? null);
    setImageKey(creator?.imageKey ?? null);
  }, [open, createMode, creator]);

  const imageUpload = trpc.uploads.image.useMutation();

  const createCreator = trpc.creators.create.useMutation({
    onSuccess: async () => {
      await utils.creators.list.invalidate();
      toast.success("Creator profile added");
      onOpenChange(false);
    },
    onError: error => toast.error(error.message),
  });

  const updateCreator = trpc.creators.update.useMutation({
    onSuccess: async () => {
      await utils.creators.list.invalidate();
      toast.success("Creator profile saved");
      onOpenChange(false);
    },
    onError: error => toast.error(error.message),
  });

  const removeCreator = trpc.creators.remove.useMutation({
    onSuccess: async () => {
      await utils.creators.list.invalidate();
      toast.success("Creator profile removed");
      onOpenChange(false);
    },
    onError: error => toast.error(error.message),
  });

  async function handleImagePick(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`Image is too large (${formatBytes(file.size)}). Limit is 60MB.`);
      return;
    }
    setUploading(true);
    try {
      const dataBase64 = await fileToBase64(file);
      const result = await imageUpload.mutateAsync({
        fileName: file.name,
        contentType: file.type,
        dataBase64,
        folder: "creators",
      });
      setImageUrl(result.url);
      setImageKey(result.key);
      toast.success("Portrait uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleSave() {
    const credentials = credentialText
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .slice(0, 6);

    if (!name.trim()) {
      toast.error("A name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      role: role.trim() || null,
      handle: handle.trim() || null,
      imageUrl,
      imageKey,
      credentials,
      bio: bio.trim() || null,
      isPlaceholder: false,
    };

    if (createMode || !creator) {
      createCreator.mutate(payload);
    } else {
      updateCreator.mutate({ id: creator.id, ...payload });
    }
  }

  const saving = createCreator.isPending || updateCreator.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto border-white/12 bg-ink text-white">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl uppercase">
            {createMode ? "Add Creator Profile" : `Edit ${creator?.name ?? "Profile"}`}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Set the portrait, role, highlight lines, and bio. Highlights power the
            animated notification pop-ups — one per line.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-white/15 bg-white/5">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="size-full object-cover object-top" />
              ) : (
                <div className="grid size-full place-items-center text-white/30">
                  <ImagePlus className="size-7" />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 grid place-items-center bg-ink/70">
                  <Loader2 className="size-6 animate-spin text-neon" />
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="hidden"
              onChange={event => void handleImagePick(event.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={() => fileRef.current?.click()}>
              {imageUrl ? "Replace image" : "Upload image"}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="creator-name" className="text-white/80">
                  Name
                </Label>
                <Input
                  id="creator-name"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  className="border-white/15 bg-white/5 text-white"
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="creator-handle" className="text-white/80">
                  Handle
                </Label>
                <Input
                  id="creator-handle"
                  value={handle}
                  onChange={event => setHandle(event.target.value)}
                  className="border-white/15 bg-white/5 text-white"
                  placeholder="@handle"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="creator-role" className="text-white/80">
                Role
              </Label>
              <Input
                id="creator-role"
                value={role}
                onChange={event => setRole(event.target.value)}
                className="border-white/15 bg-white/5 text-white"
                placeholder="Head of Creators at Suno"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="creator-credentials" className="text-white/80">
                Highlights (one per line, max 6)
              </Label>
              <Textarea
                id="creator-credentials"
                value={credentialText}
                onChange={event => setCredentialText(event.target.value)}
                rows={4}
                className="border-white/15 bg-white/5 font-mono text-sm text-white"
                placeholder={"Head of Creators at Suno\nForbes 30 Under 30"}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="creator-bio" className="text-white/80">
                Full bio
              </Label>
              <Textarea
                id="creator-bio"
                value={bio}
                onChange={event => setBio(event.target.value)}
                rows={5}
                className="border-white/15 bg-white/5 text-sm text-white"
                placeholder="The longer story shown after the pop-ups finish."
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          {!createMode && creator && (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={removeCreator.isPending}
              onClick={() => removeCreator.mutate({ id: creator.id })}>
              <Trash2 className="mr-1.5 size-4" />
              Delete profile
            </Button>
          )}
          <div className="flex gap-2 sm:ml-auto">
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-neon text-ink hover:bg-neon/85"
              disabled={saving || uploading}
              onClick={handleSave}>
              {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              {createMode ? "Add profile" : "Save changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

