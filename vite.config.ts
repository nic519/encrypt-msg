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
        host: true, // 或者使用 '0.0.0.0'，允许外部访问
        port: 3000,
        open: true,
        strictPort: false, // 如果端口被占用，自动尝试下一个端口
        // 添加CORS支持，虽然通常不需要，但在某些情况下可能有用
        cors: true,
        // 添加网络相关配置
        hmr: {
            host: "localhost", // HMR 可以保持localhost，避免网络问题
        },
    },
})
