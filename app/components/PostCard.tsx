import { MessageCircle, Heart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { Post } from '@/lib/definitions';

export default function PostCard({ post }: { post: Post }) {
  const user = post?.users;
  return (
    <div className="border-b py-6">
      <div className="py-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Avatar size="sm">
            <AvatarImage src={user?.avatar_url} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{user?.name || 'Unknown'}</span>
        </div>
      </div>
      <div className="py-2 flex gap-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-4xl font-bold mb-2">
            {post.title}
          </div>
          <p className="text-lg text-gray-500 line-clamp-2">{post.content}</p>
        </div>
        {post.image_url && (
          <Image
            src={post.image_url}
            alt={post.title}
            width={160}
            height={160}
            className="object-cover"
          />
        )}
      </div>
      <div className="py-2 flex items-center gap-4 text-gray-500 text-sm">
        <p>
          {new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
        <div className="flex gap-1 items-center">
          <MessageCircle className="w-4 h-4 fill-gray-500 stroke-none" />
          <span>{post.comments?.[0]?.count || 0}</span>
        </div>
        <div className="flex gap-1 items-center">
          <Heart className="w-4 h-4 fill-gray-500 stroke-none" />
          <span>{post.likes?.[0]?.count || 0}</span>
        </div>
      </div>
    </div>
  );
}
