import { QueryClient } from "@adeora/solid-query";
import type { IAppRouter } from "~/server/trpc/router/_app";
import { createTRPCSolidStart } from "solid-trpc";
import { httpBatchLink } from "@trpc/client";
import { isServer } from "solid-js/web";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCSolidStart<IAppRouter>({
  config(event) {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers: () => {
            if (event?.request && isServer) {
              const headers = event.request.headers;
              headers.delete("connection");
              return {
                ...headers,
                "x-ssr": "1",
              };
            }
            return {};
          },
        }),
      ],
    };
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      _optimisticResults: "optimistic",
      refetchOnWindowFocus: true,
    },
  },
});
