import { describe, expect, it } from 'vitest';

import { parseGroqChatRequest } from './groq-request';

describe('parseGroqChatRequest', () => {
  it('accepts a bounded conversation and optional product context', () => {
    expect(
      parseGroqChatRequest({
        messages: [{ sender: 'user', text: 'Help me choose lunch.' }],
        contextProduct: { name: 'Soup', categoryLabel: 'Ready meal', nutrition: { sodiumMg: 420, sugarG: 2 } },
      })
    ).toMatchObject({ messages: [{ sender: 'user', text: 'Help me choose lunch.' }] });
  });

  it('rejects a message that exceeds the request size limit', () => {
    expect(() =>
      parseGroqChatRequest({ messages: [{ sender: 'user', text: 'a'.repeat(1001) }] })
    ).toThrow();
  });

  it('rejects extra request fields that could bypass the route contract', () => {
    expect(() =>
      parseGroqChatRequest({
        messages: [{ sender: 'user', text: 'hello' }],
        apiKey: 'client-supplied-key',
      })
    ).toThrow();
  });
});
