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

// src/node/server/index.ts
var import_connect = __toESM(require("connect"));
var import_picocolors3 = require("picocolors");
var import_chokidar = __toESM(require("chokidar"));

// src/node/optimizer/index.ts
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
var JS_TYPES_RE = /\.(?:j|t)sx?$|\.mjs$/;
var QEURY_RE = /\?.*$/s;
var HASH_RE = /#.*$/s;
var DEFAULT_EXTERSIONS = [".tsx", ".ts", ".jsx", "js"];
var HMR_PORT = 12342;
var CLIENT_PUBLIC_PATH = "/@vite/client";
var INTERNAL_LIST = [CLIENT_PUBLIC_PATH, "/@react-refresh"];
function isInternalRequest(url) {
  return INTERNAL_LIST.includes(url);
}

// src/node/optimizer/scanPlugin.ts
async function scanPlugins(deps) {
  return Promise.resolve({
    name: "plugin:scan",
    setup(build2) {
      build2.onResolve(
        {
          filter: new RegExp(`\\.(${EXTERNAL_TYPES.join("|")})$`)
        },
        ({ path: path10 }) => {
          return {
            path: path10,
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

// src/node/optimizer/preBundlePlugin.ts
var import_path3 = __toESM(require("path"));
var import_resolve = __toESM(require("resolve"));
var import_es_module_lexer = require("es-module-lexer");
var import_fs_extra = __toESM(require("fs-extra"));

// src/node/utils.ts
var import_os = __toESM(require("os"));
var import_path2 = __toESM(require("path"));
var slash = (p) => {
  return p.replace(/\\/g, "/");
};
var isWindows = import_os.default.platform() === "win32";
var normalizePath = (id) => import_path2.default.posix.normalize(isWindows ? slash(id) : id);
var cleanUrl = (url) => url.replace(HASH_RE, "").replace(QEURY_RE, "");
var isRequestJs = (id) => {
  id = cleanUrl(id);
  if (JS_TYPES_RE.test(id)) {
    return true;
  }
  if (!import_path2.default.extname(id) && !id.endsWith("/")) {
    return true;
  }
  return false;
};
var isRequestCss = (id) => cleanUrl(id).endsWith(".css");
var isImportRequest = (url) => {
  return url.endsWith("?import");
};
var getShortName = (file, root2) => {
  return file.startsWith(root2 + "/") ? import_path2.default.posix.relative(root2, file) : file;
};
var removeImportQuery = (url) => {
  return url.replace(/\?import$/, "");
};

// src/node/optimizer/preBundlePlugin.ts
var import_debug = __toESM(require("debug"));
var debug = (0, import_debug.default)("dev");
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
        const [imports, exports] = await (0, import_es_module_lexer.parse)(entryFile);
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
        debug("\u4EE3\u7406\u6A21\u5757\u5185\u5BB9: %o:\n " + proxyModules.join("\n"));
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

// src/node/optimizer/index.ts
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
  console.log("\u6784\u5EFA\u6210\u529F\uFF01");
};

// src/node/pluginContainer.ts
var createPluginContainer = (plugins) => {
  class Context {
    async resolve(id, importer) {
      let out = await pluginContainer.resolveId(id, importer);
      if (typeof out === "string")
        out = { id: out };
      return out;
    }
  }
  const pluginContainer = {
    async resolveId(id, importer) {
      const ctx = new Context();
      for (const plugin of plugins) {
        if (plugin.resolveId) {
          const newId = await plugin.resolveId.call(ctx, id, importer);
          if (newId) {
            id = typeof newId === "string" ? newId : newId.id;
            return { id };
          }
        }
      }
      return null;
    },
    async load(id) {
      const ctx = new Context();
      for (const plugin of plugins) {
        if (plugin.load) {
          const result = await plugin.load.call(ctx, id);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
    async transform(code, id) {
      const ctx = new Context();
      for (const plugin of plugins) {
        if (plugin.transform) {
          const result = await plugin.transform.call(ctx, code, id);
          if (!result)
            continue;
          if (typeof result === "string") {
            code = result;
          } else if (result.code) {
            code = result.code;
          }
        }
      }
      return { code };
    }
  };
  return pluginContainer;
};

// src/node/plugins/assets.ts
function assetsPlugin() {
  let serverContext;
  return {
    name: "m-vite:assets",
    configureServer(s) {
      serverContext = s;
    },
    async load(id) {
      const cleanedId = removeImportQuery(cleanUrl(id));
      const resolvedId = `/${getShortName(normalizePath(id), serverContext.root)}`;
      if (cleanedId.endsWith(".svg")) {
        return {
          code: `export default "${resolvedId}"`
        };
      }
    }
  };
}

// src/node/plugins/clientInject.ts
var import_path5 = __toESM(require("path"));
var import_fs_extra2 = __toESM(require("fs-extra"));
function clientInject() {
  let serverContext;
  return {
    name: "m-vite:client-inject",
    configureServer(s) {
      serverContext = s;
    },
    resolveId(id) {
      if (id === CLIENT_PUBLIC_PATH) {
        return { id };
      }
      return null;
    },
    load(id) {
      if (id === CLIENT_PUBLIC_PATH) {
        const clientPath = import_path5.default.join(
          serverContext.root,
          "node_modules",
          "mini-vite",
          "dist",
          "client.mjs"
        );
        const code = import_fs_extra2.default.readFileSync(clientPath, "utf-8");
        return {
          code: code.replace("__HMR_PORT__", JSON.stringify(HMR_PORT))
        };
      }
    },
    transformIndexHtml(raw) {
      const newHtml = raw.replace(
        /(<head[^>]*>)/i,
        `$1
        <script type="module" src="${CLIENT_PUBLIC_PATH}"><\/script>`
      );
      return newHtml;
    }
  };
}

// src/node/plugins/css.ts
var import_fs_extra3 = __toESM(require("fs-extra"));
function cssPlugin() {
  let serverContext;
  return {
    name: "m-vite:css",
    configureServer(s) {
      serverContext = s;
    },
    load(id) {
      if (id.endsWith(".css")) {
        return import_fs_extra3.default.readFileSync(id, "utf-8");
      }
    },
    transform(code, id) {
      if (id.endsWith(".css")) {
        const jsContent = `
import { createHotContext as __vite__createHotContext } from "${CLIENT_PUBLIC_PATH}";
import.meta.hot = __vite__createHotContext("/${getShortName(id, serverContext.root)}");
import { updateStyle, removeStyle } from "${CLIENT_PUBLIC_PATH}"
  
const id = '${id}';
const css = \`${code.replace(/\n/g, "").replace(/"/g, "'")}\`;

updateStyle(id, css);
import.meta.hot.accept();
export default css;
import.meta.hot.prune(() => removeStyle(id));`.trim();
        return { code: jsContent };
      }
      return null;
    }
  };
}

// src/node/plugins/esbuild.ts
var import_fs_extra4 = __toESM(require("fs-extra"));
var import_esbuild2 = __toESM(require("esbuild"));
var import_path6 = __toESM(require("path"));
function esBuildTrasnform() {
  return {
    name: "m-vite:esbuild-trasnform",
    async load(id) {
      if (isRequestJs(id)) {
        try {
          const code = await import_fs_extra4.default.readFile(id, "utf-8");
          return code;
        } catch {
          return null;
        }
      }
    },
    async transform(code, id) {
      if (isRequestJs(id)) {
        const exname = import_path6.default.extname(id).slice(1);
        const { code: trasnfromCode, map } = await import_esbuild2.default.transform(code, {
          target: "esnext",
          format: "esm",
          sourcemap: true,
          loader: exname
        });
        return {
          code: trasnfromCode,
          map
        };
      }
      return null;
    }
  };
}

// src/node/plugins/importAnalysis.ts
var import_es_module_lexer2 = require("es-module-lexer");
var import_magic_string = __toESM(require("magic-string"));
var import_path7 = __toESM(require("path"));
function importAnalysis() {
  let serverContext;
  return {
    name: "m-vite:import-analysis",
    configureServer(s) {
      serverContext = s;
    },
    async transform(code, id) {
      if (!isRequestJs(id) || isInternalRequest(id)) {
        return null;
      }
      await import_es_module_lexer2.init;
      const [imports] = await (0, import_es_module_lexer2.parse)(code);
      const ms = new import_magic_string.default(code);
      const resolve3 = async (id2, importer) => {
        const resolved = await this.resolve(id2, normalizePath(importer));
        if (!resolved) {
          return;
        }
        const cleanedId = cleanUrl(resolved.id);
        const mod = moduleGraph.getModuleById(cleanedId);
        let resolvedId = `/${getShortName(resolved.id, serverContext.root)}`;
        if (mod && mod.lastHTMLTimestamp) {
          resolvedId += "?t=" + mod.lastHTMLTimestamp;
        }
        return resolvedId;
      };
      const { moduleGraph } = serverContext;
      const curMod = moduleGraph.getModuleById(id);
      const importedModules = /* @__PURE__ */ new Set();
      for (const importInfo of imports) {
        const { s: modStart, e: modEnd, n: modSource } = importInfo;
        if (!modSource)
          continue;
        if (modSource.endsWith(".svg")) {
          const resolvedUrl = await resolve3(modSource, id);
          ms.overwrite(modStart, modEnd, `${resolvedUrl}?import`);
          continue;
        }
        if (BARE_IMPORT_RE.test(modSource)) {
          const bundlePath = normalizePath(
            import_path7.default.join("/", PRE_BUNDLE_DIR, modSource + ".js")
          );
          importedModules.add(bundlePath);
          ms.overwrite(modStart, modEnd, bundlePath);
        } else if (id.startsWith(".") || id.startsWith("/")) {
          const resolveId = await resolve3(modSource, id);
          if (resolveId) {
            importedModules.add(resolveId);
            ms.overwrite(modStart, modEnd, resolveId);
          }
        }
      }
      if (!id.includes("node_modules")) {
        ms.prepend(
          `import { createHotContext as __vite__createHotContext } from "${CLIENT_PUBLIC_PATH}";
import.meta.hot = __vite__createHotContext(${JSON.stringify(
            cleanUrl(curMod.url)
          )});
`
        );
      }
      moduleGraph.updateModuleInfo(curMod, importedModules);
      return {
        code: ms.toString(),
        map: ms.generateMap()
      };
    }
  };
}

// src/node/plugins/resolve.ts
var import_fs_extra5 = __toESM(require("fs-extra"));
var import_path8 = __toESM(require("path"));
var import_resolve2 = __toESM(require("resolve"));
function resolvePlugin() {
  let serverContext;
  return {
    name: "m-vite:resolve",
    configureServer(s) {
      serverContext = s;
    },
    async resolveId(id, importer) {
      if (import_path8.default.isAbsolute(id)) {
        if (import_fs_extra5.default.pathExistsSync(id)) {
          return {
            id
          };
        }
        id = import_path8.default.join(serverContext.root, id);
        if (import_fs_extra5.default.pathExistsSync(id)) {
          return { id };
        }
      } else if (id.startsWith(".")) {
        if (!importer) {
          throw new Error("'importer' is undefined");
        }
        const hasExtersions = import_path8.default.extname(id).length > 1;
        let resolveId;
        if (hasExtersions) {
          resolveId = normalizePath(
            import_resolve2.default.sync(id, { basedir: import_path8.default.dirname(importer) })
          );
          if (import_fs_extra5.default.pathExistsSync(resolveId)) {
            return {
              id: resolveId
            };
          }
        } else {
          for (const extname of DEFAULT_EXTERSIONS) {
            try {
              const newId = id + extname;
              const resolveId2 = normalizePath(
                import_resolve2.default.sync(newId, { basedir: import_path8.default.dirname(importer) })
              );
              if (import_fs_extra5.default.pathExistsSync(resolveId2)) {
                return {
                  id: resolveId2
                };
              } else
                continue;
            } catch (e) {
              continue;
            }
          }
        }
      }
      return null;
    }
  };
}

// src/node/plugins/index.ts
function resolvePlugins() {
  return [
    clientInject(),
    resolvePlugin(),
    esBuildTrasnform(),
    importAnalysis(),
    cssPlugin(),
    assetsPlugin()
  ];
}

// src/node/server/middlewares/indexHtml.ts
var import_path9 = __toESM(require("path"));
var import_fs_extra6 = __toESM(require("fs-extra"));
function indexHtmlMiddleware(serverContext) {
  return async (req, res, next) => {
    if (req.url === "/") {
      const { root: root2 } = serverContext;
      const indexFilePath = import_path9.default.join(root2, "index.html");
      if (await import_fs_extra6.default.pathExistsSync(indexFilePath)) {
        const rawHtml = await import_fs_extra6.default.readFileSync(indexFilePath, "utf-8");
        let html = rawHtml;
        for (const plugin of serverContext.plugins) {
          if (plugin.transformIndexHtml) {
            html = await plugin.transformIndexHtml(html);
          }
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        return res.end(html);
      }
    }
    return next();
  };
}

// src/node/server/middlewares/trasnform.ts
async function transformRequest(url, serverContext) {
  const { pluginContainer, moduleGraph } = serverContext;
  url = cleanUrl(url);
  let mod = await moduleGraph.getModuleByUrl(url);
  if (mod && mod.transformResult) {
    return mod.transformResult;
  }
  const resolveResult = await pluginContainer.resolveId(url);
  let transformCode;
  if (resolveResult?.id) {
    let loadResult = await pluginContainer.load(resolveResult.id);
    if (typeof loadResult === "object" && loadResult !== null) {
      loadResult = loadResult.code;
    }
    mod = await moduleGraph.ensureEntryFormUrl(url);
    if (loadResult) {
      transformCode = await pluginContainer.transform(
        loadResult,
        resolveResult?.id
      );
    }
    if (mod) {
      mod.transformResult = transformCode;
    }
    return transformCode;
  }
}
function transformMiddleware(serverContext) {
  return async (req, res, next) => {
    if (req.method !== "GET" || !req.url) {
      return next();
    }
    const url = req.url;
    if (isRequestJs(url) || isRequestCss(url) || isImportRequest(url)) {
      let result = await transformRequest(url, serverContext);
      if (!result) {
        return next();
      }
      if (result && result.code) {
        result = result.code;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/javascript");
      return res.end(result);
    }
    next();
  };
}

// src/node/server/middlewares/static.ts
var import_sirv = __toESM(require("sirv"));
function staticMiddleware(root2) {
  const serverFormRoot = (0, import_sirv.default)(root2, { dev: true });
  return async (req, res, next) => {
    if (!req.url) {
      return;
    }
    if (isImportRequest(req.url)) {
      return;
    }
    serverFormRoot(req, res, next);
  };
}

// src/node/ModuleGraph.ts
var ModuleNode = class {
  constructor(url) {
    this.id = null;
    this.importers = /* @__PURE__ */ new Set();
    this.importedModules = /* @__PURE__ */ new Set();
    this.transformResult = null;
    this.lastHTMLTimestamp = 0;
    this.url = url;
  }
};
var ModuleGraph = class {
  constructor(resolveId) {
    this.resolveId = resolveId;
    this.urlToModuleMap = /* @__PURE__ */ new Map();
    this.idToModuleMap = /* @__PURE__ */ new Map();
  }
  getModuleById(id) {
    return this.idToModuleMap.get(id);
  }
  async getModuleByUrl(rawUrl) {
    const { url } = await this._resolve(rawUrl);
    return this.urlToModuleMap.get(url);
  }
  async ensureEntryFormUrl(rawUrl) {
    const { url, resolvedId } = await this._resolve(rawUrl);
    if (this.urlToModuleMap.has(url)) {
      return this.urlToModuleMap.get(url);
    }
    const m = new ModuleNode(url);
    m.id = resolvedId;
    this.urlToModuleMap.set(url, m);
    this.idToModuleMap.set(resolvedId, m);
    return m;
  }
  async updateModuleInfo(mod, importedModules) {
    const prevImportedModules = mod.importedModules;
    for (let curModule of importedModules) {
      const dep = typeof curModule === "string" ? await this.ensureEntryFormUrl(cleanUrl(curModule)) : curModule;
      if (dep) {
        mod.importedModules.add(dep);
        dep.importers.add(mod);
      }
    }
    for (const prevModule of prevImportedModules) {
      if (!importedModules.has(prevModule.url)) {
        prevModule.importers.delete(mod);
      }
    }
  }
  invaliDateModule(file) {
    const mod = this.idToModuleMap.get(file);
    if (mod) {
      mod.lastHTMLTimestamp = Date.now();
      mod.transformResult = null;
      mod.importers.forEach((item) => {
        this.invaliDateModule(item.id);
      });
    }
  }
  async _resolve(url) {
    const resolved = await this.resolveId(url);
    const resolvedId = resolved?.id || url;
    return {
      url,
      resolvedId
    };
  }
};

// src/node/ws.ts
var import_picocolors2 = require("picocolors");
var import_ws = require("ws");
function createWebSocketServer(server) {
  let wss;
  wss = new import_ws.WebSocketServer({ port: HMR_PORT });
  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "connected" }));
  });
  wss.on("error", (e) => {
    if (e.code !== "EADDRINUSE") {
      console.error((0, import_picocolors2.red)(`WebSocket server error:
${e.stack || e.message}`));
    }
  });
  return {
    send(payload) {
      const stringified = JSON.stringify(payload);
      wss.clients.forEach((client) => {
        if (client.readyState === import_ws.WebSocket.OPEN) {
          client.send(stringified);
        }
      });
    },
    close() {
      wss.close();
    }
  };
}

// src/node/hmr.ts
function bindingHMREvents(serverContext) {
  const { ws, watcher, root: root2 } = serverContext;
  watcher.on("change", async (file) => {
    const { moduleGraph } = serverContext;
    moduleGraph.invaliDateModule(file);
    ws.send({
      type: "update",
      updates: [
        {
          type: "js-update",
          timestamp: Date.now(),
          path: "/" + getShortName(file, root2),
          acceptedPath: "/" + getShortName(file, root2)
        }
      ]
    });
  });
}

// src/node/server/index.ts
var startDevServer = async () => {
  const app = (0, import_connect.default)();
  const root2 = process.cwd();
  const startTime = Date.now();
  const plugins = resolvePlugins();
  const pluginContainer = createPluginContainer(plugins);
  const moduleGraph = new ModuleGraph((url) => pluginContainer.resolveId(url));
  const watcher = import_chokidar.default.watch(root2, {
    ignored: ["**/node_modules/**", "**/.git/**"],
    ignoreInitial: true
  });
  const ws = createWebSocketServer(app);
  const serverContext = {
    root: normalizePath(process.cwd()),
    app,
    pluginContainer,
    plugins,
    moduleGraph,
    ws,
    watcher
  };
  for (const plugin of plugins) {
    if (plugin.configureServer) {
      await plugin.configureServer(serverContext);
    }
  }
  bindingHMREvents(serverContext);
  app.use(indexHtmlMiddleware(serverContext));
  app.use(transformMiddleware(serverContext));
  app.use(staticMiddleware(serverContext.root));
  app.listen(3e3, async () => {
    await optimizer(root2);
    console.log(
      (0, import_picocolors3.green)("\u{1F680} No-Bundle \u670D\u52A1\u5DF2\u7ECF\u6210\u529F\u542F\u52A8!"),
      `\u8017\u65F6\uFF1A${Date.now() - startTime} ms`
    );
    console.log(`> \u672C\u5730\u8BBF\u95EE\u8DEF\u5F84: ${(0, import_picocolors3.blue)("http://localhost:3000")}`);
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