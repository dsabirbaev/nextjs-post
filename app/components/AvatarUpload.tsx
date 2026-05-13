'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { uploadAvatar } from '@/lib/actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, Upload } from 'lucide-react';

type Props = {
  currentAvatar?: string;
  userName?: string;
};

export default function AvatarUpload({ currentAvatar, userName }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    uploadAvatar,
    undefined
  );

  useEffect(() => {
    if (state === 'success') {
      toast.success('Avatar updated successfully');
      setPreview(null);
    }
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Покажи preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      {/* Текущий аватар или preview */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-semibold text-gray-600">
              {userName?.[0]?.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="avatar-input">
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
            >
              <Upload className="size-4 mr-2" />
              Choose Photo
            </Button>
          </label>
          <input
            ref={inputRef}
            id="avatar-input"
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
        </div>
      </div>

      {/* Error */}
      {state && state !== 'success' && (
        <Alert variant="destructive">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>{state}</AlertTitle>
        </Alert>
      )}

      {/* Submit */}
      {preview && (
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Spinner className="size-4" />
              Uploading...
            </>
          ) : (
            'Save Avatar'
          )}
        </Button>
      )}
    </form>
  );
}
