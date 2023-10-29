interface Update {
  type: 'js-update' | 'css-update'
  path: string
  acceptedPath: string
  timestamp: number
}

console.log('[m-vite] is connecting...')

// 1.创建websocket实例
const socket = new WebSocket(`ws://localhost:__HMR_PORT__`, 'vite-hmr')

// 2. 接受服务端消息
socket.addEventListener('message', async ({ data }) => {
  handleMessage(JSON.parse(data as any))
})

// 处理消息
function handleMessage(payload: any) {
  switch (payload.type) {
    case 'connected':
      console.log('[m-vite] connected.')
      setInterval(() => socket.send('ping'), 1000)

      break
    case 'update':
      payload.updates.forEach((update: Update) => {
        if (update.type === 'js-update') {
          fetchModuleData(update)
        }
      })
      break
  }
}

interface HotModule {
  id: string
  callbacks: HotCallBack[]
}

interface HotCallBack {
  deps: string[]
  fn: (modules: object[]) => void
}

// 热更新模块
const hotModulesMap = new Map<string, HotModule>()
// 不再生效的模块表
const prunesMap = new Map<string, (data: any) => void | Promise<void>>()

export const createHotContext = (ownerPath: string) => {
  const mod = hotModulesMap.get(ownerPath)
  if (mod) {
    mod.callbacks = []
  }
  const acceptDeps = (deps: string[], callback: any) => {
    const mod: HotModule = hotModulesMap.get(ownerPath) || {
      id: ownerPath,
      callbacks: []
    }
    mod.callbacks.push({
      deps,
      fn: callback
    })
    hotModulesMap.set(ownerPath, mod)
  }
  return {
    accept(deps: any, callbacks?: any) {
      // 接受自身更新
      if (typeof deps === 'function' || !deps) {
        acceptDeps([ownerPath], ([mod]) => deps && deps(mod))
      }
    },
    prune(cb: (data: any) => void) {
      prunesMap.set(ownerPath, cb)
    }
  }
}

async function fetchModuleData({ path, timestamp }: Update) {
  const mod = hotModulesMap.get(path)
  if (!mod) {
    return
  }
  // 模块内容表
  const moduleMap = new Map()
  // 模块路径表
  const moduleUpdatePathMap = new Set<string>()
  moduleUpdatePathMap.add(path)

  await Promise.all(
    Array.from(moduleUpdatePathMap).map(async (dep) => {
      const [path, query] = dep.split('?')
      try {
        const newMod = await import(
          path + `?t=${timestamp}${query ? `&${query}` : ''}`
        )
        moduleMap.set(dep, newMod)
      } catch {}
    })
  )
  return () => {
    for (const { deps, fn } of mod.callbacks) {
      fn(deps.map((dep) => moduleMap.get(dep)))
    }
    console.log(`[vite] hot updated: ${path}`)
  }
}

// css 热更新
const sheetsMap = new Map()
export function updateStyle(id: string, content: string) {
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

export function removeStyle(id: string): void {
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
  }
  sheetsMap.delete(id);
}