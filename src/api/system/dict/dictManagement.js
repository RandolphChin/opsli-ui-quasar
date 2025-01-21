import { api } from 'src/boot/axios'

export function getList(data) {
  return api({
    url: "/api/v1/system/dict/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return api({
    url: "/api/v1/system/dict/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return api({
    url: "/api/v1/system/dict/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return api({
    url: "/api/v1/system/dict/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return api({
    url: "/api/v1/system/dict/delAll",
    method: "post",
    params: data,
  });
}

export function getDictListByCodeParams(data) {
  return api({
    url: "/api/v1/system/dict/getDictListByCode",
    method: "get",
    params: data,
  });
}

export function getDictListByCode(data) {
  return api({
    url: "/api/v1/system/dict/getDictListByCode",
    method: "get",
    params: data,
  });
}
