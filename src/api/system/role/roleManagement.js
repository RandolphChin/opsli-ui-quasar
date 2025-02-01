import { api } from 'src/boot/axios'

export function getList(data) {
  return api({
    url: "/api/v1/system/role/findPage",
    method: "get",
    params: data,
  });
}
