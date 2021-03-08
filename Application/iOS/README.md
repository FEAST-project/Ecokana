# アプリビルド\_iOS

「開発環境の構築\_Mac」が実行済であることが前提となっています。

1. ソースの配置

   1. `アプリソース\source.zip`を任意の場所に配置します。  
      _必要なライブラリ、コンポーネント、プラグインは全て導入された状態になっています。_

2. アプリのビルド

   1. ターミナルを開き、配置した`source\App`フォルダにディレクトリ移動します。

   2. 下記のコマンドを実行して、iOS用プラットフォームを追加します。

      ```bash
      cordova platform add ios@5.1.1
      ```

   3. 下記のコマンドを実行して、iOS用にビルドします。

      ```bash
      cordova build ios
      ```

      _初回のビルドには数分かかります。_

      1. ビルド時にエラーメッセージ  
         ”`”ファイルパス/ファイル名” Permission denied`  
         `Command PhaseScriptExecution failed with a nonzero exit code`”  
         が表示された場合にはターミナルで以下のコマンドを実行してファイルアクセス権限を付与します。

         ```bash
         cd ファイルパス
         chmod +x ファイル名（拡張子付き）
         ```

      2. 上記の他にもOSのバージョン、Xcodeのバージョン等が原因でビルドが失敗することがあります。失敗した場合はエラーコードを確認して対処してください。

3. インストール

   1. Xcodeを起動

      1. `source\App\platforms\ios\エコかな.xcodeproj`をXcodeで開きます。

   2. MacにUSB接続したiOS機にインストール

      _iOSの実機にインストールするためには”証明書の取得”、”アプリケーションIDの作成”、”Provisioning Profileの作成”が必要です。これらの手順については以下のサイト等を参考にしてください。_  
       [Xcodeを使ったIPAファイルの作成手順(DeployGate)](https://docs.deploygate.com/docs/export-ipa)

      1. iOS端末をMacにUSB接続します。
      2. iOSに表示される”`このコンピューターを信頼しますか`”ダイアログで”`信頼`”を選択します。
      3. Xcodeのツールバー上のビルドターゲットのSchemeに`エコかな`、Deviceに`接続したiOS`を選択して、`Build and then run the current scheme`（▶ボタン）を実行します。

   3. iOSエミュレータにインストール  
      _エミュレータの場合はXcodeのみでインストール可能です。_

      1. Xcodeのツールバー上のビルドターゲットのSchemeに`エコかな`、Deviceに`iOS Simulatorsの任意の機種`を選択して、`Build and then run the current scheme`（▶ボタン）を実行します。

4. ブラウザデバッグ  
    _起動直後の画面が崩れたり、スキャンや設定ファイル保存等の使用できない機能があり、実機とは一致しない部分が多くあります。大まかな外観やスクリプト処理の確認用として使用してください。_

   1. ターミナルを開き、`source\App`フォルダにディレクトリ移動します。

   2. 下記のコマンドを実行して、ブラウザ用プラットフォームを追加します。

      ```bash
      cordova platform add browser
      ```

   3. 下記のコマンドを実行するとwebブラウザで起動します。

      ```bash
      cordova run browser
      ```
