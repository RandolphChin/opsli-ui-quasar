import { api } from 'src/boot/axios'


export function getUserInfo() {
  return api({
    url: "/api/v1/system/user/getInfo",
    method: "get"
  });
}
