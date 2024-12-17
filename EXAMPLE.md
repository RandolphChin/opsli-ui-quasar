#### Get publicKey
```
import { usePublicKeyStore} from "stores/publicKeyStore";

const publicKeyStore =usePublicKeyStore();
// 检查是否已登录
onMounted(async () => {
  await publicKeyStore.fetchPublicKey()
  console.log(publicKeyStore.publicKey);
});
```
