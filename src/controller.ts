type AsyncFn<T> = () => Promise<T>;

export function createController() {
  const latestRunMap = new Map<string, number>();

  async function run<T>(
    key: string,
    fn: AsyncFn<T>
  ): Promise<T | undefined> {
    const runId = (latestRunMap.get(key) ?? 0) + 1;
    latestRunMap.set(key, runId);

    try {
      const result = await fn();

      // Allow result only if this is still the latest run
      if (latestRunMap.get(key) === runId) {
        return result;
      }

      return undefined;
    } catch (error) {
      if (latestRunMap.get(key) === runId) {
        throw error;
      }
      return undefined;
    }
  }

  return { run };
}
