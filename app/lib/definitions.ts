export type Post = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  comments: { count: number }[]; // ← добавляем поле для количества комментариев
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
};

export type Comment = {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type Like = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  type: string;
};
