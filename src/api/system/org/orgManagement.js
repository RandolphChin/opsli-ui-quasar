import { api } from 'src/boot/axios'


export function getTreeByDefWithUserToLike(data) {
  return api({
    url: "/api/v1/system/org/findTreeByDefWithUserToLike",
    method: "get",
    params: data
  });
}

export function getTreeByDef(data) {
  return api({
    url: "/api/v1/system/org/findTreeByDef",
    method: "get",
    params: data,
  });
}
