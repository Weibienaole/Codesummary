import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// 定义传入的拦截器接口，并且都是可以可选的。
interface IRequestInterceptors<T = AxiosResponse> {
	// 请求成功时的拦截器
	requestSuccessInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
	// 请求失败时的拦截器
	requestErrorInterceptor?: (err: any) => any
	// 响应成功时的拦截器
	responseSuccessInterceptor?: (res: T) => T
	// 响应失败时的拦截器
	responseErrorInterceptor?: (err: any) => any
}
// 这个接口将要代替AxiosRequestConfig
export interface IRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
	// 每个request实例可以不传入拦截器
	interceptors?: IRequestInterceptors<T>
	// 是否显示loading
	showLoading?: boolean
}
