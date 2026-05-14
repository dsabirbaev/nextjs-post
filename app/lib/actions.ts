'use server';
import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';
import { signIn, signOut } from '@/../auth';
import bcrypt from 'bcryptjs';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';
import { auth } from '@/../auth';
import { unstable_update } from '@/../auth';
import { ProfileUpdates } from './definitions';

// Создать пост
export async function createPost(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) return 'Title and content are required';

  const { error } = await supabase.from('posts').insert({
    title,
    content,
    user_id: session.user.id,
  });

  if (error) {
    console.error('DB Error:', error);
    return 'Something went wrong';
  }

  revalidatePath('/');
  return 'success'; // ← вернуть вместо redirect
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
  revalidatePath('/profile');
  return 'success'; // ← вернуть вместо redirect
}

// Удалить пост
export async function deletePost(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const id = formData.get('postId') as string; // ← получи id из formData

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) return 'Failed to delete post';

  revalidatePath('/profile');
  return 'success'; // ← вернуть вместо redirect
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

export async function changePassword(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const oldPassword = formData.get('oldPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!oldPassword || !newPassword) return 'Both passwords are required';

  // ✅ получаем текущий пароль из базы
  const { data: user } = await supabase
    .from('users')
    .select('password')
    .eq('id', session.user.id)
    .single();

  if (!user) return 'User not found';

  // ✅ проверяем старый пароль
  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) return 'Current password is incorrect';

  // ✅ хэшируем новый
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { error } = await supabase
    .from('users')
    .update({ password: hashedPassword })
    .eq('id', session.user.id);

  if (error) return 'Something went wrong';

  // // ✅ логиним с новым паролем
  // try {
  //   await signIn('credentials', {
  //     email: session.user.email,
  //     password: newPassword,
  //     redirectTo: '/',
  //   });
  // } catch (error) {
  //   throw error;
  // }
  return 'success';
}

export async function updateProfile(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const country = formData.get('country') as string;
  const address = formData.get('address') as string;

  if (!name) return 'Name is required';

  // ✅ Только непустые поля
  const updates: ProfileUpdates = { name };
  if (phone) updates.phone = phone;
  if (country) updates.country = country;
  if (address) updates.address = address;

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', session.user.id);

  if (error) {
    console.error('DB Error:', error);
    return 'Failed to update';
  }

  await unstable_update({
    user: {
      name,
      country,
      phone,
      address,
    },
  });

  // ✅ Убей сессию и перезагрузи
  revalidatePath('/profile');
  return 'success';
}

export async function uploadAvatar(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const file = formData.get('avatar') as File;
  if (!file) return 'No file selected';

  if (file.size > 5 * 1024 * 1024) return 'File too large (max 5MB)';
  if (!file.type.startsWith('image/')) return 'Only images allowed';

  try {
    // ✅ Одно и то же имя для одного юзера
    const fileName = `${session.user.id}/avatar.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) return 'Upload failed';

    // ✅ Cache busting
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

    const { error: dbError } = await supabase
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', session.user.id);

    if (dbError) return 'Failed to save avatar';

    // ✅ Обнови сессию со всеми полями
    await unstable_update({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        country: session.user.country,
        phone: session.user.phone,
        address: session.user.address,
        avatar_url: avatarUrl,
      },
    });

    revalidatePath('/settings');
    return 'success';
  } catch (error) {
    console.error('Avatar upload error:', error);
    return 'Something went wrong';
  }
}
/// Комментарии post

export async function createComment(
  postId: string,
  replyToId: string | null, // ← ID комментария на который отвечаем
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
    reply_id: replyToId || null, // ✅ null если не reply
  });

  if (error) return 'Something went wrong';

  revalidatePath(`/posts/${postId}`);
  return 'success';
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
