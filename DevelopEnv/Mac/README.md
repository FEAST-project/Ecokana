# 開発環境の構築\_Mac

1. Homebrewのインストール

   1. 下記サイトに記載のインストールコマンドをターミナルで実行します。  
      [macOS（またはLinux）用パッケージマネージャー — Homebrew](https://brew.sh/index_ja)
   2. ターミナルから下記のコマンドを実行して、インストールされたことを確認します。

      ```bash
      brew -v
      ```

2. node.jsのインストール

   1. ターミナルから下記のコマンドを実行して、インストールを実行します。

      ```bash
      brew install node
      ```

3. npmのインストール

   1. npmはnode.jsと同時にインストールされています。
   2. ターミナルから下記のコマンドを実行して、インストールされたことを確認します。

      ```bash
      npm --version
      ```

4. Cordovaのインストール

   1. ターミナルから下記のコマンドを実行して、インストールを実行します。

      ```bash
      npm install -g cordova
      ```

   2. ターミナルから下記のコマンドを実行して、インストールされたことを確認します。

      ```bash
      cordova --version
      ```

      _cordova コマンドの初回実行前に”`[?] May bower anonymously report usage statistics to improve the tool over time? (Y/n)`”という確認が表示されます。  
      これは改善のためのデータ送信許可設定の確認ですので、`Y`か`n`のどちらかを入力して実行してください。_

5. 最新のXcodeのインストール

   1. AppStoreから最新のXcodeをインストールします。

6. シミュレーターのインストール

   1. ターミナルから下記のコマンドを実行して、インストールされたことを確認します。

      ```bash
      npm install ios-sim -g
      ```

7. アクティブなXcodeディレクトリを指定する  
   _複数のバージョンのXcodeをインストールしている場合に、最新バージョンをデフォルトに設定します。_

   1. ターミナルから下記のコマンドを実行して、最新バージョンの場所を指定します。

      ```bash
      sudo xcode-select --switch /Applications/Xcode.app
      ```

      * "--switch"以降に最新のXcode.appのパスとファイル名を指定してください。
