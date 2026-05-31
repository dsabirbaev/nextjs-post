import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!q.trim()) {
      return NextResponse.json([]);
    }

    // Ищи по title и content
    const { data } = await supabase
      .from('posts')
      .select('*,users(id, name, avatar_url), comments(count), likes(count)')
      .or(
        `title.ilike.%${q}%,content.ilike.%${q}%` // ← поиск по обоим
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + 9);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
