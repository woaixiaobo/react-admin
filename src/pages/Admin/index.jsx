import React from "react";
import Visits from "./components/Visits";
import Sales from "./components/Sales";
// import Search from "./components/Search";
import Search from "./components/SearchRight";
import Static from "./components/Static";
export default function index() {
	return (
		<div>
			<Visits />
			<Sales />
			<Search />
			<Static />
		</div>
	);
}
