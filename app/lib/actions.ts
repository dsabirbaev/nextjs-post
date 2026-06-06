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
import { Post } from './definitions';
import { loginSchema, FormState } from './schemas';

// Создать пост
export async function createPost(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const image = formData.get('image') as File;

  if (!title || !content) return 'Title and content are required';

  // Валидация картинки
  if (image && image.size > 0) {
    if (image.size > 5 * 1024 * 1024) return 'Image too large (max 5MB)';
    if (!image.type.startsWith('image/')) return 'Only images allowed';
  }

  let imageUrl: string | null = null;

  try {
    // Загрузи картинку если есть
    if (image && image.size > 0) {
      const fileName = `${session.user.id}_${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, image);

      if (uploadError) return 'Image upload failed';

      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    // Создай пост
    const { error } = await supabase.from('posts').insert({
      title,
      content,
      image_url: imageUrl,
      user_id: session.user.id,
    });

    if (error) {
      console.error('DB Error:', error);
      return 'Something went wrong';
    }

    revalidatePath('/');
    return 'success';
  } catch (error) {
    console.error('Create post error:', error);
    return 'Something went wrong';
  }
}

// Load more posts (для бесконечной прокрутки)
export async function loadMorePosts(offset: number): Promise<Post[] | string> {
  try {
    const { data } = await supabase
      .from('posts')
      .select('*,users(id, name, avatar_url), comments(count), likes(count)')
      .order('created_at', { ascending: false })
      .range(offset, offset + 9);

    return data as Post[];
  } catch (error) {
    console.error('Load more posts error:', error);
    return 'Failed to load posts';
  }
}

// Views
export async function incrementPostViews(postId: string): Promise<void> {
  try {
    // Получи текущие views
    const { data: post } = await supabase
      .from('posts')
      .select('views')
      .eq('id', postId)
      .single();

    // Increment на 1
    await supabase
      .from('posts')
      .update({ views: (post?.views || 0) + 1 })
      .eq('id', postId);
  } catch (error) {
    console.error('Increment views error:', error);
  }
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
  const image = formData.get('image') as File;

  if (!title || !content) return 'Title and content are required';

  // Валидация картинки если есть
  if (image && image.size > 0) {
    if (image.size > 5 * 1024 * 1024) return 'Image too large (max 5MB)';
    if (!image.type.startsWith('image/')) return 'Only images allowed';
  }

  try {
    // 1️⃣ Получи старый пост (для удаления старой картинки)
    const { data: oldPost } = await supabase
      .from('posts')
      .select('image_url')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    let imageUrl = oldPost?.image_url; // ← сохрани старый URL если нет новой

    // 2️⃣ Если загружена новая картинка
    if (image && image.size > 0) {
      // Удали старую картинку из storage
      if (oldPost?.image_url) {
        const oldFileName = oldPost.image_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('post-images').remove([oldFileName]);
        }
      }

      // Загрузи новую картинку
      const fileName = `${session.user.id}_${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, image);

      if (uploadError) return 'Image upload failed';

      // Получи публичный URL
      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      imageUrl = `${data.publicUrl}?t=${Date.now()}`; // ← cache busting
    }

    // 3️⃣ Обнови пост в БД
    const { error } = await supabase
      .from('posts')
      .update({
        title,
        content,
        image_url: imageUrl,
      })
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) return 'Something went wrong';

    revalidatePath('/profile');
    revalidatePath(`/posts/${id}`);
    return 'success';
  } catch (error) {
    console.error('Update post error:', error);
    return 'Something went wrong';
  }
}

// Удалить пост
export async function deletePost(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const id = formData.get('postId') as string;

  try {
    // 1️⃣ Получи пост
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('image_url')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (fetchError || !post) return 'Post not found';

    // 2️⃣ Удали картинку
    if (post.image_url) {
      const fileName = post.image_url.split('/').pop();

      const { error: storageError, data } = await supabase.storage
        .from('post-images')
        .remove([fileName]);

      if (storageError) {
        console.error('Failed to delete from storage:', storageError);
        return `Storage error: ${storageError.message}`; // ← return ошибку вместо continue
      }
    }

    // 3️⃣ Удали пост
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (deleteError) return 'Failed to delete post';

    revalidatePath('/profile');
    return 'success';
  } catch (error) {
    console.error('Delete post error:', error);
    return 'Something went wrong';
  }
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

export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // ✅ Используй flatten() вместо forEach
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    return {
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = result.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { message: 'Invalid email or password' };
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
