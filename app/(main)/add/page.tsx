'use client';
import { useActionState } from 'react';
import Link from 'next/link';
import { createPost } from '@/lib/actions';
import { MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Field, FieldSet, FieldGroup } from '@/components/ui/field';
import Container from '@/components/Container';

export default function CreatePostPage() {
  const [error, formAction, isPending] = useActionState(createPost, undefined);

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Container>
      {/* Top bar */}
      <div className="flex items-center justify-between py-3">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back
        </Link>
      </div>

      <form action={formAction}>
        <FieldSet className="w-full">
          <FieldGroup>
            {/* Error */}
            <Field className="mb-2">
              {error && (
                <Alert variant="destructive" className="text-xs">
                  <AlertCircleIcon className="size-4" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}
            </Field>

            {/* Title */}
            <InputGroup>
              <InputGroupInput
                name="title"
                type="text"
                placeholder="Post title..."
              />
            </InputGroup>

            {/* Meta */}
            <p className="text-xs text-gray-400">myBlog · {today}</p>

            <Textarea
              name="content"
              placeholder="Write your post content here..."
              className="min-h-[300px]"
            />

            {/* Footer */}
            <div className="flex items-center justify-end">
              <Button
                size="lg"
                className="hover:bg-gray-700 disabled:opacity-50 transition-colors cursor-pointer dark:hover:bg-gray-500 "
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Spinner className="size-4" /> <span>Please wait</span>
                  </>
                ) : (
                  <>
                    <span>Publish</span>
                    <MoveRight className="ml-auto" />
                  </>
                )}
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </Container>
  );
}
