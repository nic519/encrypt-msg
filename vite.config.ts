import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import { resolve } from "path"

export default defineConfig({
    plugins: [preact()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    build: {
        outDir: "dist",
        assetsDir: "assets",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
            },
        },
    },
    server: {
        port: 3000,
        open: true,
    },
})
