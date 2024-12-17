import { api } from 'src/boot/axios'
import { setting } from "src/setting.config";
import { usePublicKeyStore} from "stores/publicKeyStore";
import  { encryptedRsa } from "src/utils/crypto/encrypt-rsa";
import { urlAddArgsByData } from "src/utils/index";

export async function doLogin(data) {
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
    url: "/system/login",
    method: 'post',
    data
  })
}

export function captcha(uuid) {
  // 请求地址
  let url = "captcha";
  let data = {
    uuid: uuid,
    timestamp: new Date().getTime(),
  };

  // 转换参数
  let params = Object.keys(data)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    })
    .join("&");
  return process.env.API + urlAddArgsByData(url, params);
 /*
  let accessUrl = process.env.API + urlAddArgsByData(url, params);
  return api({
    url: accessUrl,
    method: 'get'
  })
  */
}
