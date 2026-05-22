import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Heart } from 'lucide-react';
import { PostById } from '@/lib/definitions';

export default async function PostDetail({ post }: { post: PostById }) {
  const user = post.users;
  function getReadingTime(text: string) {
    const wordsPerMinute = 225;

    const words = text
      .replace(/<[^>]*>/g, '') // если HTML
      .trim()
      .split(/\s+/).length;

    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }
  return (
    <>
      <div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        {/* Автор + дата */}
        <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage src={user?.avatar_url} alt={user?.name} />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user?.name || 'Unknown'}</span>
          </div>
          <div className="flex gap-2">
            <div>{getReadingTime(post.content)} min read</div>
            <span className="text-gray-500">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 text-sm border-y py-4">
        <div className="flex gap-2 items-center">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments?.[0]?.count || 0}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Heart className="w-4 h-4 " />
          <span>{post.likes?.[0]?.count || 0}</span>
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
