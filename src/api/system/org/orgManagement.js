import { api } from 'src/boot/axios'


export function getTreeByDefWithUserToLike(data) {
  return api({
    url: "/api/v1/system/org/findTreeByDefWithUserToLike",
    method: "get",
    params: data
  });
}
