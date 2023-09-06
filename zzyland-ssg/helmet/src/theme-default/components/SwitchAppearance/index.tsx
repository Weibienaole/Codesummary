import { toogle } from '../../../logic/toggleAppearance'
import styles from './index.module.scss'

interface SwitchProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
  id?: string
}

const Switch = (props: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      id={props.id || ''}
      className={`${styles.switch} ${props.className}`}
      {...(props.onClick ? { onClick: props.onClick } : {})}
    >
      <span className={styles.check}>
        <span className={styles.icon}>{props.children}</span>
      </span>
    </button>
  )
}

const SwtichAppearance = () => {
  return (
    <Switch onClick={toogle}>
      <div className={styles.sun}>
        <div className="i-carbon-sun w-full h-full"></div>
      </div>
      <div className={styles.moon}>
        <div className="i-carbon-moon w-full h-full"></div>
      </div>
    </Switch>
  )
}

export default SwtichAppearance
