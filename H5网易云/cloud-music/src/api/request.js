/**
 * api from: https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi
 * cmd+f -> some one api
 */

import { axiosInstance } from "./config";
import { detectDeviceType, isAndroidPlatform } from 'zzy-javascript-devtools'

// banner
// 0-pc  1-android 2-ios 3-ipad  2&3 === 2
export const getBannerReq = () => {
  return axiosInstance.get(`/banner?type=${detectDeviceType() === 'Desktop' ? 0 : isAndroidPlatform() ? 1 : 2}&timestamp=1646805626220`)
}

// 推荐歌单
export const getRecommendListReq = (n = 30) => {
  return axiosInstance.get(`/personalized?limit=${n}`)
}

// 获取热门歌手数据
export const getHotSingerListReq = (offset = 0, limit = 50) => {
  return axiosInstance.get(`/top/artists?offset=${offset}&limit=${limit}`)
}

// 歌手分类列表
export const getSingerListReq = (offset = 0, type = -1, area = -1, initial = '', limit = 30) => {
  return axiosInstance.get(`/artist/list?offset=${offset}&limit=${limit}&type=${type}&area=${area}&initial=${initial}`)
}

// 总榜单列表
export const getRankListReq = () => {
  return axiosInstance.get(`/toplist/detail`)
}

// 获取歌单详情
export const getAlbumListReq = (id) => {
  return axiosInstance.get(`/playlist/detail?id=${id}`)
}

// 获取某一歌手歌曲列表
export const getSingerSongsListReq = id => {
  return axiosInstance.get(`/artists?id=${id}`)
}

// 获取歌曲歌词
export const getLyricReq = id => {
  return axiosInstance.get(`/lyric?id=${id}`)
}

// 获取热搜列表
export const getHotKeywordsListReq = () => {
  return axiosInstance.get(`/search/hot`)
}

// 搜索建议
export const getSearchSuggestReq = keywrods => {
  return axiosInstance.get(`/search/suggest?keywords=${keywrods}`)
}

// 搜索内容
export const getSearchResultReq = (keywrods) => {
  return axiosInstance.get(`search?keywords=${keywrods}`)
}

// 获取歌曲详情
export const getSongDetailReq = id => {
  return axiosInstance.get(`/song/detail?ids=${id}`)
}