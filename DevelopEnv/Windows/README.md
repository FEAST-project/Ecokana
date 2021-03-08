# 開発環境の構築\_Windows

1. node.js のインストール

   1. 下記サイトからインストーラーをダウンロードします。  
      [node.js](https://nodejs.org/ja/)
   2. インストールを実行します。インストール設定はデフォルトのままで問題ありません。
   3. コマンドプロンプトから下記のコマンドを実行して、インストールされたことを確認します。

      ```bash
      node --version
      ```

2. npm のインストール

   1. npm は node.js と同時にインストールされています。
   2. コマンドプロンプトから下記のコマンドを実行して、インストールされたことを確認します。

      ```bash
      npm --version
      ```

3. Cordova のインストール

   1. コマンドプロンプトから下記のコマンドを実行して、インストールを実行します。

      ```bash
      npm install -g cordova
      ```

   2. コマンドプロンプトから下記のコマンドを実行して、インストールされたことを確認します。

      ```bash
      cordova --version
      ```

      _cordova コマンドの初回実行前に”`[?] May bower anonymously report usage statistics to improve the tool over time? (Y/n)`”という確認が表示されます。  
      これは改善のためのデータ送信許可設定の確認ですので、`Y`か`n`のどちらかを入力して実行してください。_

4. Visual Studio Code のインストール
   1. 下記サイトからインストーラーをダウンロードします。  
      [Visual Studio Code](https://code.visualstudio.com/)
   2. インストールを実行します。
   3. 日本語化します。
      1. Visual Studio Code を起動します。
      2. メニューバーの `view` > `Command Palette` を選択します。
      3. `Configure Display Language` を選択します。
      4. `Install addtional languages` を選択します。
      5. 左側の Extensions から `Japanese Language Pack for Visual Studio Code` を検索し、インストールします。
      6. Visual Studio Code を再起動します。
   4. CordovaTools プラグインをインストールします。
      1. 左側の”拡張機能”から `Cordova Tools` を検索し、インストールします。

5. Java SE Development Kit 8 のインストール
   1. 下記サイトからインストーラーをダウンロードします。  
      [Java SE Development Kit 8 - Downloads | Oracle](https://www.oracle.com/jp/java/technologies/javase/javase-jdk8-downloads.html)
   2. インストールを実行します。インストール設定はデフォルトのままで問題ありません。

6. Android SDK のインストール
   1. Android Studio のインストール
      1. 下記サイトからインストーラー（`Android Studio`）をダウンロードします。  
         [Download Android Studio and SDK tools Android Developers](https://developer.android.com/studio)
      2. インストールを実行します。インストール設定はデフォルトのままで問題ありません。
   2. Android SDK のインストール
      1. Android Studio を起動します。
      2. 初回起動時に"SDK が存在しない"エラーメッセージが出るので、ウィザードを進めて最新 API の'Android SDK'をインストールします。
      3. Android Studio の`Settings` > `Appearrance & Behavior` > `System Settings` > `Android SDK` から 28 以上の API を全てインストールしてください。  
         _過去に Android SDK をインストールしていると"SDK が存在しない"エラーメッセージは表示されません。この場合は、最新 API も 上記の`Settings`からインストールしてください。_
   3. 環境変数の`システム環境変数`に以下の変数を新規追加します。
      * 変数名：`ANDROID_HOME`
      * 変数値：`C:\Users\”Android Studioをインストールしたユーザー名”\AppData\Local\Android\sdk`  
        _環境変数の追加方法については割愛します。_

7. Gradle のインストール

   1. 下記サイトの`Installing manually`に従ってインストール、環境変数の追加を実行します。  
      [Gradle | Installation](https://gradle.org/install/)
