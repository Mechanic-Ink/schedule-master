import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
