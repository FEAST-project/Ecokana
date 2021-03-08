# アプリビルド\_Android

Android版はWindows機で開発するものとします。  
「開発環境の構築\_Windows」が実行済であることが前提となっています。

1. ソースの配置

   1. **Application\\source**を任意の場所に配置します。  
      _必要なライブラリ、コンポーネント、プラグインは全て導入された状態になっています。_

2. アプリのビルド

   1. コマンドプロンプトを開き、配置した`source\App`フォルダにディレクトリ移動します。

   2. 下記のコマンドを実行して、Android用プラットフォームを追加します。

      ```bash
      cordova platform add android
      ```

   3. 下記のコマンドを実行して、Android用にビルドします。

      ```bash
      cordova build android
      ```

      _初回のビルドには数分かかります。_

3. インストール

   1. インストーラーを作成してAndroid機にインストール

      1. コマンドプロンプトでのビルド結果の末尾に表示されるapkファイルをAndroid端末の任意の場所に配置します。
      2. Android端末上でapkファイルを実行するとインストールが始まります。

   2. WindowsにUSB接続したAndroid機にインストール

      1. Android端末を開発者モードに切り替え、USBデバッグをONにします。  
         _開発者モードへの切り替え手順は割愛します。_
      2. Android端末をWindows機にUSB接続します。
      3. コマンドプロンプトを開き、`source\App`フォルダにディレクトリ移動します。
      4. 下記のコマンドを実行して、Androidにインストールします。

         ```bash
         cordova run Android
         ```

         _同時にビルドが実行されます。_

   3. Androidエミュレータにインストール

      1. エミュレーターのインストール
         1. Android Studio を起動します。
         2. `AVD Manager`を開きます。
         3. `Create Virtual Device`を選択します。
         4. 任意の画面サイズの端末を選択してダウンロードします。
      2. `AVD Manager`からエミュレーターを起動します。
      3. エミュレータ―が起動した状態で、下記のコマンドを実行してエミュレーターにインストールします。

         ```bash
         cordova run Android
         ```

         _同時にビルドが実行されます。_

4. ブラウザデバッグ  
    _起動直後の画面が崩れたり、スキャンや設定ファイル保存等の使用できない機能があり、実機とは一致しない部分が多くあります。大まかな外観やスクリプト処理の確認用として使用してください。_

   1. VisualStudioCodeから  
       _デバッグコンソールを使用してエラー内容を詳細に確認することができます。_

      1. VisualStudioCodeを起動します。
      2. ”フォルダーを開く”で、`source\App`フォルダを選択します。
      3. 左側の”実行”で、セレクトボックスで`Simulate Android in browser`または`Simulate iOS in browser`を選択して`実行`（▶ボタン）をクリックします。

   2. コマンドプロンプトから

      1. コマンドプロンプトを開き、`source\App`フォルダにディレクトリ移動します。

      2. 下記のコマンドを実行して、ブラウザ用プラットフォームを追加します。

         ```bash
         cordova platfroms add browser
         ```

      3. 下記のコマンドを実行するとwebブラウザで起動します。

         ```bash
         cordova run browser
         ```
