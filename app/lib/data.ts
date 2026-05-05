// lib/data.ts
import { supabase } from './supabase';
import { Post, Comment } from './definitions';

// Получить все посты
export async function getPosts(): Promise<Post[]> {
  const { data } = await supabase
    .from('posts')
    .select('*, comments(count)')
    .order('created_at', { ascending: false });
  return data as Post[];
}

// Получить один пост
export async function getPost(id: string): Promise<Post> {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  return data as Post;
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId) // ← фильтр в базе
    .order('created_at', { ascending: false });

  return data ?? [];
}

/// Комментарии постов

export async function getComments(postId: string): Promise<Comment[]> {
  const { data } = await supabase
    .from('comments')
    .select('*, users(name)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  return data ?? [];
}

/// Лайки постов

export async function getUserLike(
  postId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  return !!data; // true если лайк есть
}

export async function getLikesCount(postId: string): Promise<number> {
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  return count ?? 0;
}
