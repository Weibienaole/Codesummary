import { Plugin } from 'vite'
import { pluginMdxRollup } from './pluginMdxRollup'
import { pluginMdxHmr } from './pluginMdxHmr'

export async function pluginMdx(): Promise<Plugin[]> {
  return [await pluginMdxRollup(), pluginMdxHmr()]
}
