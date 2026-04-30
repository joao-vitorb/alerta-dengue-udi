import { useEffect, useState } from "react";
import { getErrorMessage } from "../utils/errorMessage";

type AsyncResourceOptions = {
  enabled?: boolean;
  fallbackErrorMessage: string;
};

type AsyncResourceState<T> = {
  data: T | null;
  isLoading: boolean;
  errorMessage: string | null;
};

export function useAsyncResource<T>(
  loader: () => Promise<T>,
  dependencies: ReadonlyArray<unknown>,
  options: AsyncResourceOptions,
): AsyncResourceState<T> {
  const enabled = options.enabled ?? true;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    loader()
      .then((response) => {
        if (!isMounted) return;
        setData(response);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setData(null);
        setErrorMessage(getErrorMessage(error, options.fallbackErrorMessage));
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, isLoading, errorMessage };
}
