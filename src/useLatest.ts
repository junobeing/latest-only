import { useRef, useCallback } from "react";
import { latest } from "./latest.js";

export function useLatest<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) {
  const latestFnRef = useRef<ReturnType<typeof latest<TArgs, TResult>> | null>(null);


  if (!latestFnRef.current) {
    latestFnRef.current = latest(fn);
  }

  return useCallback(
    (...args: TArgs) => {
      return latestFnRef.current!(...args);
    },
    []
  );
}
