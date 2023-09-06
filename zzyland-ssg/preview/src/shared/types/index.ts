import { ComponentType } from 'react'
import { UserConfig as ViteConfiguration } from 'vite'

export type NavItemWithLink = {
  title: string
  link: string
}

export interface Sidebar {
  [path: string]: SidebarGroup[]
}

export interface SidebarGroup {
  text?: string
  items: SidebarItem[]
}

export type SidebarItem = {
  text: string
  link?: string
  items?: SidebarItem[]
}

export interface Footer {
  message?: string
  copyright?: string
}

export interface ThemeConfig {
  nav?: NavItemWithLink[]
  sidebar?: Sidebar
  footer?: Footer
}

export interface UserConfig {
  title?: string
  description?: string
  themeConfig?: ThemeConfig
  vite?: ViteConfiguration
}

export interface SiteConfig {
  root: string
  configPath: string
  siteData: UserConfig
}

export type PageType = 'home' | 'doc' | 'custom' | '404'

export interface Header {
  id: string
  text: string
  depth: string | number
}

export interface FrontMatter {
  title?: string
  description?: string
  pageType?: PageType
  sidebar?: boolean
  outline?: boolean
  hero?: Hero
  features?: Feature[]
}

export interface Hero {
  name: string
  text: string
  tagline: string
  image?: {
    src: string
    alt: string
  }
  actions: {
    text: string
    link: string
    theme: 'brand' | 'alt'
  }[]
}

export interface Feature {
  icon: string
  title: string
  details: string
}

export interface PageData {
  siteData: UserConfig
  pagePath: string
  pageType: PageType
  frontmatter: FrontMatter
  toc?: Header[]
  title?: string
}

export interface PageModule {
  default: ComponentType
  frontmatter?: FrontMatter
  toc?: Header[]
  title?: string
  [key: string]: unknown
}

export type PropsWithZisland = {
  __zisland: boolean
}
