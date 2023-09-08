// vite.config.ts
import { join, resolve } from "path";
import { defineConfig, normalizePath } from "file:///Users/arthas/Desktop/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/vite/dist/node/index.js";
import react from "file:///Users/arthas/Desktop/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteEslint from "file:///Users/arthas/Desktop/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/vite-plugin-eslint/dist/index.mjs";
import svgr from "file:///Users/arthas/Desktop/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/vite-plugin-svgr/dist/index.js";
import viteImagemin from "file:///Users/arthas/Desktop/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/vite-plugin-imagemin/dist/index.mjs";
import { visualizer } from "file:///Users/arthas/Desktop/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "/Users/arthas/Desktop/Code/CodeSummary/ViteV2/test-vite-react-project";
var transformNormalizePath = (fn, ...val) => {
  return normalizePath(fn(...val));
};
var vite_config_default = defineConfig(({ command, mode }) => {
  const isDev = mode === "development";
  const isServe = command === "serve";
  return {
    mode,
    envDir: transformNormalizePath(resolve, __vite_injected_original_dirname, "./config"),
    // .env 文件的位置
    server: {
      port: 8e3
    },
    resolve: {
      alias: {
        "@": transformNormalizePath(join, __vite_injected_original_dirname, "./src")
      }
    },
    publicDir: transformNormalizePath(join, __vite_injected_original_dirname, "./public"),
    optimizeDeps: {
      // 强制进行预构建
      include: ["react", "react-dom"]
    },
    build: {
      target: "esnext",
      sourcemap: false,
      assetsInlineLimit: 4096,
      //小于此阈值 kb 的导入或引用资源将内联为 base64 编码
      minify: !isDev,
      rollupOptions: {
        ...!isDev && !isServe && prodBuildConfig()
      }
    },
    plugins: [
      react({
        // babel: {
        // 	plugins: [
        // 		// 适配 styled-component
        // 		'babel-plugin-styled-components'
        // 	]
        // }
      }),
      viteEslint(),
      svgr(),
      isDev ? devPlugins() : prodPlugins()
    ]
  };
});
var devPlugins = () => [];
var prodPlugins = () => [
  viteImagemin({
    // 无损压缩配置，无损压缩下图片质量不会变差
    optipng: {
      optimizationLevel: 7
    },
    // 有损压缩配置，有损压缩下图片质量可能会变差
    pngquant: {
      quality: [0.8, 0.9]
    }
  }),
  visualizer({ open: true })
];
var prodBuildConfig = () => ({
  output: {
    chunkFileNames: "assets/js/chunk_[name]-[hash:6].js",
    // 引入文件名的名称
    entryFileNames: "assets/js/entry_[name]-[hash:6].js",
    // 包的入口文件名称
    assetFileNames: "assets/[ext]/[name]-[hash:6].[ext]",
    // 资源文件像 字体，图片等
    manualChunks(id) {
      if (id.includes("node_modules")) {
        return "vendor";
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXJ0aGFzL0Rlc2t0b3AvQ29kZS9Db2RlU3VtbWFyeS9WaXRlVjIvdGVzdC12aXRlLXJlYWN0LXByb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hcnRoYXMvRGVza3RvcC9Db2RlL0NvZGVTdW1tYXJ5L1ZpdGVWMi90ZXN0LXZpdGUtcmVhY3QtcHJvamVjdC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXJ0aGFzL0Rlc2t0b3AvQ29kZS9Db2RlU3VtbWFyeS9WaXRlVjIvdGVzdC12aXRlLXJlYWN0LXByb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBqb2luLCByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbm9ybWFsaXplUGF0aCB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgdml0ZUVzbGludCBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnIC8vIGVzbGludFxuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3ZncicgLy8gc3ZnXHU3RUM0XHU0RUY2XHU1MzE2XG5pbXBvcnQgdml0ZUltYWdlbWluIGZyb20gJ3ZpdGUtcGx1Z2luLWltYWdlbWluJyAvLyBcdTU2RkVcdTcyNDdcdTdDN0JcdTU3OEJcdTUzOEJcdTdGMjlcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInIC8vIFx1NjI1M1x1NTMwNVx1NEY1M1x1NzlFRlx1NTIwNlx1Njc5MFxuXG5jb25zdCB0cmFuc2Zvcm1Ob3JtYWxpemVQYXRoID0gKGZuLCAuLi52YWwpID0+IHtcblx0cmV0dXJuIG5vcm1hbGl6ZVBhdGgoZm4oLi4udmFsKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuXHRjb25zdCBpc0RldiA9IG1vZGUgPT09ICdkZXZlbG9wbWVudCdcblx0Y29uc3QgaXNTZXJ2ZSA9IGNvbW1hbmQgPT09ICdzZXJ2ZSdcblx0cmV0dXJuIHtcblx0XHRtb2RlLFxuXHRcdGVudkRpcjogdHJhbnNmb3JtTm9ybWFsaXplUGF0aChyZXNvbHZlLCBfX2Rpcm5hbWUsICcuL2NvbmZpZycpLCAvLyAuZW52IFx1NjU4N1x1NEVGNlx1NzY4NFx1NEY0RFx1N0Y2RVxuXHRcdHNlcnZlcjoge1xuXHRcdFx0cG9ydDogODAwMFxuXHRcdH0sXG5cdFx0cmVzb2x2ZToge1xuXHRcdFx0YWxpYXM6IHtcblx0XHRcdFx0J0AnOiB0cmFuc2Zvcm1Ob3JtYWxpemVQYXRoKGpvaW4sIF9fZGlybmFtZSwgJy4vc3JjJylcblx0XHRcdH1cblx0XHR9LFxuXHRcdHB1YmxpY0RpcjogdHJhbnNmb3JtTm9ybWFsaXplUGF0aChqb2luLCBfX2Rpcm5hbWUsICcuL3B1YmxpYycpLFxuXHRcdG9wdGltaXplRGVwczoge1xuXHRcdFx0Ly8gXHU1RjNBXHU1MjM2XHU4RkRCXHU4ODRDXHU5ODg0XHU2Nzg0XHU1RUZBXG5cdFx0XHRpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddXG5cdFx0fSxcblx0XHRidWlsZDoge1xuXHRcdFx0dGFyZ2V0OiAnZXNuZXh0Jyxcblx0XHRcdHNvdXJjZW1hcDogZmFsc2UsXG5cdFx0XHRhc3NldHNJbmxpbmVMaW1pdDogNDA5NiwgLy9cdTVDMEZcdTRFOEVcdTZCNjRcdTk2MDhcdTUwM0Mga2IgXHU3Njg0XHU1QkZDXHU1MTY1XHU2MjE2XHU1RjE1XHU3NTI4XHU4RDQ0XHU2RTkwXHU1QzA2XHU1MTg1XHU4MDU0XHU0RTNBIGJhc2U2NCBcdTdGMTZcdTc4MDFcblx0XHRcdG1pbmlmeTogIWlzRGV2LFxuXHRcdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0XHQuLi4oIWlzRGV2ICYmICFpc1NlcnZlICYmIHByb2RCdWlsZENvbmZpZygpKVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cGx1Z2luczogW1xuXHRcdFx0cmVhY3Qoe1xuXHRcdFx0XHQvLyBiYWJlbDoge1xuXHRcdFx0XHQvLyBcdHBsdWdpbnM6IFtcblx0XHRcdFx0Ly8gXHRcdC8vIFx1OTAwMlx1OTE0RCBzdHlsZWQtY29tcG9uZW50XG5cdFx0XHRcdC8vIFx0XHQnYmFiZWwtcGx1Z2luLXN0eWxlZC1jb21wb25lbnRzJ1xuXHRcdFx0XHQvLyBcdF1cblx0XHRcdFx0Ly8gfVxuXHRcdFx0fSksXG5cdFx0XHR2aXRlRXNsaW50KCksXG5cdFx0XHRzdmdyKCksXG5cdFx0XHRpc0RldiA/IGRldlBsdWdpbnMoKSA6IHByb2RQbHVnaW5zKClcblx0XHRdXG5cdH1cbn0pXG5cbmNvbnN0IGRldlBsdWdpbnMgPSAoKSA9PiBbXVxuY29uc3QgcHJvZFBsdWdpbnMgPSAoKSA9PiBbXG5cdHZpdGVJbWFnZW1pbih7XG5cdFx0Ly8gXHU2NUUwXHU2MzVGXHU1MzhCXHU3RjI5XHU5MTREXHU3RjZFXHVGRjBDXHU2NUUwXHU2MzVGXHU1MzhCXHU3RjI5XHU0RTBCXHU1NkZFXHU3MjQ3XHU4RDI4XHU5MUNGXHU0RTBEXHU0RjFBXHU1M0Q4XHU1REVFXG5cdFx0b3B0aXBuZzoge1xuXHRcdFx0b3B0aW1pemF0aW9uTGV2ZWw6IDdcblx0XHR9LFxuXHRcdC8vIFx1NjcwOVx1NjM1Rlx1NTM4Qlx1N0YyOVx1OTE0RFx1N0Y2RVx1RkYwQ1x1NjcwOVx1NjM1Rlx1NTM4Qlx1N0YyOVx1NEUwQlx1NTZGRVx1NzI0N1x1OEQyOFx1OTFDRlx1NTNFRlx1ODBGRFx1NEYxQVx1NTNEOFx1NURFRVxuXHRcdHBuZ3F1YW50OiB7XG5cdFx0XHRxdWFsaXR5OiBbMC44LCAwLjldXG5cdFx0fVxuXHR9KSxcblx0dmlzdWFsaXplcih7IG9wZW46IHRydWUgfSlcbl1cblxuY29uc3QgcHJvZEJ1aWxkQ29uZmlnID0gKCkgPT4gKHtcblx0b3V0cHV0OiB7XG5cdFx0Y2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvY2h1bmtfW25hbWVdLVtoYXNoOjZdLmpzJywgLy8gXHU1RjE1XHU1MTY1XHU2NTg3XHU0RUY2XHU1NDBEXHU3Njg0XHU1NDBEXHU3OUYwXG5cdFx0ZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvZW50cnlfW25hbWVdLVtoYXNoOjZdLmpzJywgLy8gXHU1MzA1XHU3Njg0XHU1MTY1XHU1M0UzXHU2NTg3XHU0RUY2XHU1NDBEXHU3OUYwXG5cdFx0YXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoOjZdLltleHRdJywgLy8gXHU4RDQ0XHU2RTkwXHU2NTg3XHU0RUY2XHU1MENGIFx1NUI1N1x1NEY1M1x1RkYwQ1x1NTZGRVx1NzI0N1x1N0I0OVxuXHRcdG1hbnVhbENodW5rcyhpZCkge1xuXHRcdFx0Ly8gXHU1QzA2XHU2QkNGXHU0RTAwXHU0RTJBbm9kZV9tb2R1bGVzXHU1MjA2XHU1MzA1XG5cdFx0XHRpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG5cdFx0XHRcdHJldHVybiAndmVuZG9yJ1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVksU0FBUyxNQUFNLGVBQWU7QUFDL1osU0FBUyxjQUFjLHFCQUFxQjtBQUM1QyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sa0JBQWtCO0FBQ3pCLFNBQVMsa0JBQWtCO0FBTjNCLElBQU0sbUNBQW1DO0FBUXpDLElBQU0seUJBQXlCLENBQUMsT0FBTyxRQUFRO0FBQzlDLFNBQU8sY0FBYyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2hDO0FBRUEsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUNsRCxRQUFNLFFBQVEsU0FBUztBQUN2QixRQUFNLFVBQVUsWUFBWTtBQUM1QixTQUFPO0FBQUEsSUFDTjtBQUFBLElBQ0EsUUFBUSx1QkFBdUIsU0FBUyxrQ0FBVyxVQUFVO0FBQUE7QUFBQSxJQUM3RCxRQUFRO0FBQUEsTUFDUCxNQUFNO0FBQUEsSUFDUDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1IsT0FBTztBQUFBLFFBQ04sS0FBSyx1QkFBdUIsTUFBTSxrQ0FBVyxPQUFPO0FBQUEsTUFDckQ7QUFBQSxJQUNEO0FBQUEsSUFDQSxXQUFXLHVCQUF1QixNQUFNLGtDQUFXLFVBQVU7QUFBQSxJQUM3RCxjQUFjO0FBQUE7QUFBQSxNQUViLFNBQVMsQ0FBQyxTQUFTLFdBQVc7QUFBQSxJQUMvQjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsbUJBQW1CO0FBQUE7QUFBQSxNQUNuQixRQUFRLENBQUM7QUFBQSxNQUNULGVBQWU7QUFBQSxRQUNkLEdBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxnQkFBZ0I7QUFBQSxNQUMzQztBQUFBLElBQ0Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNSLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU9OLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxNQUNYLEtBQUs7QUFBQSxNQUNMLFFBQVEsV0FBVyxJQUFJLFlBQVk7QUFBQSxJQUNwQztBQUFBLEVBQ0Q7QUFDRCxDQUFDO0FBRUQsSUFBTSxhQUFhLE1BQU0sQ0FBQztBQUMxQixJQUFNLGNBQWMsTUFBTTtBQUFBLEVBQ3pCLGFBQWE7QUFBQTtBQUFBLElBRVosU0FBUztBQUFBLE1BQ1IsbUJBQW1CO0FBQUEsSUFDcEI7QUFBQTtBQUFBLElBRUEsVUFBVTtBQUFBLE1BQ1QsU0FBUyxDQUFDLEtBQUssR0FBRztBQUFBLElBQ25CO0FBQUEsRUFDRCxDQUFDO0FBQUEsRUFDRCxXQUFXLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFDMUI7QUFFQSxJQUFNLGtCQUFrQixPQUFPO0FBQUEsRUFDOUIsUUFBUTtBQUFBLElBQ1AsZ0JBQWdCO0FBQUE7QUFBQSxJQUNoQixnQkFBZ0I7QUFBQTtBQUFBLElBQ2hCLGdCQUFnQjtBQUFBO0FBQUEsSUFDaEIsYUFBYSxJQUFJO0FBRWhCLFVBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUNoQyxlQUFPO0FBQUEsTUFDUjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0Q7IiwKICAibmFtZXMiOiBbXQp9Cg==
