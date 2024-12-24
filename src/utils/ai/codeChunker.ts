import { generateWithGroq } from './providers/groqProvider';
import { generateWithOpenAI } from './providers/openaiProvider';

interface ChunkResult {
  chunks: string[];
  totalTokens: number;
}

export const MAX_TOKENS_PER_CHUNK = 4000;

export const chunkCode = (code: string): ChunkResult => {
  const lines = code.split('\n');
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentTokens = 0;
  
  const estimateTokens = (text: string) => Math.ceil(text.length / 4);
  
  for (const line of lines) {
    const lineTokens = estimateTokens(line);
    
    if (currentTokens + lineTokens > MAX_TOKENS_PER_CHUNK && currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n'));
      currentChunk = [];
      currentTokens = 0;
    }
    
    currentChunk.push(line);
    currentTokens += lineTokens;
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n'));
  }
  
  return {
    chunks,
    totalTokens: chunks.reduce((total, chunk) => total + estimateTokens(chunk), 0)
  };
};

export const processCodeChunks = async (
  chunks: string[],
  provider: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  let contextSummary = '';
  const apiKey = localStorage.getItem(`${provider}_api_key`);
  
  if (!apiKey) {
    throw new Error(`${provider.toUpperCase()} API key is required`);
  }
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const progress = Math.round(((i + 1) / chunks.length) * 100);
    
    const chunkAnalysis = await analyzeCodeChunk(chunk, provider, apiKey);
    contextSummary += chunkAnalysis + '\n\n';
    
    onProgress?.(progress);
  }
  
  return contextSummary;
};

const analyzeCodeChunk = async (chunk: string, provider: string, apiKey: string): Promise<string> => {
  const prompt = `Analyze this code chunk and provide a concise summary of its key components and functionality:

${chunk}

Focus on:
1. Main functions/components
2. Key dependencies
3. Core functionality
4. Important patterns or structures`;

  return provider === 'groq' 
    ? await generateWithGroq(prompt, apiKey, 'concise')
    : await generateWithOpenAI(prompt, apiKey, 'concise');
};