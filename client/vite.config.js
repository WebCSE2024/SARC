import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      shared: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../../shared"
      ),
    },
  },
  server: {
    port: 3005,
    fs: {
      // Allow importing from parent (SARC) and grandparent (workspace root)
      allow: ["..", "../.."],
    },
  },
});
