import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/oa/",
    plugins: [
        //
        vue({ template: { transformAssetUrls } }),
        quasar({
            sassVariables: "src/assets/quasar-variables.scss",
        }),
    ],
    define: { "process.env": {} },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 3000,
        proxy: {
            "/qqlx": {
                target: "http://localhost:3001",
                changeOrigin: true,
                rewrite: (path) => path,
            },
        },
    },
});
