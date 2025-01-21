import { api } from 'src/boot/axios'
import {setting} from "src/setting.config";
import {usePublicKeyStore} from "stores/publicKeyStore";
import {encryptedRsa} from "src/utils/crypto/encrypt-rsa";

export function getList(data) {
  return api({
    url: "/api/v1/system/user/findPage",
    method: "get",
    params: data,
  });
}

export async function doEnableAccount(data) {
  const encryptRSA = setting.encryptRSA;
  if (encryptRSA) {
    let publicKeyStore = usePublicKeyStore();
    await publicKeyStore.fetchPublicKey()
    let publicKey = publicKeyStore.publicKey;
// 加密数据
    let encrypted = encryptedRsa(data, publicKey);
    data = {
      encryptData: encrypted,
    };
  }
  return api({
    url: "/api/v1/system/user/enableAccount",
    method: 'post',
    data
  })
}

export function doUpdate(data) {
  return api({
    url: "/api/v1/system/user/update",
    method: "post",
    data,
  });
}

export function doSetOrg(data) {
  return api({
    url: "/api/v1/system/user/org/setOrg",
    method: "post",
    data,
  });
}

export function getOrgByUserId(data) {
  return api({
    url: "/api/v1/system/user/getOrgByUserId",
    method: "get",
    params: data,
  });
}
