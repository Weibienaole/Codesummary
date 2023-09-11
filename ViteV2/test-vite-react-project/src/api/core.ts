import { request } from '@/utils/request'

export const testReq = (data) =>
	request({
		url: 'iot_watch_series/blood/entry',
		data
	})
