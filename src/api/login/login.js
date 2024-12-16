import { api } from 'src/boot/axios'

export function doLogin(params) {
  return api({
    url: 'your-url',
    method: 'get',
    params: params
  })
}
