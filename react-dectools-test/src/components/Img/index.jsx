import React from 'react'

/**
 * 此组件用于图片懒加载，配合 zzy-javascript-devtools -> devtools.lazyImage() 方法使用
 * 必须等待加载目标的 data-src 属性赋值完毕，再执行此方法
 * @param {className} 赋予的类名 
 * @param {src} 目标地址 
 * @returns 
 */
function Img({className, src}){
  return <img src='' data-src={src} alt="" className={className}/>
}
export default Img