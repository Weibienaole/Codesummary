// src/client/client.ts
console.log("[m-vite] is connecting...");
var socket = new WebSocket(`ws://localhost:__HMR_PORT__`, "vite-hmr");
socket.addEventListener("message", async ({ data }) => {
  handleMessage(JSON.parse(data));
});
function handleMessage(payload) {
  switch (payload.type) {
    case "connected":
      console.log("[m-vite] connected.");
      setInterval(() => socket.send("ping"), 1e3);
      break;
    case "update":
      payload.updates.forEach((update) => {
        if (update.type === "js-update") {
          fetchModuleData(update);
        }
      });
      break;
  }
}
var hotModulesMap = /* @__PURE__ */ new Map();
var prunesMap = /* @__PURE__ */ new Map();
var createHotContext = (ownerPath) => {
  const mod = hotModulesMap.get(ownerPath);
  if (mod) {
    mod.callbacks = [];
  }
  const acceptDeps = (deps, callback) => {
    const mod2 = hotModulesMap.get(ownerPath) || {
      id: ownerPath,
      callbacks: []
    };
    mod2.callbacks.push({
      deps,
      fn: callback
    });
    hotModulesMap.set(ownerPath, mod2);
  };
  return {
    accept(deps, callbacks) {
      if (typeof deps === "function" || !deps) {
        acceptDeps([ownerPath], ([mod2]) => deps && deps(mod2));
      }
    },
    prune(cb) {
      prunesMap.set(ownerPath, cb);
    }
  };
};
async function fetchModuleData({ path, timestamp }) {
  const mod = hotModulesMap.get(path);
  if (!mod) {
    return;
  }
  const moduleMap = /* @__PURE__ */ new Map();
  const moduleUpdatePathMap = /* @__PURE__ */ new Set();
  moduleUpdatePathMap.add(path);
  await Promise.all(
    Array.from(moduleUpdatePathMap).map(async (dep) => {
      const [path2, query] = dep.split("?");
      try {
        const newMod = await import(path2 + `?t=${timestamp}${query ? `&${query}` : ""}`);
        moduleMap.set(dep, newMod);
      } catch {
      }
    })
  );
  return () => {
    for (const { deps, fn } of mod.callbacks) {
      fn(deps.map((dep) => moduleMap.get(dep)));
    }
    console.log(`[vite] hot updated: ${path}`);
  };
}
var sheetsMap = /* @__PURE__ */ new Map();
function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = content;
    document.head.appendChild(style);
  } else {
    style.innerHTML = content;
  }
  sheetsMap.set(id, style);
}
function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
  }
  sheetsMap.delete(id);
}
export {
  createHotContext,
  removeStyle,
  updateStyle
};
//# sourceMappingURL=client.mjs.map