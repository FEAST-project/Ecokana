# エコかなアプリ

エコかなは、買い物の際に、商品の環境負荷などについて情報を得ることができるアプリです。  
バーコード読み取り画面でバーコードを読み取ると、その商品が環境、社会、健康に与える影響・負荷の5段階評価とイラスト、商品パッケージ記載情報に関するアンケートが表示されます。  
人間文化研究機構総合地球環境学研究所のプロジェクト（FEASTプロジェクト No. 14200116）の一環として2020年に作成されました。
2021年3月のプロジェクト終了に際し、市場の透明化に向けた取り組みに広くご活用いただけるよう、オープンソース化しています。  

【参考】2021年3月時点で公開中のエコかなアプリ  
[iOS版](https://apps.apple.com/us/app/エコかな/id1501307783?l=ja&ls=1)  
[Android版](https://play.google.com/store/apps/details?id=jp.co.ts_system.EcoKana)

当リポジトリで公開する商品データは全てサンプルデータです。
* * *

## 開発環境構築

以下の順番で構築してください。手順は各フォルダ内のREADME.mdを参照してください。  

1. Database
2. WebAPI
3. DevelopEnv
4. Application

* * *

## アプリのメンテナンス

以下のフォルダ内のREADME.mdを参照してください。

1. Maintenance

* * *

## 開発条件

* 開発環境（iOS）
  * Homebrew
  * node.js
  * npm
  * Cordova
  * Xcode

* 開発環境（Android）
  * node.js
  * npm
  * Cordova
  * Visual Studio Code
  * Java SE Development Kit 8
  * Android SDK
  * Gradle

* Cordova プラグイン
  * cordova-plugin-camera 2.3.1 "Camera"
  * cordova-plugin-compat 1.2.0 "Compat"
  * cordova-plugin-dialogs 2.0.2 "Notification"
  * cordova-plugin-disable-ios-statusbar 1.0.0 "cordova-plugin-disable-ios11-statusbar"
  * cordova-plugin-file 6.0.2 "File"
  * cordova-plugin-qr-barcode-scanner 8.0.3 "BarcodeScanner"
  * cordova-plugin-splashscreen 5.0.3 "Splashscreen"
  * cordova-plugin-statusbar 2.4.3 "StatusBar"
  * cordova-plugin-whitelist 1.3.4 "Whitelist"
  * cordova-plugin-wkwebviwq-engine 1.2.1 "Cordova WKWebView Engine"
  * cordova-plugin-wkwebviewxhrfix 0.1.0 "WKWebView XHR Fix"
  * cordova-plugin-inappbrowser 4.0.0 "InAppBrowser"

* Web用ライブラリ、コンポーネント
  * jQuery
  * OnsenUI
  * jqplot

* Webフレームワーク
  * Laravel 6.\*

* データベース
  * MySQL
