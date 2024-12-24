import { chunkCode, processCodeChunks, MAX_TOKENS_PER_CHUNK } from './ai/codeChunker';
import { generateWithGroq } from './ai/providers/groqProvider';
import { generateWithOpenAI } from './ai/providers/openaiProvider';
import { withRetry } from './api/retryLogic';
import { toast } from 'sonner';

export const generateDocumentation = async (
  code: string,
  provider: string,
  style: 'concise' | 'detailed' = 'detailed',
  isSection: boolean = false,
  originalContent?: string,
  userInput?: string,
  codeContext?: any
) => {
  const apiKey = localStorage.getItem(`${provider}_api_key`);
  if (!apiKey) {
    throw new Error(`${provider.toUpperCase()} API key is required`);
  }

  try {
    // If it's a section regeneration or small code, process directly
    if (isSection || code.length < MAX_TOKENS_PER_CHUNK * 4) {
      return await withRetry(() => 
        generateDirectly(code, provider, style, apiKey, originalContent, userInput)
      );
    }

    // For large code bases, use chunking
    const { chunks } = chunkCode(code);
    
    if (chunks.length > 1) {
      toast.info(`Processing large codebase in ${chunks.length} parts...`);
    }

    // Process chunks and get context
    const context = await processCodeChunks(chunks, provider, (progress) => {
      toast.info(`Analyzing code: ${progress}%`);
    });

    // Generate final documentation with gathered context
    const finalPrompt = createDocumentationPrompt(context, style, userInput);
    return await withRetry(() => 
      provider === 'groq' 
        ? generateWithGroq(finalPrompt, apiKey)
        : generateWithOpenAI(finalPrompt, apiKey)
    );
  } catch (error) {
    console.error('Documentation generation error:', error);
    throw error;
  }
};

const generateDirectly = async (
  code: string,
  provider: string,
  style: string,
  apiKey: string,
  originalContent?: string,
  userInput?: string
): Promise<string> => {
  const prompt = createDocumentationPrompt(code, style, userInput);
  return provider === 'groq'
    ? await generateWithGroq(prompt, apiKey)
    : await generateWithOpenAI(prompt, apiKey);
};

const createDocumentationPrompt = (
  codeOrContext: string,
  style: string,
  userInput?: string
): string => {
  const styleGuide = style === 'concise'
    ? 'Create concise, focused documentation'
    : 'Create detailed, comprehensive documentation';

  return `${styleGuide} for the following code/context:

${codeOrContext}

${userInput ? `Additional requirements: ${userInput}` : ''}

Focus on:
1. Clear explanation of functionality
2. Usage examples where relevant
3. Key components and their interactions
4. Important dependencies and requirements

Format the response in Markdown.`;
};