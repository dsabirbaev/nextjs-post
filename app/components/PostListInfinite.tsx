'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { loadMorePosts } from '@/lib/actions';
import { Post } from '@/lib/definitions';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  initialPosts: Post[];
};

export default function PostListInfinite({ initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [offset, setOffset] = useState(10); // ← начинаем со 2-й страницы
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0.1, // ← когда 10% видно
  });

  useEffect(() => {
    if (!inView || isLoading || !hasMore) return;

    loadMore();
  }, [inView]);

  const loadMore = async () => {
    setIsLoading(true);

    const result = await loadMorePosts(offset);

    if (typeof result === 'string') {
      // Ошибка
      console.error(result);
      setIsLoading(false);
      return;
    }

    if (result.length < 10) {
      // Постов меньше чем надо = конец списка
      setHasMore(false);
    }

    setPosts((prev) => [...prev, ...result]);
    setOffset((prev) => prev + 10);
    setIsLoading(false);
  };

  return (
    <>
      {/* Начальные посты */}
      {posts.map((post) => (
        <Link href={`/posts/${post.id}`} key={post.id}>
          <PostCard post={post} />
        </Link>
      ))}

      {/* Триггер для загрузки */}
      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {isLoading && <Spinner className="size-6" />}
        </div>
      )}

      {/* Конец списка */}
      {/* {!hasMore && (
        <div className="text-center py-8 text-gray-500">
          <p>No more posts</p>
        </div>
      )} */}
    </>
  );
}
