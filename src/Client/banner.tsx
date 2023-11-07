import { useState } from "react";
import { trpc } from "./utils/trpc";

export default function Banner() {
	const creator = trpc.creator.useQuery().data;
	const [seeAssociate, setSeeAssociate] = useState("hidden");
	return (
		<button
			className="mb-1 p-1 border rounded-md bg-black text-gray-300 text-xs focus:outline-none"
			onClick={() => {
				if (seeAssociate) {
					setSeeAssociate("");
				} else {
					setSeeAssociate("hidden");
				}
			}}
		>
			Made by {creator?.creator}®
			<div className={seeAssociate}>Associate Alessio Cavallaro</div>
		</button>
	);
}
