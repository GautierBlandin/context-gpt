import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'CLAUDE_API_KEY is not set in the environment variables' }, { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const { messages } = await req.json();

  const anthropicStream = await client.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1000,
    messages: messages.map((msg: any) => ({
      role: msg.sender === 'User' ? 'user' : 'assistant',
      content: msg.content,
    })),
    stream: true,
  });

  (async () => {
    try {
      for await (const chunk of anthropicStream) {
        if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ content: chunk.delta.text })}\n\n`));
        }
      }
      await writer.write(encoder.encode('data: [DONE]\n\n'));
    } catch (error) {
      console.error('Error calling Claude API:', error);
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`));
    } finally {
      await writer.close();
    }
  })();

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
