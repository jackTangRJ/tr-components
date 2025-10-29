import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob"; // 需要安装 glob 库
import path from "node:path";
import { fileURLToPath } from "node:url";

const entryPoints = Object.fromEntries(
  glob.sync("src/components/**/*.ts").map(file => [
    // 这部分是关键，它会生成一个相对路径作为输出文件名
    // 'src/components/button/button.ts' => 'button/button'
    path.relative(
      "src/components",
      file.slice(0, file.length - path.extname(file).length)
    ),
    // 创建一个绝对路径
    fileURLToPath(new URL(file, import.meta.url)),
  ])
);

export default defineConfig(({ mode }) => {
  const isUmdBuild = mode === "umd";
  return {
    build: {
      lib: {
        entry: entryPoints,
        name: "tr",
        fileName: format => `${format}.js`,
        formats: ["es"],
      },
      // 在生产构建时混淆代码，减小体积
      minify: true,
      emptyOutDir: true,
      outDir: isUmdBuild ? "dist/umd" : "dist/es",
      rollupOptions: {
        // 外部化 lit，避免打包进去
        external: isUmdBuild ? [] : [/^lit/],
        output: {
          entryFileNames: "[name].js",
          assetFileNames: assetInfo => {
            if (assetInfo.name.endsWith(".css")) {
              return "common.css";
            }
            return "[name][extname]";
          },
          globals: {},
        },
      },
    },
  };
});
