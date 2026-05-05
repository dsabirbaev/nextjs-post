'use server';
import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';
import { signIn, signOut } from '@/../auth';
import bcrypt from 'bcryptjs';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';
import { auth } from '@/../auth';

// Создать пост
export async function createPost(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const session = await auth();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) return 'Title and content are required';

  const { error } = await supabase.from('posts').insert({
    title,
    content,
    user_id: session?.user?.id, // ✅ только user_id
  });

  if (error) return 'Something went wrong';

  revalidatePath('/');
  redirect('/');
}

// Обновить пост
export async function updatePost(
  id: string,
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) return 'Title and content are required';

  const { error } = await supabase
    .from('posts')
    .update({ title, content })
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) return 'Something went wrong';
  revalidatePath('/posts');
  redirect(`/posts`);
}

// Удалить пост
export async function deletePost(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id); // ✅ только свои посты

  revalidatePath('/');
  redirect('/');
}

// Next Auth функции для регистрации, логина и логаута юзера

export async function register(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // проверяем есть ли уже такой email
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return 'Email already exists'; // ← возвращаем строку ошибки
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from('users')
    .insert({ name, email, password: hashedPassword });

  if (error) return 'Something went wrong';

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
  } catch (error) {
    throw error; // ← обязательно пробрасываем
  }
}

export async function login(prevState: string | undefined, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
  } catch (error) {
    // ✅ если это redirect — пробрасываем дальше
    if (isRedirectError(error)) throw error;

    // иначе это реальная ошибка — показываем сообщение
    return 'Invalid email or password';
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: '/login' });
}

/// Комментарии post

export async function createComment(
  postId: string,
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const content = formData.get('content') as string;
  if (!content.trim()) return 'Comment cannot be empty';

  const { error } = await supabase.from('comments').insert({
    content,
    post_id: postId,
    user_id: session.user.id,
  });

  if (error) return 'Something went wrong';

  revalidatePath(`/posts/${postId}`);
}

/// Лайки постов

export async function createLike(postId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', session.user.id)
    .single();

  if (existing) return;

  await supabase.from('likes').insert({
    post_id: postId,
    user_id: session.user.id,
  });

  revalidatePath(`/posts/${postId}`);
}

export async function createDisLike(postId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', session.user.id); // ✅ только свои посты

  revalidatePath(`/posts/${postId}`);
}
