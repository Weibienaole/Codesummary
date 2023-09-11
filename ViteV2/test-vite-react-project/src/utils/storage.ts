import Cookies from 'js-cookie'

const TokenKey = 'token'
const origin = location.hostname

export const getCookies = (key: string, defaultValue: any): any =>
	Cookies.get(key) ? JSON.parse(Cookies.get(key)) : defaultValue

export const setCookies = (key: string, value: string): string =>
	Cookies.set(key, JSON.stringify(value), {
		domain: origin
	})

export const removeCookies = (...keys): any[] =>
	keys.map((key) => Cookies.remove(key, { domain: origin }))

export const getToken = (defaultValue: string = ''): string =>
	getCookies(TokenKey, defaultValue)

export const setToken = (token: string) => setCookies(TokenKey, token)

export const removeToken = () => removeCookies(TokenKey)
