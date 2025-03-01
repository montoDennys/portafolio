import path, { resolve } from "node:path";
import { defineConfig } from "vite";
import * as glob from "glob";
import htmlPurge from "vite-plugin-purgecss";

const obtenerEntradaHtml = () => {
    return Object.fromEntries(
        glob.sync("./**/*.html", { ignore: ["./dist/**", "./node_modules/**"] }).map(
            fileData => [
                fileData.slice(0, fileData.length - path.extname(fileData).length),
                resolve(__dirname, fileData)
            ]
        )
    );
};

export default defineConfig({
    appType: "mpa", // Configurar como Multi-Page Applicatio
    base: process.env.DEPLOY_BASE_URL,
    build: {
        rollupOptions: {
            input: obtenerEntradaHtml(),
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true, // Habilita características avanzadas de Less
            },
        },
    },
    plugins: [
        htmlPurge({
            content: ["./**/*.html", "./**/*.js"], // Analiza estos archivos en busca de clases CSS usadas
            safelist: ["active", "show"], // Evita eliminar clases dinámicas
        })
    ]
});
