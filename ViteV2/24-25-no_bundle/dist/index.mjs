var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// src/node/cli.ts
import cac from "cac";

// src/node/server/index.ts
import connect from "connect";
import { blue, green as green2 } from "picocolors";
import chokidar from "chokidar";

// src/node/optimizer/index.ts
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
import path3 from "path";
import resolve from "resolve";
import { init, parse } from "es-module-lexer";
import fs from "fs-extra";

// src/node/utils.ts
import os from "os";
import path2 from "path";
var slash = (p) => {
  return p.replace(/\\/g, "/");
};
var isWindows = os.platform() === "win32";
var normalizePath = (id) => path2.posix.normalize(isWindows ? slash(id) : id);
var cleanUrl = (url) => url.replace(HASH_RE, "").replace(QEURY_RE, "");
var isRequestJs = (id) => {
  id = cleanUrl(id);
  if (JS_TYPES_RE.test(id)) {
    return true;
  }
  if (!path2.extname(id) && !id.endsWith("/")) {
    return true;
  }
  return false;
};
var isRequestCss = (id) => cleanUrl(id).endsWith(".css");
var isImportRequest = (url) => {
  return url.endsWith("?import");
};
var getShortName = (file, root2) => {
  return file.startsWith(root2 + "/") ? path2.posix.relative(root2, file) : file;
};
var removeImportQuery = (url) => {
  return url.replace(/\?import$/, "");
};

// src/node/optimizer/preBundlePlugin.ts
import createDebug from "debug";
var debug = createDebug("dev");
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
        const [imports, exports] = await parse(entryFile);
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
        debug("\u4EE3\u7406\u6A21\u5757\u5185\u5BB9: %o:\n " + proxyModules.join("\n"));
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

// src/node/optimizer/index.ts
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
import path5 from "path";
import fs2 from "fs-extra";
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
        const clientPath = path5.join(
          serverContext.root,
          "node_modules",
          "mini-vite",
          "dist",
          "client.mjs"
        );
        const code = fs2.readFileSync(clientPath, "utf-8");
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
import fs3 from "fs-extra";
function cssPlugin() {
  let serverContext;
  return {
    name: "m-vite:css",
    configureServer(s) {
      serverContext = s;
    },
    load(id) {
      if (id.endsWith(".css")) {
        return fs3.readFileSync(id, "utf-8");
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
import fs4 from "fs-extra";
import esbuild from "esbuild";
import path6 from "path";
function esBuildTrasnform() {
  return {
    name: "m-vite:esbuild-trasnform",
    async load(id) {
      if (isRequestJs(id)) {
        try {
          const code = await fs4.readFile(id, "utf-8");
          return code;
        } catch {
          return null;
        }
      }
    },
    async transform(code, id) {
      if (isRequestJs(id)) {
        const exname = path6.extname(id).slice(1);
        const { code: trasnfromCode, map } = await esbuild.transform(code, {
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
import { init as init2, parse as parse2 } from "es-module-lexer";
import MagicString from "magic-string";
import path7 from "path";
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
      await init2;
      const [imports] = await parse2(code);
      const ms = new MagicString(code);
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
            path7.join("/", PRE_BUNDLE_DIR, modSource + ".js")
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
import fs5 from "fs-extra";
import path8 from "path";
import resolve2 from "resolve";
function resolvePlugin() {
  let serverContext;
  return {
    name: "m-vite:resolve",
    configureServer(s) {
      serverContext = s;
    },
    async resolveId(id, importer) {
      if (path8.isAbsolute(id)) {
        if (fs5.pathExistsSync(id)) {
          return {
            id
          };
        }
        id = path8.join(serverContext.root, id);
        if (fs5.pathExistsSync(id)) {
          return { id };
        }
      } else if (id.startsWith(".")) {
        if (!importer) {
          throw new Error("'importer' is undefined");
        }
        const hasExtersions = path8.extname(id).length > 1;
        let resolveId;
        if (hasExtersions) {
          resolveId = normalizePath(
            resolve2.sync(id, { basedir: path8.dirname(importer) })
          );
          if (fs5.pathExistsSync(resolveId)) {
            return {
              id: resolveId
            };
          }
        } else {
          for (const extname of DEFAULT_EXTERSIONS) {
            try {
              const newId = id + extname;
              const resolveId2 = normalizePath(
                resolve2.sync(newId, { basedir: path8.dirname(importer) })
              );
              if (fs5.pathExistsSync(resolveId2)) {
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
import path9 from "path";
import fs6 from "fs-extra";
function indexHtmlMiddleware(serverContext) {
  return async (req, res, next) => {
    if (req.url === "/") {
      const { root: root2 } = serverContext;
      const indexFilePath = path9.join(root2, "index.html");
      if (await fs6.pathExistsSync(indexFilePath)) {
        const rawHtml = await fs6.readFileSync(indexFilePath, "utf-8");
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
import sirv from "sirv";
function staticMiddleware(root2) {
  const serverFormRoot = sirv(root2, { dev: true });
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
import { red } from "picocolors";
import { WebSocket, WebSocketServer } from "ws";
function createWebSocketServer(server) {
  let wss;
  wss = new WebSocketServer({ port: HMR_PORT });
  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "connected" }));
  });
  wss.on("error", (e) => {
    if (e.code !== "EADDRINUSE") {
      console.error(red(`WebSocket server error:
${e.stack || e.message}`));
    }
  });
  return {
    send(payload) {
      const stringified = JSON.stringify(payload);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
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
  const app = connect();
  const root2 = process.cwd();
  const startTime = Date.now();
  const plugins = resolvePlugins();
  const pluginContainer = createPluginContainer(plugins);
  const moduleGraph = new ModuleGraph((url) => pluginContainer.resolveId(url));
  const watcher = chokidar.watch(root2, {
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