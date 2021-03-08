# 開発環境の構築\_データベース

データベースはさくらインターネット上にMySQLで構築する手順のみを記載します。  
別のホスティングサービスやデータベース管理システムを使用する場合は、内容を読み替えて手順を実行してください。

1. データベースの作成

   1. さくらインターネットのコントロールパネルからデータベースの新規追加をします。  
      _操作方法については割愛します。_

   2. データベースは以下の通りに設定して作成します。
      * データベース名：任意の名称
      * データベース文字コード：`UTF-8(utf8mb4)`
      * データベース接続用パスワード：任意のパスワード

   3. さくらインターネットの場合、データベースに割り振られるサーバー番号（下記"`＊＊＊`"部分）が表示されます。WebAPI設定手順で使用するので番号を控えてください。
      * mysql`＊＊＊`.db.sakura.ne.jp

   4. 作成したデータベースの管理画面を開きます。

   5. 管理画面のトップに表示される`一般設定`のうち、以下の設定を変更します。
      * サーバ接続の照合順序：`utf8mb4_unicode_ci`

2. テーブルの作成
   1. 作成したデータベースの管理画面を開きます。
   2. SQL画面を開き、**Database\\SQL\\CREATE_TABLE**内の下記テキストファイルに記載のSQLを実行します。
      * `IDEA.txt`
      * `IDEA_questionnaire.txt`
      * `JICFS_IDEA.txt`
      * `JICFS_IDEA_questionnaire.txt`
      * `JICFS_IDEA_add.txt`

3. データのインポート  
   _対象はIDEAテーブルとJICFS_IDEAテーブルです。_

   1. 作成したデータベースの管理画面を開きます。
   2. 対象テーブルのインポート画面を開き、以下の通りに設定して実行します。
      * アップロードファイル：**Database\\DataCSV**内の下記csvファイル
        * `IDEA.csv`
        * `JICFS_IDEA.csv`
      * ファイルの文字セット：`UTF-8`
      * フォーマット：`CSV`
      * カラムの区切り記号：`,`
      * カラム囲み記号：`"`
      * カラムのエスケープ記号：任意（エスケープが必要な文字は不使用）
      * 行の終端記号：`auto`
      * エンコーディングへの変換：`なし`

4. アンケートテーブルの初期値入力  
   _対象はIDEA_questionnaireテーブルとJICFS_IDEA_questionnaireテーブルです。  
   IDEAテーブルとJICFS_IDEAテーブルのProduct_ID数に対応した、各カウントが初期値0のデータを作成します。_

   1. 作成したデータベースの管理画面を開きます。
   2. SQL画面を開き、**Database\\SQL\\INSERT_INIT**内の下記テキストファイルに記載のSQLを実行します。
      * `IDEA_questionnaire.txt`
      * `JICFS_IDEA_questionnaire.txt`

5. 追加情報テーブルの入力  
   _対象はJICFS_IDEA_addテーブルです。_

   1. 初期値入力  
      _JICFS_IDEAテーブルのProduct_ID数に対応した、補正後のスコア値が初期値0のデータを作成します。_

      1. 作成したデータベースの管理画面を開きます。
      2. SQL画面を開き、**Database\\SQL\\INSERT_INIT**内の下記テキストファイルに記載のSQLを実行します。
         * `\JICFS_IDEA_add.txt`

   2. 補正後スコア計算  
      _JICFS_IDEAテーブルのスコア値とJICFS_IDEA_questionnaireテーブルのアンケート結果を基に、補正後のスコア値に更新します。_

      1. 作成したデータベースの管理画面を開きます。
      2. SQL画面を開き、**Database\\SQL\\UPDATE_DATA**内の下記テキストファイルに記載のSQLを実行します。
         * `JICFS_IDEA_add.txt`

   3. INDEXの作成
      1. 作成したデータベースの管理画面を開きます。
      2. SQL画面を開き、**Database\\SQL\\CREATE_INDEX**内の下記テキストファイルに記載のSQLを実行します。
         * `IDEA.txt`
         * `IDEA_questionnaire.txt`
         * `JICFS_IDEA.txt`
         * `JICFS_IDEA_questionnaire.txt`
         * `JICFS_IDEA_add.txt`
