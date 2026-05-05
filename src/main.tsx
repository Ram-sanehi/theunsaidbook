import type {} from "@tanstack/react-start/client";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

hydrateRoot(document.getElementById("root")!, <StartClient />);
