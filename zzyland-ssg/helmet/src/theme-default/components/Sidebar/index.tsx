import { SidebarGroup, SidebarItem } from 'shared/types'
import Link from '../Link'
import styles from './index.module.scss'

interface SidebarProps {
  sidebar: SidebarGroup[]
  pathname: string
}

const Sidebar = (props: SidebarProps) => {
  const { sidebar, pathname } = props

  const renderItem = (item: SidebarItem) => {
    const active = item.link === pathname
    return (
      <div ml="5">
        <div
          p="1"
          block="~"
          text="sm"
          font-medium="~"
          className={active ? 'text-brand' : 'text-text-2'}
        >
          <Link href={item.link}>{item.text}</Link>
        </div>
      </div>
    )
  }

  const renderGroup = (item: SidebarGroup) => {
    return (
      <section key={item.text} block="~" not-first="divider-top mt-4">
        <div flex="~" justify="between" align="center">
          <h2 m="t-3 b-2" text="1rem text-1" font="bold">
            {item.text}
          </h2>
        </div>
        <div mb="1">
          {item.items?.map((it) => <div key={it.link}>{renderItem(it)}</div>)}
        </div>
      </section>
    )
  }
  return (
    <aside className={styles.sidebar}>
      <nav>{sidebar.map(renderGroup)}</nav>
    </aside>
  )
}
export default Sidebar
