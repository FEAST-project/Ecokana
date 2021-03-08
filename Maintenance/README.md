# メンテナンス

目的別にソース等の修正方法を記載します。

* * *

## アプリソース修正の注意点

エコかなアプリはCordova、OnsenUIを使用して作成されています。アプリのソースを修正する際は以下の点に注意してください。

* 変更対象は基本的には`source\App\index.xml`または`source\App\www内ファイル`です。
  * `source\App\www\platforms以下のファイル`はビルドにより生成されるので、直接変更しないでください。
* 各画面の動作概要は**Application\\ApplicationInst.pdf**に記載しています。
* 既存ソースの用途は**Application\\sourceUsage.pdf**に記載しています。
* 既存データベース項目の用途は**Database\\DatabaseItem.pdf**に記載しています。
* OnsenUIコンポーネントの使用方法は以下のサイトを参照してください。  
   [Components Reference for Version 1.x - Onsen UI Framework - Onsen UI](https://ja.onsen.io/v1/reference/javascript.html)

* * *

## 接続先apiを変更する

WebAPIの構築（Laravelインストール）で作成した”プロジェクト名”のAPIへの接続設定です。

1. `source\App\www\json\targetjson`にハッシュを追加します。

   ```json:ハッシュ例
   {
      "プロジェクト名": {
         "api_url" : "https://ドメイン名.sakura.ne.jp/プロジェクト名/public/"
      },
   }
   ```

   * プロジェクト名：Laravelプロジェクト名
   * ドメイン名：さくらインターネットのドメイン名
2. `source\App\config.xml`の`接続api変更スクリプト`のvalueに、上記で追加したプロジェクト名（シングルクォートで囲む）を指定します。

* * *

## 画面を追加する

1. `source\App\www`にhtml、css、jsファイルを追加します。
2. `source\App\index.html`に上記で追加したcss、jsファイルの読み取り処理を追加します。

* * *

## 画面遷移処理を追加する

1. 遷移元画面に遷移ボタンを追加します。

   ```html:ボタン例
   <ons-button onclick="navi.pushPage('遷移先.html', {animation:'slide', data:{key:'value'}} )">
   ```

   * 遷移先：遷移先html名
   * dataハッシュ：遷移時処理に渡すパラメータ
2. `source\App\www\js\common.js`に遷移時処理を追加します。

   ```js:遷移時処理例
   document.addEventListener(
      "init",
      function (event) {
         switch (page.id) {
         case "遷移先.html":
            response = sendRequest("httpリクエスト内容", page.data);
            遷移時処理関数(response, page.data);
            break;
         }
      }
   );
   ```

   * 遷移先：遷移先html名
   * httpリクエスト内容：httpリクエストの処理を分別します
   * page.data：遷移ボタンから渡ってきたパラメータ
   * 遷移時処理関数：遷移時に実行される関数。多くの画面で、httpリクエストからのレスポンスを基に表示画面の編集をしています。

* * *

## httpリクエスト処理を追加する

1. `source\App\www\js\common.js`にhttpリクエスト処理を追加します。

   ```js:httpリクエスト処理例
   function sendRequest(target, pageData) {
      if (xmlhttp != null) {
         switch (target) {
            case "httpリクエスト内容":
            if (pageData.type == "value") {
               route = "テーブル名\DB処理分別";
            }
            break;
         }
      }
   );
   ```

   * target：遷移時処理から渡ってきたhttpリクエスト内容
   * pageData：遷移ボタンから渡ってきたパラメータ
   * route：WebAPIの`routes\web.php`で指定するDB処理の分別（後述）

2. WebAPI`routes\web.php`にDB処理の分別を追加します。

   ```php:DB処理の分別例
   Route::get('\テーブル名\DB処理分別', 'テーブル名Controller@DB処理分別');
   Route::post('\テーブル名\DB処理分別', 'テーブル名Controller@DB処理分別');
   ```

   * テーブル名：処理対象のテーブル名
   * DB処理分別：`common.js`のrouteで指定した名称  
     _"get"と"post"を同内容1セットで追加してください_

3. WebAPI`app\Http\Controllers\テーブル名Controller.php`にDB処理を追加します。

   ```php:DB処理例
   class テーブル名Controller extends Controller
   {
      public function DB処理分別()
         （追加する処理）
      }
   }
   ```

   * テーブル名：処理対象のテーブル名
   * DB処理分別：`web.php`で指定した名称  
     _処理は`Eloquent ORM`でコード記述します。_

* * *

## 商品、商品カテゴリーを変更する

1. 後述の「**テーブルデータの変更**」を参照して、IDEAテーブルまたはJICFS_IDEAテーブルを変更してください。

2. `source\App\www\json\category.json`を変更します。  
   _表示するカテゴリーや、カテゴリーに属する商品の管理を行っています。_
   各ハッシュキーの用途は**Application\\sourceUsage.pdf**を参照してください。

3. 特定のカテゴリーや商品に対して特別な表示処理を追加する場合は、以下の描画用スクリプトを変更してください。
   * `source\App\www\js\drawCategory.js`：カテゴリー画面
   * `source\App\www\js\drawProduct_list.js`：商品一覧画面
   * `source\App\www\js\drawProduct.js`：商品画面

* * *

## 補正後の環境/社会/健康/総合評価の計算式を変更する

* IDEA
  1. WebAPIの`app\Http\Controllers\IDEA_addController.php`の`showProduct()`において補正後スコアの計算をしているので、計算方法を修正してください。
* JICFS_IDEA
  1. **Database\\SQL\\UPDATE_DATA\\JICFS_IDEA_add.txt**を参考にSQLを作成し、JICFS_IDEA_addテーブルを更新してください。
  2. WebAPIの`app\Http\Controllers\JICFS_IDEA_addController.php`の`editScore()`においても補正後スコアの計算をしているので、こちらも同様の計算方法に修正してください。

* * *

## アンケート内容を変更する

1. 後述の「**テーブルデータの変更**」を参照して、IDEA_questionnaireテーブルまたはJICFS_IDEA_questionnaireテーブルを変更してください。

2. `source\App\www\json\QA.json`を変更します。  
   _表示するアンケートや回答の管理を行っています。_
   各ハッシュキーの用途は**nance\\sourceUsage.pdf**を参照してください。

3. `source\App\www\js\drawStatistics.js`を変更します。  
   _回答結果のグラフの描画を行っています。_

* * *

## テーブルデータの変更

テーブルデータはさくらインターネットのデータベースの管理画面から、SQL、またはcsvファイルからのインポートにて変更してください。
各テーブル項目の定義、用途、影響範囲/修正方法を**Database\\DatabaseItem.pdf**に記載しています。  
【注意事項】

* IDEAテーブル
  * 変更によって`Product_IDが変わる`場合は、IDEA_questionnaireテーブルも同値を持つようにデータを変更してください。
* JICFS_IDEAテーブル
  * 変更によって`Product_ID/JICFS分類/JANコードが変わる`場合は、JICFS_IDEA_questionnaireテーブルとJICFS_IDEA_addテーブルも同値を持つようにデータを変更してください。
  * 変更によって`環境評価/社会評価/健康評価が変わる`場合は、JICFS_IDEA_addテーブルの補正後スコアを再計算してください。**Database\\SQL\\UPDATE_DATA\\JICFS_IDEA_add.txt**のSQLで再計算できます。
* JICFS_IDEA_questionnaireテーブル
  * 回答項目の増減により`JICFS_IDEA_addテーブルの補正後スコアの計算方法を変える`場合は、「**補正後の環境/社会/健康/総合評価の計算式を変更する**」を参考にJICFS_IDEA_addテーブルとWebAPIを修正してください。

* * *

## 保存ファイルを変更する

ファイル保存機能を以下の用途で使用しています。

* counter.json：起動回数、ダイアログ表示回数のカウント
* settings.json：言語設定、重要度設定
* history.txt：商品表示履歴

1. `source\App\www\js\setting.js`の`saveSettings()`、`loadSettings()`を変更して保存ファイルを変更します。

2. 保存/読み込みデータの内容については既存のソースを参考にして編集してください。

* * *
