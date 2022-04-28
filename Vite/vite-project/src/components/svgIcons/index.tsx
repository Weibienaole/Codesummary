export interface SvgIconProps {
  // 默认接受三个参数 svg名称、前缀、颜色
  name: string
  prefix?: string
  color?: string
  [key: string]: any
}

const SvgIcon = ({
  name,
  prefix = 'icon',
  color = '#333',
  ...props
}: SvgIconProps) => {
  // 拼接svg id
  const prefixId = `#${prefix}-${name}`
  return (
    // 多余props添加在svg属性中
    <svg {...props} aria-hidden="true">
      {/* 赋值拿到指定svg */}
      <use href={prefixId} fill={color} />
    </svg>
  )
}

export default SvgIcon
