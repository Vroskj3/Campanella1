import React from "react"
import LoginPage from "./LoginPage"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';

//use trpc for database, not sure if use also sqlite3 in case of not using it remove it's module

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:2022',
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App
