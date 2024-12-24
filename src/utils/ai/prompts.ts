interface CodeContext {
  originalCode?: string;
  sectionTitle?: string;
  sectionContent?: string;
}

export const getPromptTemplate = (style: 'concise' | 'detailed') => {
  const templates = {
    concise: `Create concise documentation with:
    # 📝 Quick Overview
    Brief 2-3 sentence summary`,
    detailed: `Create detailed documentation with:
    # 📝 Documentation Overview
    Comprehensive overview of purpose and context`
  };
  return templates[style];
};

export const createContextAwarePrompt = (
  title: string,
  originalContent: string,
  userInput: string = '',
  style: 'concise' | 'detailed',
  context?: CodeContext
) => {
  const contextualInformation = context?.originalCode 
    ? `\nRelated code context:\n${context.originalCode}`
    : '';

  return `You are analyzing a section titled "${title}" within a larger codebase.
Current content explains: ${originalContent}

${contextualInformation}

${userInput ? `User requested changes: ${userInput}

Based on the user's request and the original code context, please provide a ${style === 'concise' ? 'concise' : 'detailed'} explanation that:
- Addresses the specific user requirements
- Maintains technical accuracy
- References relevant parts of the code
- Explains the implementation details` : `Please regenerate this section ${style === 'concise' ? 'concisely' : 'in detail'}, maintaining:`}

Key requirements:
- Maintain technical accuracy and depth
- Focus on practical implementation details
- Include relevant code references
- Keep the original context and purpose
- ${style === 'concise' ? 'Be brief and to the point' : 'Provide comprehensive explanations'}

Do not include any section headers or templates - focus only on the content.`;
};

export const createSectionRegenerationPrompt = (
  title: string,
  originalContent: string,
  userInput: string = '',
  style: 'concise' | 'detailed'
) => {
  return createContextAwarePrompt(title, originalContent, userInput, style);
};