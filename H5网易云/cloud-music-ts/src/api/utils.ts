const getCount = (count: number): string => {
  if (count < 0) return ''
  if (count < 10000) {
    return count.toString()
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + '万'
  } else {
    return Math.floor(count / 10000000) / 10 + '亿'
  }
}

export { getCount }
