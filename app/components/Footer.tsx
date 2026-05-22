import Link from 'next/link';
export default async function Footer() {
  return (
    <footer className="border-t mt-2">
      <div className="container mx-auto px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-semibold">myBlog</h2>
          <p className="text-sm text-muted-foreground">
            Share posts, connect with people, and explore new ideas.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} myBlog. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
