import React from 'react'
import styles from './index.module.scss'

const EXTERNAL_LINK_RE = /^https?/

export interface LinkProps {
  href?: string
  children?: React.ReactNode
  className?: string
}

const Link = (props: LinkProps) => {
  const { href = '/', className = '', children } = props
  const isExternal = EXTERNAL_LINK_RE.test(href)
  const target = isExternal ? '_blank' : ''
  const rel = isExternal ? 'noopener noreferrer' : undefined
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`${styles.link} ${className}`}
    >
      {children}
    </a>
  )
}

export default Link
