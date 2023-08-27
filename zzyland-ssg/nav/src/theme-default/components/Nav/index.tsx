import { usePageData } from '@runtime'
import styles from './index.module.scss'

const Nav = () => {
  const pageData = usePageData()
  const { siteData } = pageData
  const nav = siteData?.themeConfig?.nav || []
  return (
    <header fixed="~" pos="t-0 l-0" w="full">
      <div
        flex="~"
        items="center"
        justify="between"
        className="px-8 h-14 divider-bottom"
      >
        <div>
          <a
            href="/"
            hover="opacity-60"
            className="w-full h-full text-1rem font-semibold flex items-center"
          >
            zIsland.js
          </a>
        </div>
        <div flex="~">
          {/* 普通菜单 */}
          <div flex="~">
            {nav.map((n) => (
              <MenuItem {...n} key={n.title}></MenuItem>
            ))}
          </div>
          {/* 白天/黑夜模式切换 */}
          {/* 相关链接 */}
          <div className={styles.socialLinkIcon} ml="2">
            <a href="/">
              <div className="i-carbon-logo-github w-5 h-5 fill-current"></div>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

const MenuItem = (nav) => {
  return (
    <div className="text-sm font-medium mx-3">
      <a href={nav.link} className={styles.link}>
        {nav.title}
      </a>
    </div>
  )
}

export default Nav
