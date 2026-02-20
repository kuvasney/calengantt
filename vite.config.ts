import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

function deferStyles(): Plugin {
  return {
    name: "defer-styles",
    enforce: "post",
    transformIndexHtml(html: string) {
      return html.replace(
        /<link\s+[^>]*rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g,
        (match, href) => {
          const attrs = match
            .replace(/<link\s+/i, "")
            .replace(/>/g, "")
            .replace(/\s*rel="stylesheet"/i, "")
            .replace(/\s*href="[^"]+\.css"/i, "")
            .trim();

          return [
            `<link rel="preload" as="style" href="${href}" ${attrs} onload="this.onload=null;this.rel='stylesheet'">`,
            `<noscript><link rel="stylesheet" href="${href}" ${attrs}></noscript>`,
          ].join("");
        },
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), deferStyles()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/stores/hooks"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@stores": path.resolve(__dirname, "./src/stores"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
