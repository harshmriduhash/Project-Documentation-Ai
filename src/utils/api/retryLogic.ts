const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 500
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // If it's a rate limit error, wait for the specified time
      if (error?.status === 429) {
        const retryAfter = error?.body ? 
          JSON.parse(error.body)?.error?.message?.match(/try again in (\d+)ms/)?.[1] : 
          baseDelay * Math.pow(2, attempt);
        
        await wait(Number(retryAfter) || baseDelay * Math.pow(2, attempt));
        continue;
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }
  
  throw lastError;
}