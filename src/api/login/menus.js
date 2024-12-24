import { api } from 'src/boot/axios'
export function getMenuList(data,accessToken) {
  return api({
    url: "/api/v1/system/menu/findMenuTree",
    method: "post",
    data,
  });
}
