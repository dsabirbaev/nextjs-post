'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { createPost } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Field, FieldSet, FieldGroup } from '@/components/ui/field';
import Container from '@/components/Container';

export default function CreatePostPage() {
  const router = useRouter();
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

  return (
    <Container>
      <div className="flex items-center justify-between py-3">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back
        </Link>
      </div>

      <form action={formAction}>
        <FieldSet className="w-full">
          <FieldGroup>
            {/* Error */}
            {state && state !== 'success' && (
              <Field className="mb-2">
                <Alert variant="destructive" className="text-xs">
                  <AlertCircleIcon className="size-4" />
                  <AlertTitle>{state}</AlertTitle>
                </Alert>
              </Field>
            )}

            {/* Title */}
            <InputGroup>
              <InputGroupInput
                name="title"
                type="text"
                placeholder="Post title..."
                required
              />
            </InputGroup>

            {/* Meta */}
            <p className="text-xs text-gray-400">myBlog · {today}</p>

            {/* Content */}
            <Textarea
              name="content"
              placeholder="Write your post content here..."
              className="min-h-[300px]"
              required
            />

            {/* Footer */}
            <div className="flex items-center justify-end pt-4">
              <Button size="lg" disabled={isPending} className="cursor-pointer">
                {isPending ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Publishing...</span>
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
