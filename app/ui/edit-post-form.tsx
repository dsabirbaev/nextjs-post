'use client';

import { useActionState } from 'react';
import { updatePost } from '@/lib/actions';
import Link from 'next/link';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { FieldSet, FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  content: string;
};

export default function EditPostForm({ post }: { post: Post }) {
  const updatePostWithId = updatePost.bind(null, post.id);
  const [error, formAction, isPending] = useActionState(
    updatePostWithId,
    undefined
  );

  return (
    <form action={formAction}>
      <FieldSet className="w-full">
        <FieldGroup>
          <Link
            href={`/posts/${post.id}`}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <Field>
            {error && (
              <Alert variant="destructive" className="text-xs">
                <AlertCircleIcon className="size-4" />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="title"
                name="title"
                type="text"
                placeholder="Post title..."
                defaultValue={post.title}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <Textarea
              id="content"
              name="content"
              defaultValue={post.content}
              placeholder="Write your post content here..."
              className="min-h-[300px]"
            />
          </Field>

          <Field>
            <div className="flex items-center justify-end">
              <Button
                size="lg"
                disabled={isPending}
                variant="outline"
                className="cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Updating...
                  </>
                ) : (
                  <>
                    Update
                    <RotateCw className="h-4 w-4" />
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
