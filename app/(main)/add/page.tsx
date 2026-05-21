'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { createPost } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, Upload, X } from 'lucide-react';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Field, FieldSet, FieldGroup } from '@/components/ui/field';
import Container from '@/components/Container';
import Image from 'next/image';

export default function CreatePostPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(createPost, undefined);

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    if (state === 'success') {
      toast.success('Post published successfully', {
        position: 'top-center',
        className: '!bg-green-50 !text-green-700 !border-green-200',
      });
      router.push('/');
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
    <Container>
      <div className="flex items-center justify-between py-3 mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back
        </Link>
      </div>

      <form action={formAction}>
        <FieldSet className="w-full">
          <FieldGroup>
            {/* Error */}
            {state && state !== 'success' && (
              <Field className="mb-4">
                <Alert variant="destructive" className="text-xs">
                  <AlertCircleIcon className="size-4" />
                  <AlertTitle>{state}</AlertTitle>
                </Alert>
              </Field>
            )}

            {/* Title */}
            <Field>
              <InputGroup>
                <InputGroupInput
                  name="title"
                  type="text"
                  placeholder="Post title..."
                  required
                />
              </InputGroup>
            </Field>

            {/* Meta */}
            <p className="text-xs text-gray-400 mb-4">myBlog · {today}</p>

            {/* Image Upload */}
            <Field className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Post Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                {preview ? (
                  <div className="relative">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPreview(null);
                        if (inputRef.current) inputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded cursor-pointer"
                    >
                      <X />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    className="cursor-pointer h-25 w-full"
                  >
                    <div className="flex gap-2">
                      <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 ">
                        Click to upload image (JPG, PNG)
                      </p>
                    </div>
                  </Button>
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
              <Textarea
                name="content"
                placeholder="Write your post content here..."
                className="min-h-[300px]"
                required
              />
            </Field>

            {/* Footer */}
            <div className="flex items-center justify-end pt-4">
              <Button size="lg" disabled={isPending} className="cursor-pointer">
                {isPending ? (
                  <>
                    <span className="mr-2">Publishing</span>
                    <Spinner />
                  </>
                ) : (
                  'Publish'
                )}
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </Container>
  );
}
