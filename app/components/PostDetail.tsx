type Post = {
  title: string;
  content: string;
  created_at: string;
};

export default function PostDetail({ post }: { post: Post }) {
  return (
    <>
      <h1 className="text-3xl font-medium text-gray-900 mt-4 mb-1 dark:text-gray-400">
        {post.title}
      </h1>
      <p className="text-xs text-gray-400 mb-8 pb-2 border-b border-gray-100">
        myBlog ·{' '}
        {new Date(post.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap dark:text-gray-400">
        {post.content}
      </p>
    </>
  );
}
