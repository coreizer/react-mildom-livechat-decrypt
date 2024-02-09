import { createRoot } from "react-dom/client";
import App from "./components/App";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

window.Buffer = window.Buffer || require("buffer").Buffer;

const contianer = document.getElementById("root");
const root = createRoot(contianer);

root.render(
  <MantineProvider defaultColorScheme="dark">
    <App />
  </MantineProvider>
);
