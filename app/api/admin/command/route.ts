import { NextRequest } from 'next/server';
import { runClaude } from '@/lib/admin/claude';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt?.trim()) {
    return new Response(JSON.stringify({ error: '指令不能为空' }), { status: 400 });
  }

  const child = runClaude(prompt.trim());

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      child.stdout?.on('data', (chunk: Buffer) => {
        controller.enqueue(encoder.encode(chunk.toString()));
      });

      child.stderr?.on('data', (chunk: Buffer) => {
        controller.enqueue(encoder.encode(`[stderr] ${chunk.toString()}`));
      });

      child.on('close', (code) => {
        controller.enqueue(encoder.encode(`\n--- 进程结束 (exit code: ${code}) ---`));
        controller.close();
      });

      child.on('error', (err) => {
        controller.enqueue(encoder.encode(`[error] ${err.message}`));
        controller.close();
      });
    },

    cancel() {
      child.kill();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
