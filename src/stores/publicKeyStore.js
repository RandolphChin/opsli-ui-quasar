// stores/publicKeyStore.js
import { defineStore } from 'pinia';
import { getPublicKey } from 'src/api/login/publicKey';
import { getCookies, setCookiesByExpiresTime } from 'src/utils/cookies';

const COOKIE_KEY = 'public_key';

export const usePublicKeyStore = defineStore('publicKey', {
  state: () => ({
    publicKey: getCookies(COOKIE_KEY) || null,
  }),
  actions: {
    async fetchPublicKey() {
      if (!this.publicKey) {
        try {
          const response = await getPublicKey();
          this.publicKey = response.data.data;
          setCookiesByExpiresTime(COOKIE_KEY, this.publicKey, 300); // 存储5分钟
        } catch (error) {
          console.error('Error fetching public key:', error);
        }
      }
    },
  },
});
