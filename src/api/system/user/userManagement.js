import { api } from 'src/boot/axios'

export function getList(data) {
  return api({
    url: "/api/v1/system/user/findPage",
    method: "get",
    params: data,
  });
}
