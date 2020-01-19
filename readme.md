# toiretwit
トイレに設置した[AWS IoT Button](https://aws.amazon.com/jp/iotbutton/)を押すことで任意の文言でツイートする。

## 主な機能
トイレに設置した[AWS IoT Button](https://aws.amazon.com/jp/iotbutton/)を押すとランダムで登録している文言をツイートする。

## 環境
AWS Lambda( Node.js 10.x )
AWS DynamoDB

## 利用手順

### 事前準備
TwitterAPIよりアクセストークンと投稿対象のアカウントのコンシューマーキーを取得する

### リポジトリをダウンロード
任意のディレクトリにて
```
git clone https://github.com/shun4617/toiretwit
cd toiretwit
```

### AWS Lambdaアップロード用のzip作成
作成に必要なパッケージのダウンロード
```
npm install
```
### zip作成
index.jsとnode_modulesを含めたzipを作成（zipファイルの名前は任意）
```
zip -r function.zip index.js node_modules
```

### AWS Lambdaに新規関数を作成する
その際に環境は、`Node.js 10.x`を選択してください。

### 関数のトリガーにAWS Iot Buttonを設定
`トリガーの追加`を押し、`AWS IoT`を選択しAWS Iot Buttonを関連付けてください。

### 関数の実行ロールの変更
実行ロールにAWS DynamoDBの読み取り権限を付与してください。

### AWS Lambdaの環境変数作成
キーに`ACCCESS_TOKEN_KEY`と`ACCESS_TOKEN_SECRET`と`USER`を作成し
値は`ACCCESS_TOKEN_KEY`と`ACCESS_TOKEN_SECRET`にはTwitterAPIのトークンを入力し`USER`には、任意の名前を入力してください。

### AWS Lambdaにzipをアップロードする
先ほど作成したzipをAWS Lambdaにzipをアップロードして保存してください。

### AWS DynamoDBにテーブル作成
AWS　DynamoDBに新規テーブルを２つ作成します。

１つ目のテーブルには`toiretwit`と名付け、プライマリーパーティションキーを`user`とし型を`string`にします。


２つ目のテーブルには`toiretwit-message`と名付け、プライマリーパーティションキーを`id`とし型を`Number`にします。

### 各テーブルに値を追加

`toiretwit`テーブルには、
```
[
    {
        user: (関数の環境変数userに対応する値),
        access_token_key: (TwitterAPIのコンシューマーキー),
        access_token_secret: (TwitterAPIのコンシューマーシークレットキー)
    }
]
```

のように作成してください。

`toiretwit-message`テーブルには、
```
[
    {
        id: 0,
        message: (重複しないツイートする文言),
    },
    {
        id: 1,
        message: (重複しないツイートする文言),
    }、
    {
        id: 2,
        message: (重複しないツイートする文言),
    }
]
```

のように作成してください。
なお、idは必ず０からの連番とし、３つ以上の文言を追加してください。（Twitterの仕様上、連続して同様のツイートができないため）


