import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
  users: {
    name: string;
    avatar_url?: string;
  };
};

export default async function PostDetail({ post }: { post: Post }) {
  const user = post.users;
  return (
    <>
      <div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        {/* Автор + дата */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-4">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage src={user?.avatar_url} alt={user?.name} />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user?.name || 'Unknown'}</span>
          </div>
          <span className="text-gray-500">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Картинка */}
      {post.image_url && (
        <Image
          src={post.image_url}
          alt={post.title}
          width={800}
          height={500}
          className="w-full h-auto object-cover my-6"
          priority
        />
      )}

      {/* Контент */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>
    </>
  );
}
