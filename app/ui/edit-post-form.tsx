'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { updatePost } from '@/lib/actions';
import Link from 'next/link';
import { ArrowLeft, RotateCw, Upload, X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { FieldSet, FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Post = {
  id: string;
  title: string;
  content: string;
  image_url?: string;
};

export default function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const updatePostWithId = updatePost.bind(null, post.id);
  const [state, formAction, isPending] = useActionState(
    updatePostWithId,
    undefined
  );

  useEffect(() => {
    if (state === 'success') {
      toast.success('Post edited successfully', {
        position: 'top-center',
        className: '!bg-green-50 !text-green-700 !border-green-200',
      });
      router.push('/profile');
    } else if (state) {
      toast.error(state);
    }
  }, [state, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={formAction}>
      <FieldSet className="w-full">
        <FieldGroup>
          <Link
            href={`/posts/${post.id}`}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          {state && state !== 'success' && (
            <Field>
              <Alert variant="destructive" className="text-xs mb-4">
                <AlertCircleIcon className="size-4" />
                <AlertTitle>{state}</AlertTitle>
              </Alert>
            </Field>
          )}

          {/* Title */}
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="title"
                name="title"
                type="text"
                placeholder="Post title..."
                defaultValue={post.title}
                required
              />
            </InputGroup>
          </Field>

          {/* Image Upload */}
          <Field>
            <FieldLabel>Post Image</FieldLabel>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 mb-4">
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="w-full h-90 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      if (inputRef.current) inputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                  >
                    <X className="w-4 h-4 cursor-pointer" />
                  </button>
                </div>
              ) : post.image_url ? (
                <div className="relative">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="w-full h-90 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition"
                  >
                    <Upload className="w-6 h-6 text-white cursor-pointer" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-full text-center py-6"
                >
                  <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2 cursor-pointer" />
                  <p className="text-sm text-gray-600">
                    Click to upload image (optional)
                  </p>
                </button>
              )}
              <input
                ref={inputRef}
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </Field>

          {/* Content */}
          <Field>
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <Textarea
              id="content"
              name="content"
              defaultValue={post.content}
              placeholder="Write your post content here..."
              className="min-h-[300px]"
              required
            />
          </Field>

          {/* Submit */}
          <Field>
            <div className="flex items-center justify-end">
              <Button size="lg" disabled={isPending} className="cursor-pointer">
                {isPending ? (
                  <>
                    <span className="mr-1"> Updating </span>
                    <Spinner />
                  </>
                ) : (
                  <>
                    <span>Update</span>
                    <RotateCw />
                  </>
                )}
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
