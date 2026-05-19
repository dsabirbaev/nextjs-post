import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/20/solid';
import { MessageCircle } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  comments?: { count: number }[];
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card className="w-full hover:border-gray-300 transition-colors cursor-pointer">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-4xl font-bold">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-gray-500 line-clamp-2">{post.content}</p>
      </CardContent>
      <CardFooter className="bg-transparent">
        <p className="text-xs text-gray-400">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
        <div className="text-md font-normal text-black flex items-center gap-1">
          <MessageCircle className="w-4 h-4 text-black" />
          {post.comments?.[0]?.count ?? 0}
        </div>
      </CardFooter>
    </Card>
  );
}
