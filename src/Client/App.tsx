import React, { useMemo } from "react";
import LoginPage from "./LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./utils/trpc";
import HomePage from "./homepage";
import { Home } from "@blueprintjs/icons/lib/esm/generated-icons/16px/paths";

function App() {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: "http://localhost:2022",
				}),
			],
		}),
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
