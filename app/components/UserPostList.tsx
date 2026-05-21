'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DeletePostButton from './DeletePostButton';

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function UserPostList({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return <p className="text-center text-sm text-gray-400 py-10">No Posts</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title Post</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post?.id}>
              <TableCell className="font-medium">{post?.title}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    asChild
                    className="cursor-pointer bg-green-500"
                    size="sm"
                    variant="outline"
                  >
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Edit
                      <Pencil />
                    </Link>
                  </Button>

                  <DeletePostButton postId={post.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
