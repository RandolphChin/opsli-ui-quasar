import { api } from 'src/boot/axios'

export function getPublicKey() {
  return api({
    url: "/api/v1/common/public-key",
    method: 'get'
  })
}
