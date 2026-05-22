export type Post = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  image_url?: string;

  users: {
    id: string;
    name: string;
    avatar_url?: string;
  };

  comments: { count: number }[];
  likes: { count: number }[];
};

export type PostById = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
  users: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  comments: { count: number }[];
  likes: { count: number }[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
  avatar_url: string;
};

export type Comment = {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  reply_id: string | null;
  created_at: string;

  users: {
    name: string;
  };
};

export type Like = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  type: string;
};

export type ProfileUpdates = {
  name: string;
  phone?: string;
  country?: string;
  address?: string;
};
