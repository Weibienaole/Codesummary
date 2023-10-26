var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/node/cli.ts
var import_cac = __toESM(require("cac"));

// server.ts
var import_connect = __toESM(require("connect"));
var import_picocolors2 = require("picocolors");

// src/optimizer/index.ts
var import_esbuild = require("esbuild");
var import_path4 = __toESM(require("path"));
var import_picocolors = require("picocolors");

// src/constant/index.ts
var import_path = __toESM(require("path"));
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
var PRE_BUNDLE_DIR = import_path.default.join("node_modules", ".m-vite");

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
var import_path3 = __toESM(require("path"));
var import_resolve = __toESM(require("resolve"));
var import_es_module_lexer = require("es-module-lexer");
var import_fs_extra = __toESM(require("fs-extra"));

// src/utils.ts
var import_os = __toESM(require("os"));
var import_path2 = __toESM(require("path"));
var slash = (p) => {
  return p.replace(/\\/g, "/");
};
var isWindows = import_os.default.platform() === "win32";
var normalizePath = (id) => import_path2.default.posix.normalize(isWindows ? slash(id) : id);

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
            path: import_resolve.default.sync(id, { basedir: process.cwd() })
          };
        }
      });
      build2.onLoad({ filter: /.*/, namespace: "dep" }, async (loadInfo) => {
        await import_es_module_lexer.init;
        const root2 = process.cwd();
        const id = loadInfo.path;
        const entryPath = normalizePath(import_resolve.default.sync(id, { basedir: root2 }));
        const entryFile = await import_fs_extra.default.readFile(entryPath, "utf-8");
        const [imports, exports] = await (0, import_es_module_lexer.parse)(entryPath);
        const proxyModules = [];
        if (!imports.length && !exports.length) {
          const cjsFile = require(entryPath);
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
        const loader = import_path3.default.extname(entryPath).slice(1);
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
  const entry = import_path4.default.resolve(root2, "src/main.tsx");
  const deps = /* @__PURE__ */ new Set();
  await (0, import_esbuild.build)({
    entryPoints: [entry],
    bundle: true,
    write: false,
    plugins: [await scanPlugins(deps)]
  });
  console.log(
    `${(0, import_picocolors.green)("\u9700\u8981\u9884\u6784\u5EFA\u7684\u4F9D\u8D56")}:
${[...deps].map(import_picocolors.green).map((item) => `  ${item}`).join("\n")}`
  );
  await (0, import_esbuild.build)({
    entryPoints: [...deps],
    bundle: true,
    write: true,
    splitting: true,
    format: "esm",
    outdir: import_path4.default.resolve(root2, PRE_BUNDLE_DIR),
    plugins: [await preBundlePlugin(deps)]
  });
};

// server.ts
var startDevServer = async () => {
  const app = (0, import_connect.default)();
  const root2 = process.cwd();
  const startTime = Date.now();
  app.listen(3e3, async () => {
    await optimizer(root2);
    console.log(
      (0, import_picocolors2.green)("\u{1F680} No-Bundle \u670D\u52A1\u5DF2\u7ECF\u6210\u529F\u542F\u52A8!"),
      `\u8017\u65F6\uFF1A${Date.now() - startTime} ms`
    );
    console.log(`> \u672C\u5730\u8BBF\u95EE\u8DEF\u5F84: ${(0, import_picocolors2.blue)("http://localhost:3000")}`);
  });
};

// src/node/cli.ts
var root = process.cwd();
var cli = (0, import_cac.default)();
cli.command("[root]", "Run the development server").alias("server").alias("dev").action(async () => {
  await startDevServer();
});
cli.help();
cli.parse();
//# sourceMappingURL=index.js.map