// vite.config.ts
import { join, resolve } from "path";
import {
  defineConfig as defineConfig3,
  normalizePath,
  mergeConfig,
  loadEnv
} from "file:///D:/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteEslint from "file:///D:/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/vite-plugin-eslint/dist/index.mjs";
import svgr from "file:///D:/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/vite-plugin-svgr/dist/index.js";

// config/prod.config.ts
import { defineConfig } from "file:///D:/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/vite/dist/node/index.js";
import viteImagemin from "file:///D:/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/vite-plugin-imagemin/dist/index.mjs";
import { visualizer } from "file:///D:/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var prod_config_default = defineConfig(({ command }) => {
  const isServe = command === "serve";
  return {
    build: {
      sourcemap: false,
      rollupOptions: !isServe ? {
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
      } : {}
    },
    plugins: [
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
    ]
  };
});

// config/dev.config.ts
import { defineConfig as defineConfig2 } from "file:///D:/Code/CodeSummary/ViteV2/test-vite-react-project/node_modules/vite/dist/node/index.js";
var dev_config_default = defineConfig2(({ command }) => {
  const isServe = command === "serve";
  return {
    server: {
      port: 8e3
    },
    build: {
      sourcemap: true
    },
    plugins: []
  };
});

// vite.config.ts
var __vite_injected_original_dirname = "D:\\Code\\CodeSummary\\ViteV2\\test-vite-react-project";
var transformNormalizePath = (fn, ...val) => {
  return normalizePath(fn(...val));
};
var vite_config_default = defineConfig3((props) => {
  const { mode } = props;
  const isProd = mode === "production";
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const baseConfig = {
    root,
    mode,
    base: "",
    envDir: transformNormalizePath(resolve, __vite_injected_original_dirname, "./config"),
    // .env 文件的位置
    resolve: {
      alias: {
        "@": transformNormalizePath(join, __vite_injected_original_dirname, "./src")
      }
    },
    publicDir: transformNormalizePath(join, __vite_injected_original_dirname, "./public"),
    // css: {
    // 	postcss: {
    // 		plugins: [
    // 			autoprefixer({
    // 				overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
    // 			})
    // 		]
    // 	}
    // },
    optimizeDeps: {
      // 强制进行预构建
      include: ["react", "react-dom"]
    },
    build: {
      target: "esnext",
      assetsInlineLimit: 4096,
      //小于此阈值 kb 的导入或引用资源将内联为 base64 编码
      reportCompressedSize: false
      // 禁用 gzip 压缩大小报告
    },
    preview: {
      port: 8040
    },
    plugins: [
      react({
        babel: {
          plugins: [
            // 适配 styled-component
            "babel-plugin-styled-components"
          ]
        }
      }),
      viteEslint(),
      svgr()
    ]
  };
  return mergeConfig(
    baseConfig,
    isProd ? prod_config_default(props) : dev_config_default(props),
    false
  );
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29uZmlnL3Byb2QuY29uZmlnLnRzIiwgImNvbmZpZy9kZXYuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcQ29kZVxcXFxDb2RlU3VtbWFyeVxcXFxWaXRlVjJcXFxcdGVzdC12aXRlLXJlYWN0LXByb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXENvZGVcXFxcQ29kZVN1bW1hcnlcXFxcVml0ZVYyXFxcXHRlc3Qtdml0ZS1yZWFjdC1wcm9qZWN0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Db2RlL0NvZGVTdW1tYXJ5L1ZpdGVWMi90ZXN0LXZpdGUtcmVhY3QtcHJvamVjdC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGpvaW4sIHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHtcblx0ZGVmaW5lQ29uZmlnLFxuXHRub3JtYWxpemVQYXRoLFxuXHRtZXJnZUNvbmZpZyxcblx0VXNlckNvbmZpZyxcblx0bG9hZEVudlxufSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHZpdGVFc2xpbnQgZnJvbSAndml0ZS1wbHVnaW4tZXNsaW50JyAvLyBlc2xpbnRcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InIC8vIHN2Z1x1N0VDNFx1NEVGNlx1NTMxNlxuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInXG5cbmltcG9ydCBwcm9kQ29uZmlnIGZyb20gJy4vY29uZmlnL3Byb2QuY29uZmlnJ1xuaW1wb3J0IGRldkNvbmZpZyBmcm9tICcuL2NvbmZpZy9kZXYuY29uZmlnJ1xuXG5jb25zdCB0cmFuc2Zvcm1Ob3JtYWxpemVQYXRoID0gKGZuLCAuLi52YWwpID0+IHtcblx0cmV0dXJuIG5vcm1hbGl6ZVBhdGgoZm4oLi4udmFsKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKChwcm9wcykgPT4ge1xuXHRjb25zdCB7IG1vZGUgfSA9IHByb3BzXG5cdGNvbnN0IGlzUHJvZCA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJ1xuXHRjb25zdCByb290ID0gcHJvY2Vzcy5jd2QoKVxuXHRjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHJvb3QpXG5cdGNvbnN0IGJhc2VDb25maWc6IFVzZXJDb25maWcgPSB7XG5cdFx0cm9vdCxcblx0XHRtb2RlLFxuXHRcdGJhc2U6ICcnLFxuXHRcdGVudkRpcjogdHJhbnNmb3JtTm9ybWFsaXplUGF0aChyZXNvbHZlLCBfX2Rpcm5hbWUsICcuL2NvbmZpZycpLCAvLyAuZW52IFx1NjU4N1x1NEVGNlx1NzY4NFx1NEY0RFx1N0Y2RVxuXHRcdHJlc29sdmU6IHtcblx0XHRcdGFsaWFzOiB7XG5cdFx0XHRcdCdAJzogdHJhbnNmb3JtTm9ybWFsaXplUGF0aChqb2luLCBfX2Rpcm5hbWUsICcuL3NyYycpXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwdWJsaWNEaXI6IHRyYW5zZm9ybU5vcm1hbGl6ZVBhdGgoam9pbiwgX19kaXJuYW1lLCAnLi9wdWJsaWMnKSxcblx0XHQvLyBjc3M6IHtcblx0XHQvLyBcdHBvc3Rjc3M6IHtcblx0XHQvLyBcdFx0cGx1Z2luczogW1xuXHRcdC8vIFx0XHRcdGF1dG9wcmVmaXhlcih7XG5cdFx0Ly8gXHRcdFx0XHRvdmVycmlkZUJyb3dzZXJzbGlzdDogWydDaHJvbWUgPiA0MCcsICdmZiA+IDMxJywgJ2llIDExJ11cblx0XHQvLyBcdFx0XHR9KVxuXHRcdC8vIFx0XHRdXG5cdFx0Ly8gXHR9XG5cdFx0Ly8gfSxcblx0XHRvcHRpbWl6ZURlcHM6IHtcblx0XHRcdC8vIFx1NUYzQVx1NTIzNlx1OEZEQlx1ODg0Q1x1OTg4NFx1Njc4NFx1NUVGQVxuXHRcdFx0aW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nXVxuXHRcdH0sXG5cdFx0YnVpbGQ6IHtcblx0XHRcdHRhcmdldDogJ2VzbmV4dCcsXG5cdFx0XHRhc3NldHNJbmxpbmVMaW1pdDogNDA5NiwgLy9cdTVDMEZcdTRFOEVcdTZCNjRcdTk2MDhcdTUwM0Mga2IgXHU3Njg0XHU1QkZDXHU1MTY1XHU2MjE2XHU1RjE1XHU3NTI4XHU4RDQ0XHU2RTkwXHU1QzA2XHU1MTg1XHU4MDU0XHU0RTNBIGJhc2U2NCBcdTdGMTZcdTc4MDFcblx0XHRcdHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSAvLyBcdTc5ODFcdTc1MjggZ3ppcCBcdTUzOEJcdTdGMjlcdTU5MjdcdTVDMEZcdTYyQTVcdTU0NEFcblx0XHR9LFxuXHRcdHByZXZpZXc6IHtcblx0XHRcdHBvcnQ6IDgwNDBcblx0XHR9LFxuXHRcdHBsdWdpbnM6IFtcblx0XHRcdHJlYWN0KHtcblx0XHRcdFx0YmFiZWw6IHtcblx0XHRcdFx0XHRwbHVnaW5zOiBbXG5cdFx0XHRcdFx0XHQvLyBcdTkwMDJcdTkxNEQgc3R5bGVkLWNvbXBvbmVudFxuXHRcdFx0XHRcdFx0J2JhYmVsLXBsdWdpbi1zdHlsZWQtY29tcG9uZW50cydcblx0XHRcdFx0XHRdXG5cdFx0XHRcdH1cblx0XHRcdH0pLFxuXHRcdFx0dml0ZUVzbGludCgpLFxuXHRcdFx0c3ZncigpXG5cdFx0XVxuXHR9XG5cdHJldHVybiBtZXJnZUNvbmZpZyhcblx0XHRiYXNlQ29uZmlnLFxuXHRcdGlzUHJvZCA/IHByb2RDb25maWcocHJvcHMpIDogZGV2Q29uZmlnKHByb3BzKSxcblx0XHRmYWxzZVxuXHQpXG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxDb2RlXFxcXENvZGVTdW1tYXJ5XFxcXFZpdGVWMlxcXFx0ZXN0LXZpdGUtcmVhY3QtcHJvamVjdFxcXFxjb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXENvZGVcXFxcQ29kZVN1bW1hcnlcXFxcVml0ZVYyXFxcXHRlc3Qtdml0ZS1yZWFjdC1wcm9qZWN0XFxcXGNvbmZpZ1xcXFxwcm9kLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovQ29kZS9Db2RlU3VtbWFyeS9WaXRlVjIvdGVzdC12aXRlLXJlYWN0LXByb2plY3QvY29uZmlnL3Byb2QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2aXRlSW1hZ2VtaW4gZnJvbSAndml0ZS1wbHVnaW4taW1hZ2VtaW4nIC8vIFx1NTZGRVx1NzI0N1x1N0M3Qlx1NTc4Qlx1NTM4Qlx1N0YyOVxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcicgLy8gXHU2MjUzXHU1MzA1XHU0RjUzXHU3OUVGXHU1MjA2XHU2NzkwXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+IHtcblx0Y29uc3QgaXNTZXJ2ZSA9IGNvbW1hbmQgPT09ICdzZXJ2ZSdcblx0cmV0dXJuIHtcblx0XHRidWlsZDoge1xuXHRcdFx0c291cmNlbWFwOiBmYWxzZSxcblx0XHRcdHJvbGx1cE9wdGlvbnM6ICFpc1NlcnZlXG5cdFx0XHRcdD8ge1xuXHRcdFx0XHRcdFx0b3V0cHV0OiB7XG5cdFx0XHRcdFx0XHRcdGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL2pzL2NodW5rX1tuYW1lXS1baGFzaDo2XS5qcycsIC8vIFx1NUYxNVx1NTE2NVx1NjU4N1x1NEVGNlx1NTQwRFx1NzY4NFx1NTQwRFx1NzlGMFxuXHRcdFx0XHRcdFx0XHRlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9qcy9lbnRyeV9bbmFtZV0tW2hhc2g6Nl0uanMnLCAvLyBcdTUzMDVcdTc2ODRcdTUxNjVcdTUzRTNcdTY1ODdcdTRFRjZcdTU0MERcdTc5RjBcblx0XHRcdFx0XHRcdFx0YXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoOjZdLltleHRdJywgLy8gXHU4RDQ0XHU2RTkwXHU2NTg3XHU0RUY2XHU1MENGIFx1NUI1N1x1NEY1M1x1RkYwQ1x1NTZGRVx1NzI0N1x1N0I0OVxuXHRcdFx0XHRcdFx0XHRtYW51YWxDaHVua3MoaWQpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBcdTVDMDZcdTZCQ0ZcdTRFMDBcdTRFMkFub2RlX21vZHVsZXNcdTUyMDZcdTUzMDVcblx0XHRcdFx0XHRcdFx0XHRpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gJ3ZlbmRvcidcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0ICB9XG5cdFx0XHRcdDoge31cblx0XHR9LFxuXHRcdHBsdWdpbnM6IFtcblx0XHRcdHZpdGVJbWFnZW1pbih7XG5cdFx0XHRcdC8vIFx1NjVFMFx1NjM1Rlx1NTM4Qlx1N0YyOVx1OTE0RFx1N0Y2RVx1RkYwQ1x1NjVFMFx1NjM1Rlx1NTM4Qlx1N0YyOVx1NEUwQlx1NTZGRVx1NzI0N1x1OEQyOFx1OTFDRlx1NEUwRFx1NEYxQVx1NTNEOFx1NURFRVxuXHRcdFx0XHRvcHRpcG5nOiB7XG5cdFx0XHRcdFx0b3B0aW1pemF0aW9uTGV2ZWw6IDdcblx0XHRcdFx0fSxcblx0XHRcdFx0Ly8gXHU2NzA5XHU2MzVGXHU1MzhCXHU3RjI5XHU5MTREXHU3RjZFXHVGRjBDXHU2NzA5XHU2MzVGXHU1MzhCXHU3RjI5XHU0RTBCXHU1NkZFXHU3MjQ3XHU4RDI4XHU5MUNGXHU1M0VGXHU4MEZEXHU0RjFBXHU1M0Q4XHU1REVFXG5cdFx0XHRcdHBuZ3F1YW50OiB7XG5cdFx0XHRcdFx0cXVhbGl0eTogWzAuOCwgMC45XVxuXHRcdFx0XHR9XG5cdFx0XHR9KSxcblx0XHRcdHZpc3VhbGl6ZXIoeyBvcGVuOiB0cnVlIH0pXG5cdFx0XVxuXHR9XG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxDb2RlXFxcXENvZGVTdW1tYXJ5XFxcXFZpdGVWMlxcXFx0ZXN0LXZpdGUtcmVhY3QtcHJvamVjdFxcXFxjb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXENvZGVcXFxcQ29kZVN1bW1hcnlcXFxcVml0ZVYyXFxcXHRlc3Qtdml0ZS1yZWFjdC1wcm9qZWN0XFxcXGNvbmZpZ1xcXFxkZXYuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Db2RlL0NvZGVTdW1tYXJ5L1ZpdGVWMi90ZXN0LXZpdGUtcmVhY3QtcHJvamVjdC9jb25maWcvZGV2LmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+IHtcblx0Y29uc3QgaXNTZXJ2ZSA9IGNvbW1hbmQgPT09ICdzZXJ2ZSdcblx0cmV0dXJuIHtcblx0XHRzZXJ2ZXI6IHtcblx0XHRcdHBvcnQ6IDgwMDBcblx0XHR9LFxuXHRcdGJ1aWxkOiB7XG5cdFx0XHRzb3VyY2VtYXA6IHRydWVcblx0XHR9LFxuXHRcdHBsdWdpbnM6IFtdXG5cdH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtWLFNBQVMsTUFBTSxlQUFlO0FBQ2hYO0FBQUEsRUFDQyxnQkFBQUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxPQUNNO0FBQ1AsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sVUFBVTs7O0FDVndWLFNBQVMsb0JBQW9CO0FBQ3RZLE9BQU8sa0JBQWtCO0FBQ3pCLFNB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
