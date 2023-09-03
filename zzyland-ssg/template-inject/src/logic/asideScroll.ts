import { throttle } from 'lodash'

let links: HTMLAnchorElement[] = []

const NAV_HEIGHT = 56

export const bindingAsideScroll = () => {
  const maker = document.getElementById('aside-marker')
  const aside = document.getElementById('aside-container')

  if (!aside) {
    return
  }

  const headers = Array.from(aside?.getElementsByTagName('a') || []).map(
    (item) => decodeURIComponent(item.hash)
  )

  const activate = (links: HTMLAnchorElement[], index: number) => {
    if (links[index]) {
      const id = links[index].getAttribute('href')
      const tocIndex = headers.findIndex((item) => item === id)
      const currentLink = aside?.querySelector(`a[href="#${id.slice(1)}"]`)

      if (currentLink) {
        maker.style.top = 33 + tocIndex * 28 + 'px'
        maker.style.opacity = '1'
      }
    }
  }

  const setActiveLink = (e) => {
    links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        '.zisland-doc .header-anchor'
      )
    ).filter((item) => item.parentElement?.tagName !== 'H1')

    const isBottom =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight
    if (isBottom) {
      activate(links, links.length - 1)
      return
    }

    for (let i = 0; i < links.length; i++) {
      const currentLink = links[i]
      const currentLinkTop = currentLink.parentElement.scrollTop - NAV_HEIGHT
      const nextLink = links[i + 1]
      const scrollTop = Math.ceil(window.scrollY)

      if ((i === 0 && currentLinkTop > scrollTop) || scrollTop === 0) {
        activate(links, 0)
        break
      }
      if (!nextLink) {
        activate(links, links.length - 1)
        break
      }

      const nextLinkTop = nextLink.parentElement.offsetTop - NAV_HEIGHT
      if (currentLinkTop <= scrollTop && nextLinkTop > scrollTop) {
        activate(links, i)
        break
      }
    }
  }

  const throttleSetActiveLink = throttle(setActiveLink, 100)

  window.addEventListener('scroll', throttleSetActiveLink)
  return () => {
    window.removeEventListener('scroll', throttleSetActiveLink)
  }
}

export const scrollToTarget = (target: HTMLElement, isSmooth: boolean) => {
  const targetPadding = parseInt(window.getComputedStyle(target).paddingTop, 10)

  const targetTop =
    window.scrollY +
    target.getBoundingClientRect().top +
    targetPadding -
    NAV_HEIGHT

  window.scrollTo({
    left: 0,
    top: targetTop,
    behavior: isSmooth ? 'smooth' : 'auto'
  })
}
