import { setting } from "src/setting.config";
import cookie from "js-cookie";
import { isNull} from "src/utils/validate";
import { getDictListByCodeParams } from "src/api/system/dict/dictManagement";
import { api } from 'src/boot/axios'

// 缓存前缀 方便统一删除处理
const cachePrefix = "opsli:dict";

/**
 * 获得前端本地缓存
 * @returns {null|any}
 */
export function getCache() {
  let cache = null;
  if (setting.storage) {
    if ("localStorage" === setting.storage) {
      cache = localStorage.getItem(cachePrefix);
    } else if ("sessionStorage" === setting.storage) {
      cache = sessionStorage.getItem(cachePrefix);
    } else if ("cookie" === setting.storage) {
      cache = cookie.get(cachePrefix);
    } else {
      cache = localStorage.getItem(cachePrefix);
    }
  } else {
    cache = localStorage.getItem(cachePrefix);
  }
  return isNull(cache) ? null : JSON.parse(cache);
}

export function getDictList(typeCode) {
  let cache = getCache();
  if (cache == null) {
    cache = {};
  }

  let dictList = cache[typeCode];

  // 如果本地缓存没有 则去远端缓存中获取
  if (isNull(dictList) || dictList.length === 0) {
    let dataReturn = null;
    getDictListByCodeParams({ typeCode: typeCode }).then(ret => {
      const { data } = ret.data;
      setDictList(typeCode, data);
      dataReturn = data
    });

    return isNull(dataReturn) ? [] : dataReturn;
  }
  return isNull(dictList) ? [] : dictList;
}

/**
 * @copyright parker
 * @description 存储字典
 * @param typeCode
 * @param dictList
 * @returns {void|*}
 */
export function setDictList(typeCode, dictList) {
  // 先去获得本地缓存
  let cache = getCache();
  if (isNull(cache)) {
    cache = {};
  }

  // 存放缓存
  cache[typeCode] = dictList;
  let json = JSON.stringify(cache);
  if (setting.storage) {
    if ("localStorage" === setting.storage) {
      return localStorage.setItem(cachePrefix, json);
    } else if ("sessionStorage" === setting.storage) {
      return sessionStorage.setItem(cachePrefix, json);
    } else if ("cookie" === setting.storage) {
      return cookie.set(typeCode, cachePrefix);
    } else {
      return localStorage.setItem(cachePrefix, json);
    }
  } else {
    return localStorage.setItem(cachePrefix, json);
  }
}
