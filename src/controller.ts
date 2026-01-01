type AsyncFn<T> = (ctx: { signal: AbortSignal }) => Promise<T>;

export function createController() {
  const latestRunMap = new Map<string, number>();
  const abortMap = new Map<string, AbortController>();

  async function run<T>(
    key: string,
    fn: AsyncFn<T>
  ): Promise<T | undefined> {
    // Abort previous request for this key
    abortMap.get(key)?.abort();

    const controller = new AbortController();
    abortMap.set(key, controller);

    const runId = (latestRunMap.get(key) ?? 0) + 1;
    latestRunMap.set(key, runId);

    try {
      const result = await fn({ signal: controller.signal });

      if (latestRunMap.get(key) === runId) {
        return result;
      }

      return undefined;
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return undefined;
      }

      if (latestRunMap.get(key) === runId) {
        throw error;
      }

      return undefined;
    }
  }

  return { run };
}
