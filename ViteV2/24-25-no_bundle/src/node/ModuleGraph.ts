import { PartialResolvedId, TransformResult } from 'rollup'
import { cleanUrl } from './utils'

export class ModuleNode {
  // 资源访问url
  url: string
  // 资源绝对路径url
  id: string | null = null
  importers = new Set<ModuleNode>()
  importedModules = new Set<ModuleNode>()
  transformResult: TransformResult = null
  lastHTMLTimestamp = 0
  constructor(url: string) {
    this.url = url
  }
}

export class ModuleGraph {
  // 从url映射到 节点 的映射表
  urlToModuleMap = new Map<string, ModuleNode>()
  // 从id映射到 节点 的映射表
  idToModuleMap = new Map<string, ModuleNode>()

  constructor(private resolveId: (url) => Promise<PartialResolvedId | null>) {}

  getModuleById(id: string): ModuleNode | undefined {
    return this.idToModuleMap.get(id)
  }
  async getModuleByUrl(rawUrl: string): Promise<ModuleNode | undefined> {
    const { url } = await this._resolve(rawUrl)
    return this.urlToModuleMap.get(url)
  }
  // 注册入口
  async ensureEntryFormUrl(rawUrl: string): Promise<ModuleNode> {
    const { url, resolvedId } = await this._resolve(rawUrl)
    if (this.urlToModuleMap.has(url)) {
      return this.urlToModuleMap.get(url) as ModuleNode
    }
    const m = new ModuleNode(url)
    m.id = resolvedId
    this.urlToModuleMap.set(url, m)
    this.idToModuleMap.set(resolvedId, m)
    return m
  }
  async updateModuleInfo(
    mod: ModuleNode,
    importedModules: Set<string | ModuleNode>
  ) {
    const prevImportedModules = mod.importedModules
    for (let curModule of importedModules) {
      const dep =
        typeof curModule === 'string'
          ? await this.ensureEntryFormUrl(cleanUrl(curModule))
          : curModule
      if (dep) {
        // 当前模块添加修改后的 引入模块路径
        mod.importedModules.add(dep)
        // 添加更正后的 引入模块的被引入路径
        dep.importers.add(mod)
      }
    }
    // 过期的路径删除
    for (const prevModule of prevImportedModules) {
      if (!importedModules.has(prevModule.url)) {
        prevModule.importers.delete(mod)
      }
    }
  }
  // 过期模块清除
  invaliDateModule(file: string) {
    const mod = this.idToModuleMap.get(file)
    if (mod) {
      mod.lastHTMLTimestamp = Date.now()
      mod.transformResult = null
      mod.importers.forEach((item) => {
        this.invaliDateModule(item.id!)
      })
    }
  }
  private async _resolve(
    url: string
  ): Promise<{ url: string; resolvedId: string }> {
    const resolved = await this.resolveId(url)
    const resolvedId = resolved?.id || url
    return {
      url,
      resolvedId
    }
  }
}
