var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// src/node/cli.ts
import cac from "cac";

// server.ts
import connect from "connect";
import { blue, green as green2 } from "picocolors";

// src/optimizer/index.ts
import { build } from "esbuild";
import path4 from "path";
import { green } from "picocolors";

// src/constant/index.ts
import path from "path";
var EXTERNAL_TYPES = [
  "css",
  "less",
  "sass",
  "scss",
  "styl",
  "stylus",
  "pcss",
  "postcss",
  "vue",
  "svelte",
  "marko",
  "astro",
  "png",
  "jpe?g",
  "gif",
  "svg",
  "ico",
  "webp",
  "avif"
];
var BARE_IMPORT_RE = /^[\w@][^:]/;
var PRE_BUNDLE_DIR = path.join("node_modules", ".m-vite");

// src/optimizer/scanPlugin.ts
async function scanPlugins(deps) {
  return Promise.resolve({
    name: "plugin:scan",
    setup(build2) {
      build2.onResolve(
        {
          filter: new RegExp(`\\.(${EXTERNAL_TYPES.join("|")})$`)
        },
        ({ path: path5 }) => {
          return {
            path: path5,
            external: true
          };
        }
      );
      build2.onResolve({ filter: BARE_IMPORT_RE }, (resolveInfo) => {
        const { path: id } = resolveInfo;
        deps.add(id);
        return {
          path: id,
          external: true
        };
      });
    }
  });
}

// src/optimizer/preBundlePlugin.ts
import path3 from "path";
import resolve from "resolve";
import { init, parse } from "es-module-lexer";
import fs from "fs-extra";

// src/utils.ts
import os from "os";
import path2 from "path";
var slash = (p) => {
  return p.replace(/\\/g, "/");
};
var isWindows = os.platform() === "win32";
var normalizePath = (id) => path2.posix.normalize(isWindows ? slash(id) : id);

// src/optimizer/preBundlePlugin.ts
async function preBundlePlugin(deps) {
  return Promise.resolve({
    name: "plugin:pre-bundle",
    setup(build2) {
      build2.onResolve({ filter: BARE_IMPORT_RE }, (resolveInfo) => {
        const { path: id, importer } = resolveInfo;
        const isEntry = !importer;
        if (deps.has(id)) {
          return isEntry ? {
            path: id,
            namespace: "dep"
          } : {
            path: resolve.sync(id, { basedir: process.cwd() })
          };
        }
      });
      build2.onLoad({ filter: /.*/, namespace: "dep" }, async (loadInfo) => {
        await init;
        const root2 = process.cwd();
        const id = loadInfo.path;
        const entryPath = normalizePath(resolve.sync(id, { basedir: root2 }));
        const entryFile = await fs.readFile(entryPath, "utf-8");
        const [imports, exports] = await parse(entryPath);
        const proxyModules = [];
        if (!imports.length && !exports.length) {
          const cjsFile = __require(entryPath);
          const cjsFileImports = Object.keys(cjsFile);
          proxyModules.push(
            `export { ${cjsFileImports.join(",")} } from '${entryPath}'`,
            `export default require('${entryPath}')`
          );
        } else {
          if (exports.includes("default")) {
            proxyModules.push(`import d from '${entryPath}';export default d`);
          }
          proxyModules.push(`export * from '${entryPath}'`);
        }
        const loader = path3.extname(entryPath).slice(1);
        return {
          loader,
          contents: proxyModules.join("\n"),
          resolveDir: root2
        };
      });
    }
  });
}

// src/optimizer/index.ts
var optimizer = async (root2) => {
  const entry = path4.resolve(root2, "src/main.tsx");
  const deps = /* @__PURE__ */ new Set();
  await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    plugins: [await scanPlugins(deps)]
  });
  console.log(
    `${green("\u9700\u8981\u9884\u6784\u5EFA\u7684\u4F9D\u8D56")}:
${[...deps].map(green).map((item) => `  ${item}`).join("\n")}`
  );
  await build({
    entryPoints: [...deps],
    bundle: true,
    write: true,
    splitting: true,
    format: "esm",
    outdir: path4.resolve(root2, PRE_BUNDLE_DIR),
    plugins: [await preBundlePlugin(deps)]
  });
};

// server.ts
var startDevServer = async () => {
  const app = connect();
  const root2 = process.cwd();
  const startTime = Date.now();
  app.listen(3e3, async () => {
    await optimizer(root2);
    console.log(
      green2("\u{1F680} No-Bundle \u670D\u52A1\u5DF2\u7ECF\u6210\u529F\u542F\u52A8!"),
      `\u8017\u65F6\uFF1A${Date.now() - startTime} ms`
    );
    console.log(`> \u672C\u5730\u8BBF\u95EE\u8DEF\u5F84: ${blue("http://localhost:3000")}`);
  });
};

// src/node/cli.ts
var root = process.cwd();
var cli = cac();
cli.command("[root]", "Run the development server").alias("server").alias("dev").action(async () => {
  await startDevServer();
});
cli.help();
cli.parse();
//# sourceMappingURL=index.mjs.map