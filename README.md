# sckit
<br>
sckitはSolidity開発用の環境を提供するものです。<br>
src配下のsolファイルに変更があった場合、自動で検知してビルドしてくれます。
<br>
<br>

![2021y11m11d_144842163](https://user-images.githubusercontent.com/25458018/141244758-f483b078-9369-4d7d-8287-d8edfa67be4e.png)
![2021y11m14d_004141654](https://user-images.githubusercontent.com/25458018/141649955-e4caaeb0-5421-4ca0-9b42-47621728c872.png)
<br>
<br>
オートビルド後、builtフォルダにコントラクト毎にtsファイルが生成されます。    
sandbox/test.tsでは、そのtsファイルの使い方の例があります。
<br>
<br>

```TypeScript
sandbox/test.ts

import Web3 from 'web3';
import helloWorldContract from '../built/HelloWorldContract';
import getMyEthAccount from '../libs/getMyEthAccount';

(async () => {
  const web3 = new Web3('http://eth:8545');
  web3.eth.defaultAccount = await getMyEthAccount();

  const contract = new web3.eth.Contract(
    helloWorldContract.abi,
    helloWorldContract.address
  );

  contract.methods.getSender()
    .call()
    .then((response: any) => {
      console.log(response);
    });
})();
```
<br>
<br>
ビルドが走る度にaddressが変更されますが、これであれば修正する毎に書き換える必要はありません。<br>
実行する場合は

```Shell

docker-compose exec sol ts-node --project sckit-tsconfig.json ./sandbox/test.ts

```

となります。
<br>
<br>

## 環境構築方法

`make all` これだけで環境構築は完了するはず。  

#### 個別に実行する場合

`make build` DockerImageをビルドします  
`make run` 環境を立ち上げます  
`make prepare` デフォルトのアカウントを作成し、100ETHを付与します

geth内にあるアカウントの0番目がcoinbaseのアカウントになり、  
1番目をデフォルトのアカウントとしています。

## 便利コマンド
`make myEth` デフォルトアカウントの所持ETHを表示  
`make myAddress` デフォルトアカウントのアドレスを表示
