import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-opus-4-8';
const MAX_TOKENS = 4096;

export function createCoachClient(apiKey) {
  // dangerouslyAllowBrowser: the key is entered by the user into their own
  // browser session and sent directly to Anthropic — it never touches any
  // server this app controls. See the SDK's own warning before using this
  // outside a single-user, user-supplied-key context.
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

/**
 * Streams a coach reply. Yields plain-text deltas as they arrive; resolves
 * with the full accumulated text as the generator's return value.
 */
export async function* streamCoachReply(client, { system, messages }) {
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    thinking: { type: 'adaptive' },
    system,
    messages,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}

export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.slice(result.indexOf(',') + 1);
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
