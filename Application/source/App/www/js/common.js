/* 共通処理スクリプト */
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/****************************** 初期処理 ******************************/
// 起動時処理＿フラグ定義
$(window).load(function () {
	//ネットワークエラーフラグ
	window.networkErr = false;
});

// 起動時処理＿設定ファイル読み込み
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	loadSettings("settings.json"); // 言語・重要度設定ファイル
	loadSettings("counter.json"); // 起動回数管理ファイル
}

// 起動時処理＿onsenUI設定
ons.ready(function () {
	// ホーム画面上で戻るボタンを押すと終了確認（Android版のみ影響）
	ons.setDefaultDeviceBackButtonListener(function (event) {
		navigator.app.exitApp();
	});
}),
	/****************************** 画面遷移 ******************************/
	// 画面移動前処理
	document.addEventListener("prepush", function (event) {}, false);

// 画面移動後処理
document.addEventListener(
	"postpush",
	function (event) {
		// ネットワークエラー時処理
		if (window.networkErr) {
			window.networkErr = false;

			if (window.settings.language == "jp") {
				navigator.notification.alert(
					"エラーが発生しました。\n" + "しばらくしてから再度実行してください。",
					() => {
						navi.popPage({ animation: "slide" });
					},
					""
				);
			} else {
				navigator.notification.alert(
					"An error occurred.\n" + "Please try again later.",
					() => {
						navi.popPage({ animation: "slide" });
					},
					""
				);
			}
		}
	},
	false
);

// 画面戻り前処理
document.addEventListener(
	"prepop",
	function (event) {
		// 商品ページから戻る前に商品一覧の再描画（総合スコアの更新）
		if (event.currentPage.id == "product.html") {
			redrawProduct_list();
		}
	},
	false
);

// 画面戻り後処理
document.addEventListener(
	"postpop",
	function (event) {
		// 戻り先画面による切り分け
		var newPage = event.enterPage;
		switch (newPage.id) {
			// 設定画面2から戻る前に設定画面1の再描画（設定の反映）
			case "setting_1.html":
				drawSetting_1();
				break;

			default:
				break;
		}

		// 戻り元画面による切り分け
		var oldPage = event.leavePage;
		switch (oldPage.id) {
			// 設定画面1から"戻る"ときは以前の設定ファイルを読み込み直す
			case "setting_1.html":
				loadSettings("settings.json");
				break;
			default:
				break;
		}
	},
	false
);

// 画面遷移時イベント
document.addEventListener(
	"init",
	function (event) {
		var page = event.target;
		// page:遷移時に指定されたパラメータ
		//// page.id:遷移先画面名
		//// page.data.res:scan結果DBデータ
		//// page.data.type:画面タイプ
		//// page.data.code:遷移時に使用するコード

		var response = "";
		switch (page.id) {
			case "home.html":
				// ホーム画面
				if (page.data.type == "backToHome") {
					// 商品カテゴリー一覧、商品一覧、商品ページのhomeに戻るボタン押下処理
					// ※このタイミングで言語を再処理しないと表示が崩れる可能性あり
					changeLanguage();
				} else {
					// 起動時の初期処理
					// 重要度設定のデフォルト
					window.settings = {
						importanceEnv: "1", //1~3
						importanceSoc: "1", //1~3
						importanceHel: "1", //1~3
						language: "jp", //jp,en
					};
					// カウンタのデフォルト
					window.counter = {
						startUp: 0, // 起動回数
						toHome: 0, //「ホームに戻る」ダイアログ表示回数
						footer: 0, //「フッター説明」ダイアログ表示回数
					};
					// WebAPIのURL
					window.api_type = api_server;
					getApiURL(window.api_type);

					//「このアプリについて」ダイアログ表示
					if (cordova.platformId == "android") {
						// Androidの処理
						setTimeout(function () {
							showAbout();
						}, 200);
					} else {
						// iOSの処理
						setTimeout(function () {
							showAbout();
						}, 400);
					}

					// Androidはボタンの文字サイズを固有
					if (cordova.platformId == "android") {
						$(".home-font-small")
							.addClass("home-font-small-android")
							.removeClass("home-font-small");
					}
				}
				break;

			case "scan.html":
				// スキャン画面
				scanBarcode();
				break;

			case "category.html":
				// 商品カテゴリー一覧（IDEA/JICFS共通）
				drawCategory(page.data);
				break;

			case "product_list.html":
				// 商品一覧（IDEA/JICFS共通）
				response = sendRequest("product_list", page.data);
				drawProduct_list(response, page.data);
				break;

			case "product.html":
				// 商品（IDEA/JICFS共通）
				if (page.data.type != "SCAN") {
					// 一覧からの遷移
					response = sendRequest("product", page.data);
					drawProduct(response, page.data);
				} else {
					// スキャン、検索からの遷移
					drawProduct(page.data.res, page.data);
				}

				break;

			case "requestInfo.html":
				// リクエスト確認（IDEA/JICFS共通）
				drawRequest(page.data.type, page.data.code);
				break;

			case "requestDone.html":
				// リクエスト完了（IDEA/JICFS共通）
				response = sendRequest("requestInfo", page.data); // ※受け取るレスポンスは無い

				// 商品ページの情報リクエストグラフ、ボタンを再描画
				afterRequest();
				break;

			case "setting_1.html":
				// 設定1
				drawSetting_1();
				break;

			case "setting_2.html":
				// 設定2
				drawSetting_2(page.data.type);
				break;

			default:
				break;
		}
		// 画面遷移の都度言語切り替え
		changeLanguage();
	},
	false
);

/****************************** 設定読み込み ******************************/
// config.xmlに従ってAPIのURLを取得
// api_type: config.xml中のtargetAPIのvalue
function getApiURL(api_type) {
	$.getJSON("json/target.json", function (json) {
		// jsonを読み込み
		window.api = json[api_type].api_url;
	});
}

/****************************** ダイアログ表示 ******************************/
// 起動時に「このアプリについて」ダイアログを表示(最大1回)
function showAbout() {
	// window.counter.startUp = 0; // 強制表示テスト用ロジック
	if (window.counter.startUp < 1) {
		$(".aboutDialog-popup").css({ display: "flex" });
	}
}
// 「このアプリについて」ダイアログを非表示
function hideAbout() {
	// ×ボタン押下により非表示
	if (event.target.id == "aboutDialog-close") {
		$(".aboutDialog-popup").css({ display: "none" });
		addCount("startUp");
	}
}

// カテゴリー画面・商品一覧画面初回表示時に「ホームに戻る」ダイアログを表示(最大1回)
function showToHome() {
	// window.counter.toHome = 0; //強制表示テスト用ロジック
	if (window.counter.toHome < 1) {
		$(".toHomeDialog-toolbar").css({ display: "flex" });
		$(".toHomeDialog-popup").css({ display: "flex" });
		$(".toHomeDialog-toolbar ~ .right").css("background-color", "inherit");
		$(".toHomeDialog-toolbar ~ .right").css("z-index", "1000");
	}
}
// 「ホームに戻る」ダイアログを非表示
function hideToHome() {
	// ×ボタン押下により非表示
	if (event.target.id == "toHomeDialog-close") {
		$(".toHomeDialog-toolbar").css("display", "none");
		$(".toHomeDialog-popup").css("display", "none");
		$(".toHomeDialog-toolbar ~ .right").css("background-color", "");
		$(".toHomeDialog-toolbar ~ .right").css("z-index", "");
		addCount("toHome");
	}
}

// 商品画面初回表示時に「フッター説明」ダイアログを表示(最大1回)
function showFooter() {
	// window.counter.footer = 0; //強制表示テスト用ロジック
	if (window.counter.footer < 1) {
		$(".footerDialog-popup").css({ display: "flex" });
	}
}
// 「フッター説明」ダイアログを非表示
function hideFooter() {
	// ×ボタン押下により非表示
	if (event.target.id == "footerDialog-close") {
		$(".footerDialog-popup").css("display", "none");
		addCount("footer");
	}
}

// デバッグ用カウンターリセット ※api_targetがtestの場合に表示されるボタン処理
function resetCounter() {
	window.counter.startUp = -1;
	addCount("startUp");
	window.counter.toHome = -1;
	addCount("toHome");
	window.counter.footer = -1;
	addCount("footer");
}

/****************************** HTTPリクエスト ******************************/
// DBへのリクエストおよびリクエスト完了時の処理指定
// target:遷移先ページ名
// pageData:画面遷移時パラメータ
//// pageData.type: IDEA/JICFS/SCAN
function sendRequest(target, pageData) {
	var xmlhttp = createXmlHttpRequest(); // XMLHttpRequestオブジェクト
	var route = ""; // phpアクセスURLのroute
	var sendParam = ""; //データベース取得条件
	var sendSort = ""; //データベース取得条件(sort)

	if (xmlhttp != null) {
		// 遷移先ページ名によるrouteの選択
		switch (target) {
			// 総合スコア上位10%目を取得
			case "get10":
				switch (pageData.type) {
					case "IDEA":
						// WebAPIルーティング：IDEA商品一覧上位10%取得
						route = "IDEA/get10";

						// 取得対象のカテゴリーを指定
						// 表示上とテーブル上でカテゴリー名（漢字分類名）が異なるもの、複数カテゴリーを表示するものは調整する
						// pageData.namejp: 選択された表示上のIDEAカテゴリー
						switch (pageData.namejp) {
							case "魚類":
								sendParam = "namejp1=魚&namejp2=";
								break;
							case "貝類":
								sendParam = "namejp1=貝&namejp2=";
								break;
							case "海老・蟹類":
								sendParam = "namejp1=海老&namejp2=蟹";
								break;
							case "烏賊・蛸類":
								sendParam = "namejp1=烏賊&namejp2=蛸";
								break;
							default:
								sendParam = "namejp1=" + pageData.namejp + "&namejp2=";
								break;
						}
						break;

					case "JICFS":
					case "SCAN":
						// WebAPIルーティング：JICFS商品一覧上位10%取得
						route = "JICFS/get10";

						// 取得対象のカテゴリーを指定
						// pageData.code: 選択されたJICFSカテゴリー（JICFS分類）
						sendParam = "code=" + pageData.code;
						break;

					default:
						break;
				}

				break;

			// 商品一覧に表示する商品を取得
			case "product_list":
				// 重要度設定に従ったソート順を指定
				if (window.settings.importanceEnv == "3") {
					sendSort += " 環境評価 = 5 DESC,";
				}
				if (window.settings.importanceSoc == "3") {
					sendSort += " 社会評価 = 5 DESC,";
				}
				if (window.settings.importanceHel == "3") {
					sendSort += " 健康評価 = 5 DESC,";
				}
				if (window.settings.importanceEnv == "2") {
					sendSort += " 環境評価 >= 3 DESC,";
				}
				if (window.settings.importanceSoc == "2") {
					sendSort += " 社会評価 >= 3 DESC,";
				}
				if (window.settings.importanceHel == "2") {
					sendSort += " 健康評価 >= 3 DESC,";
				}

				if (window.settings.importanceEnv == "3") {
					sendSort += " 環境評価  DESC,";
				}
				if (window.settings.importanceSoc == "3") {
					sendSort += " 社会評価  DESC,";
				}
				if (window.settings.importanceHel == "3") {
					sendSort += " 健康評価  DESC,";
				}
				if (window.settings.importanceEnv == "2") {
					sendSort += " 環境評価  DESC,";
				}
				if (window.settings.importanceSoc == "2") {
					sendSort += " 社会評価  DESC,";
				}
				if (window.settings.importanceHel == "2") {
					sendSort += " 健康評価  DESC,";
				}
				sendSort += "総合スコア DESC, Product_ID ASC";

				// IDEA/JICFSそれぞれの補正後スコアでソートするために項目名を置換する
				switch (pageData.type) {
					case "IDEA":
						sendSort = sendSort.replace(/総合スコア/g, "補正総合スコア");
						break;

					case "JICFS":
					case "SCAN":
						sendSort = sendSort
							.replace(/環境評価/g, "補正環境評価")
							.replace(/社会評価/g, "補正社会評価")
							.replace(/健康評価/g, "補正健康評価")
							.replace(/総合スコア/g, "補正総合スコア");
						break;

					default:
						break;
				}

				switch (pageData.type) {
					case "IDEA":
						// WebAPIルーティング：IDEA商品一覧表示
						route = "IDEA/product_list";

						// 取得対象のカテゴリーを指定
						// 表示上とテーブル上でカテゴリー名（漢字分類名）が異なるもの、複数カテゴリーを表示するものは調整する
						// pageData.namejp: 選択された表示上のIDEAカテゴリー
						switch (pageData.namejp) {
							case "魚類":
								sendParam = "namejp1=魚&namejp2=";
								break;
							case "貝類":
								sendParam = "namejp1=貝&namejp2=";
								break;
							case "海老・蟹類":
								sendParam = "namejp1=海老&namejp2=蟹";
								break;
							case "烏賊・蛸類":
								sendParam = "namejp1=烏賊&namejp2=蛸";
								break;
							default:
								sendParam = "namejp1=" + pageData.namejp + "&namejp2=";
								break;
						}

						break;

					case "JICFS_pages":
						// WebAPIルーティング：JICFS商品一覧ページ表示
						route = "JICFS/product_list_pages";

						// 取得対象のカテゴリーを指定
						// pageData.code: 選択されたJICFSカテゴリー（JICFS分類）
						sendParam = "code=" + pageData.code; // JICFS分類
						break;

					default:
						// WebAPIルーティング：JICFS商品一覧表示
						route = "JICFS/product_list";

						// 取得対象のカテゴリーを指定
						// pageData.code: 選択されたJICFSカテゴリー（JICFS分類）
						// pageData.page: 選択されたページ数
						// pageData.cnt: 表示する商品数
						// ※例）page:3、cnt:250 → 500件までをスキップして、501～750件を取得）
						sendParam =
							"code=" +
							pageData.code +
							"&pageFrom=" +
							(pageData.page - 1) * pageData.cnt +
							"&cnt=" +
							pageData.cnt;
						break;
				}

				sendParam += "&sort=" + sendSort;

				break;

			// 商品情報を取得
			case "product":
				if (pageData.type == "IDEA") {
					// WebAPIルーティング：IDEA商品表示
					route = "IDEA/product";
				} else if (pageData.type == "SCAN") {
					// WebAPIルーティング：SCAN_JICFS_IDEA_add補正後Scoreによる商品表示
					route = "SCAN/product";
				} else {
					// WebAPIルーティング：JICFS_IDEA_add補正後Scoreによる商品表示
					route = "JICFS/product";
				}

				// 取得条件を指定
				// pageData.code: Product_ID/JANコード（SCAN、検索の場合）
				sendParam = "id=" + pageData.code;

				break;

			// アンケート回答加算+回答加算後データ取得
			case "product_qa":
				if (pageData.type == "IDEA") {
					// WebAPIルーティング：IDEA商品　アンケート回答
					route = "IDEA/QA";
				} else {
					// WebAPIルーティング：JICFS商品　アンケート回答
					route = "JICFS/QA";
				}

				// 加算対象の商品/アンケート番号を指定
				// pageData.code: Product_ID
				// pageData.qaNo: アンケート番号
				sendParam = "id=" + pageData.code + "&target=回答" + pageData.qaNo;

				break;

			// 情報リクエスト加算
			case "requestInfo":
				if (pageData.type == "IDEA") {
					// WebAPIルーティング：IDEA商品　情報リクエスト
					route = "IDEA/req";
				} else {
					// WebAPIルーティング：JICFS商品　情報リクエスト
					route = "JICFS/req";
				}

				// 加算対象の商品を指定
				// pageData.code: Product_ID
				sendParam = "id=" + pageData.code;

				break;

			// アンケート回答後のスコア補正 ※対象はJICFSのみ
			case "editScore":
				// WebAPIルーティング：JICFS_IDEA_addアンケート回答後更新
				route = "JICFS/editScore";

				// 補正対象の商品を指定
				// pageData.code: Product_ID
				sendParam = "id=" + pageData.code;

				break;

			// 商品閲覧回数の加算
			case "countView":
				if (pageData.type == "IDEA") {
					// WebAPIルーティング：IDEA商品　閲覧回数
					route = "IDEA/countView";
				} else {
					// WebAPIルーティング：JICFS商品　閲覧回数
					route = "JICFS/countView";
				}

				// 加算対象の商品を指定
				// pageData.code: Product_ID
				sendParam = "id=" + pageData.code;

				break;

			// 情報リクエスト比率取得
			case "getQAReq":
				if (pageData.type == "IDEA") {
					// WebAPIルーティング：IDEA商品　アンケート情報取得
					route = "IDEA/getQAReq";
				} else {
					// WebAPIルーティング：JICFS商品　アンケート情報取得
					route = "JICFS/getQAReq";
				}

				// 取得対象の商品を指定
				// pageData.code: Product_ID
				sendParam = "id=" + pageData.code;

				break;

			default:
				break;
		}

		// HTTPのPOSTメソッドとアクセスする場所を指定
		// 開発時に要変更　戻し忘れに注意
		//xmlhttp.open(
		//	"post",
		//	"https://******.sakura.ne.jp/test/public/" + route,
		//	false
		//); // テスト用ロジック
		xmlhttp.open("post", window.api + route, false);  // 本番用ロジック
		xmlhttp.setRequestHeader(
			"Content-Type",
			"application/x-www-form-urlencoded"
		);

		// HTTPリクエスト実行
		xmlhttp.send(sendParam);

		// レスポンス取得
		var res = "";
		if (xmlhttp.responseText != "") {
			try {
				res = JSON.parse(xmlhttp.responseText);
			} catch (e) {
				// レスポンス取得エラー時
				res = "error";
				window.networkErr = true;
				return res;
			}
		}
		return res;
	}
}

// XMLHttpRequest オブジェクト生成
function createXmlHttpRequest() {
	var xmlhttp = null;
	9;
	if (window.ActiveXObject) {
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e2) {}
		}
	} else if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

/****************************** ページ生成 ******************************/
// スキャン、検索時　戻り先の商品カテゴリー、商品一覧ページの挿入
// pageType: 挿入するページ種類
// JICFSCode: JICFS分類
// namejp: カテゴリー名
// nameen: カテゴリー名（英語）
function insertAfterScan(pageType, JICFSCode, namejp, nameen) {
	// 挿入するhtmlを指定
	var insertHtml = "";
	var afterScanFlg = true;
	switch (pageType) {
		case "JICFS_1":
		case "JICFS_2":
		case "JICFS_3":
			insertHtml = "category.html";
			break;
		case "JICFS_pages":
		case "JICFS":
			insertHtml = "product_list.html";
			break;
		default:
			break;
	}

	// 挿入処理
	navi.insertPage(
		navi.pages.length - 1,
		insertHtml, // html
		{
			animation: "slide",
			data: {
				type: pageType,
				code: JICFSCode,
				page: "1",
				cnt: "300",
				namejp: namejp,
				nameen: nameen,
				afterScanFlg: afterScanFlg, //スキャン、検索によるinsertPageにはフラグを付与する
			},
		}
	);
}

/****************************** ブラウザ起動 ******************************/
// ブラウザ起動 ※onsenUIボタンによるブラウザ起動は当functionが必須
// URL:アクセス先URL
function URLClick(URL) {
	window.open = cordova.InAppBrowser.open;
	window.open(URL, "_system", "location=yes");
}
