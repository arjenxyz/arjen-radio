// app/api/lofi/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Önbelleği kapatır, her zaman taze veri çeker

export async function GET() {
  try {
    // Supabase bağlantısını sunucu tarafında kuruyoruz
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Şarkıları Çek
    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .select('*')
      .order('id', { ascending: true });

    if (tracksError) throw tracksError;

    // 2. Sahneleri Çek
    const { data: scenes, error: scenesError } = await supabase
      .from('scenes')
      .select('*')
      .order('id', { ascending: true });

    if (scenesError) throw scenesError;

    // Başarılı olursa JSON döndür
    return NextResponse.json({ 
      success: true, 
      tracks, 
      scenes 
    });

  } catch (error: unknown) {
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}