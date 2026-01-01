export function latest<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) {
  let lastCallId = 0;

  return async (...args: TArgs): Promise<TResult | undefined> => {
    const callId = ++lastCallId;

    try {
      const result = await fn(...args);

      // Only the latest call is allowed to succeed
      if (callId === lastCallId) {
        return result;
      }

      // Older call → ignore result
      return undefined;
    } catch (error) {
      // Only the latest call should throw
      if (callId === lastCallId) {
        throw error;
      }

      return undefined;
    }
  };
}
