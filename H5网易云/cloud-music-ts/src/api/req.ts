import request from "./request";

export const getBannerReq = () => {
  return request('banner')
}

export const getRecommendListReq = () => {
  return request('personalized')
}