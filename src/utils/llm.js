// src/utils/llm.js
// Wrapper leve — o usuário configura o SDK/modelo fora do pacote.
// O pacote apenas chama via env var ou SDK previamente instalado no projeto.

async function call({ model, prompt, systemPrompt, maxTokens = 4096 }) {
  // Detecta qual SDK está disponível no projeto que consome o pacote
  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic();
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.content[0].text;
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'SDK não encontrado. Instale @anthropic-ai/sdk no seu projeto: npm install @anthropic-ai/sdk'
      );
    }
    throw e;
  }
}

module.exports = { call };
