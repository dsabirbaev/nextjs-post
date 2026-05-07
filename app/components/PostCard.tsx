import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/20/solid';

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
        <CardTitle className="text-lg flex items-center gap-2">
          {post.title}
          <span className="text-xs font-normal text-gray-400 flex items-center gap-1">
            <ChatBubbleOvalLeftIcon className="w-4 h-4 text-green-500" />
            {post.comments?.[0]?.count ?? 0}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 line-clamp-2">{post.content}</p>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-400">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </CardFooter>
    </Card>
  );
}
