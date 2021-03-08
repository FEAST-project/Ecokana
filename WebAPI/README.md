# 開発環境の構築\_WebAPI

WebAPIはさくらインターネット上にLaravelを使用して構築する手順のみを記載します。  
別のホスティングサービスやフレームワークを使用する場合は、内容を読み替えて手順を実行してください。

1. さくらインターネットへのSSHログイン

   1. コマンドプロンプトから下記のコマンドを実行して、SSHログインします。

      ```bash
      ssh ”アカウント名”@”ドメイン名”.sakura.ne.jp
      ```

      * ”アカウント名”：さくらインターネットのアカウント名
      * ”ドメイン名”：さくらインターネットのドメイン名

   2. 質問`"Are you sure you want to continue connecting (yes/no)?"`に回答します。

      ```bash
      Yes
      ```

   3. パスワードを入力します。パスワードはさくらインターネットのコントロールパネルのログインパスワードと同一です。

2. Composer（PHPのライブラリ管理ツール）のインストール

   1. SSHログイン中のコマンドプロンプトで下記ホームディレクトリに移動します。

      ```bash
      home\”ドメイン名”\www
      ```

      * ”ドメイン名”：さくらインターネットのドメイン名

   2. 下記のコマンドを実行して、Composerをダウンロードします。

      ```bash
      curl -sS https://getcomposer.org/installer | php
      ```

   3. 下記のコマンドを実行して、Composerをインストールします。

      ```bash
      php composer.phar
      ```

3. Laravelのインストール

   1. SSHログイン中のコマンドプロンプトで下記のコマンドを実行し、Laravelをインストールします。同時にプロジェクトが作成されます。

      ```bash
      php -d memory_limit=768M composer.phar create-project "laravel/laravel=6.*" ”プロジェクト名”
      ```

      * ”プロジェクト名”：任意のプロジェクト名  
        _当リポジトリのアプリソースでは”test”をプロジェクト名に指定するとデバッグ機能が使用できるようになっています。_

   2. ウェブブラウザから下記URLへアクセスして接続テストをします。
      * `http://”ドメイン名”.sakura.ne.jp/”プロジェクト名”/`
        * ”ドメイン名”：さくらインターネットのドメイン名
        * ”プロジェクト名”：作成したプロジェクト名  
          _アクセスするとLaravel公式のドキュメント等が表示されます。_

4. 環境変数設定
   1. さくらインターネットのコントロールパネルからファイルマネージャーを起動します。
   2. 作成したプロジェクトフォルダ直下の`.env`ファイルの下記パラメータを編集します。
      * APP_DEBUG=`false`
      * DB_HOST=`mysql”サーバー番号”.”ドメイン名”.sakura.ne.jp`
        * ”サーバー番号”：データベース作成時に割り振られたサーバー番号
        * ”ドメイン名”：さくらインターネットのドメイン名
      * DB_DATABASE=`”データベース名”`
      * DB_USERNAME=`”さくらインターネットのユーザー名”`
      * DB\*PASSWORD=`”データベースのパスワード”`  
        _上記3パラメータに`”`は不要です。_

5. モデル設定  
   _Laravelからデータベーステーブルにアクセスできるようにします。_

   1. モデル作成

      1. SSHログイン中のコマンドプロンプトで作成したプロジェクトフォルダにディレクトリ移動します。

      2. 下記のコマンドを実行して、各テーブル毎のモデルを作成します。

         ```bash
         php artisan make:model IDEA
         ```

         ```bash
         php artisan make:model JICFS_IDEA
         ```

         ```bash
         php artisan make:model IDEA_questionnaire
         ```

         ```bash
         php artisan make:model JICFS_IDEA_questionnaire
         ```

         ```bash
         php artisan make:model JICFS_IDEA_add
         ```

   2. モデル編集  
      _アクセス先テーブルを設定します_

      1. さくらインターネットのコントロールパネルからファイルマネージャーを起動します。
      2. 作成したプロジェクトフォルダ内の`app\"各テーブル名".php`の"各テーブル名"classを以下の通りに編集し、アクセス設定を追記します。以下はIDEA.phpの例です。

      ```php:IDEA.php
      class IDEA extends Model
      {
         // 以下2行を追加
         public $timestamps = false;
         protected $table = 'IDEA'; // 各テーブル名を指定
      }
      ```

6. ルーティング設定  
   _アプリからのリクエストに応じてサーバー処理を振り分けます。_

   1. さくらインターネットのコントロールパネルからファイルマネージャーを起動します。
   2. 作成したプロジェクトフォルダ内の`route\web.php`を、**WebAPI\\source\\routes\\web.php**で上書きします。

7. コントローラー設定  
   _サーバー処理を設定します。_

   1. コントローラー作成

      1. SSHログイン中のコマンドプロンプトで作成したプロジェクトフォルダにディレクトリ移動します。

      2. 下記のコマンドを実行して、各テーブルのコントローラーを作成します。

         ```bash
         php artisan make:controller IDEAController
         ```

         ```bash
         php artisan make:controller IDEA_questionnaireController
         ```

         ```bash
         php artisan make:controller JICFS_IDEAController
         ```

         ```bash
         php artisan make:controller JICFS_IDEA_questionnaireController
         ```

         ```bash
         php artisan make:controller JICFS_IDEA_addController
         ```

   2. コントローラーの編集  
      _具体的なサーバー処理とレスポンスを設定します。_
      1. さくらインターネットのコントロールパネルからファイルマネージャーを起動します。
      2. 作成したプロジェクトフォルダ内の`app\Http\Controllers\"各テーブル名"Controller.php`を、**WebAPI\\source\\app\\Http\\Controllers\\"各テーブル名"Controller.php**で上書きします。
      3. 上書き後のphpファイルの文字コードが`UTF-8`、改行コードが`LF`であることを確認します。

8. CSRFチェック無効化  
   _アプリからLaravelにアクセスできるようにします。_

   1. さくらインターネットのコントロールパネルからファイルマネージャーを起動します。
   2. 作成したプロジェクトフォルダ内の`app\Http\Kernel.php`のKernelclassの以下の1行（CSRFチェック設定）をコメントアウトします。

      ```php:Kernel.php
      /* \App\Http\Middleware\VerifyCsrfToken::class, */
      ```

9. データベース設定

   1. さくらインターネットのコントロールパネルからファイルマネージャーを起動します。
   2. 作成したプロジェクトフォルダ内の`config\database.php`の`mysql`内パラメータを以下の通りに編集します。

      ```php:database.php
        'connections' => [
           (略)
           'mysql' => [
              （略）
              'prefix_indexes' => true,
            //'strict' => true,       // ←”strict”をコメントアウト
              'modes' => [            // ←”modes”配列を追加
               //'ONLY_FULL_GROUP_BY', // OFF
               'STRICT_TRANS_TABLES',
               'NO_ZERO_IN_DATE',
               'NO_ZERO_DATE',
               'ERROR_FOR_DIVISION_BY_ZERO',
               'NO_AUTO_CREATE_USER',
               'NO_ENGINE_SUBSTITUTION'
              ],
              'engine' => null,
              （略）
      ```

10. ファイルアクセス設定

    1. サーバー上のファイルへの直リンクを防ぐ設定

       1. さくらインターネットのコントロールパネルからファイルマネージャーを起動します。

       2. ホームディレクトリ（`home\”ドメイン名”\www`）直下の`.htaccess`を、以下の内容で上書きします。

          ```:.htaccess
          Options -Indexes
          AuthUserFile /home/”ドメイン名”/www/.htpasswd
          AuthType Basic
          AuthName "Web access"
          Satisfy all
          Order deny,allow
          ```

          * ”ドメイン名”：さくらインターネットのドメイン名

       3. ホームディレクトリ（`home\”ドメイン名”\www`）直下の`.htaccess`を、作成したプロジェクトフォルダ直下と`routes`フォルダの2か所にコピーします。

       4. プロジェクトフォルダ直下にコピーした`.htaccess`を、以下の内容で上書きします。

          ```bash:.htaccess
          RewriteEngine on
          RewriteBase /
          RewriteCond %{REQUEST_URI} !^.$
          RewriteRule ^(.*)$ /index.php [L,R]
          ```

    2. サーバーからの転送ファイルの圧縮設定

       1. さくらインターネットのコントロールパネルからファイルマネージャーを起動します。
       2. ホームディレクトリ（`home\”ドメイン名”\www`）直下の`.htaccess`に、以下の内容を追記します。  
           _直リンクを防ぐ設定を上書きしないように注意してください。_

          ```bash:.htaccess
          # mod_deflate を有効にする
          SetOutputFilter DEFLATE
          # レガシーブラウザは gzip 圧縮を行わない
          BrowserMatch ^Mozilla/4 gzip-only-text/html
          BrowserMatch ^Mozilla/4\.0[678] no-gzip
          BrowserMatch \bMSI[E] !no-gzip !gzip-only-text/html
          # 画像ファイルはgzip圧縮を行わない
          SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png|ico)$ no-gzip dont-vary
          # プロキシサーバ用の設定
          Header append Vary User-Agent env=!dont-vary
          # Accept-Encoding を無視して強制的に gzip を返す
          SetEnv force-gzip
          ```
