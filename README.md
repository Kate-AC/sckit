# sckit

sckitはSolidity開発用の環境を提供するものです。  
src配下のsolファイルに変更があった場合、自動で検知してビルドしてくれます。

![2021y11m11d_144842163](https://user-images.githubusercontent.com/25458018/141244758-f483b078-9369-4d7d-8287-d8edfa67be4e.png)


## 環境構築方法

`make all` これだけで環境構築は完了するはず

#### 個別に実行する場合

`make build` DockerImageをビルドします  
`make install` 必要なnpmなどをインストールします  
`make run` 環境を立ち上げます  
`make prepare` デフォルトのアカウントを作成し、100ETHを付与します

geth内にあるアカウントの0番目がcoinbaseのアカウントになり、  
1番目をデフォルトのアカウントとしています。

## 便利コマンド
`make myEth` デフォルトアカウントの所持ETHを表示  
`make myAddress` デフォルトアカウントのアドレスを表示
