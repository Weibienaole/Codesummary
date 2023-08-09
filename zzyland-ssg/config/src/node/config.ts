import { resolve } from 'path'
import fs from 'fs-extra'
import { loadConfigFromFile } from 'vite'

import { UserConfig } from './shared/types'

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>)

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
) {
  // 1. 获取配置文件路径
  const configPath = getUserConfigPath(root)

  // 2. 读取配置内容
  const result = await loadConfigFromFile({ command, mode }, configPath, root)

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result
    const userConfig = typeof rawConfig === 'function' ? rawConfig() : rawConfig
    return [configPath, userConfig] as const
  } else {
    return [configPath, {} as UserConfig] as const
  }
}

function getUserConfigPath(root: string) {
  try {
    const supportConfigName = ['config.js', 'config.ts']
    const configPath = supportConfigName
      .map((fileName) => resolve(root, fileName))
      .find((path) => fs.pathExistsSync(path))
    return configPath
  } catch (e) {
    console.log('config path not found!')
    throw e
  }
}

export function defineConfig(config: UserConfig) {
  return config
}
