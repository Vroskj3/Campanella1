import React, { useMemo } from "react";
import LoginPage from "./LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./utils/trpc";
import HomePage from "./homepage";

//maybe change security code with something else.
//an idea is a random code generated by the raspberry pi,
//saved in the db but deleted after the login or after like 5 minutes

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:2022",
        }),
      ],
    })
  );

  const [isLogged, setLogged] = useState(false);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {isLogged ? <HomePage /> : <LoginPage setLogged={setLogged} />}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
