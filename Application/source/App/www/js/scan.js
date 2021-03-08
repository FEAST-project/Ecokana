/* バーコードスキャン */

// バーコードスキャン処理
function scanBarcode() {
	// スキャンプラグインに表示する文言（Android版のみ）
	var str = "";
	if (window.settings.language == "jp") {
		str = "";
	} else {
		str =
			"";
	}

	// スキャン時処理
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			if (!result.cancelled) {
				// スキャンされたJANコードを取得
				var getCode = result.text;

				// 検索処理
				var response = "";
				// getCode = "9999999999999"; // デバッグ用コード指定
				response = sendRequest("product", { type: "SCAN", code: getCode });

				// エラー時処理
				if (response == "error") {
					// ネットワークエラー
					window.networkErr = false;
					if (window.settings.language == "jp") {
						navigator.notification.alert(
							"エラーが発生しました。\n" +
								"しばらくしてから再度実行してください。",
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
				} else if (response.length > 0) {
					// セット商品検索時エラー
					switch (response[0]["JICFS分類"]) {
						case "999998":
						case "999999":
							if (window.settings.language == "jp") {
								navigator.notification.alert(
									"この商品はセット商品のようです。\n" +
										"生鮮食品、お惣菜もしくは商品一覧のページから、商品を個別に検索してください。",
									null,
									""
								);
							} else {
								navigator.notification.alert(
									"This is a set product.\n" +
										"Please select the individual items of the set (separately) in the Perishable Foods, Deli or Database pages.",
									null,
									""
								);
							}

							navi.popPage({ animation: "slide" });
							break;
						default:
							// 成功時処理（商品ページへ遷移）
							navi.pushPage("product.html", {
								animation: "slide",
								data: { type: "SCAN", code: getCode, res: response },
							});
							// スキャン成功時にnavigatorを削除する
							var cnt = navi.pages.length;
							for (i = 1; i < cnt - 1; i++) {
								navi.removePage(1);
							}
					}
				} else {
					// 該当商品なしエラー
					if (window.settings.language == "jp") {
						navigator.notification.alert(
							"この商品はお店独自のバーコードで管理されているようです。\n" +
								"生鮮食品、お惣菜もしくは商品一覧のページから該当する食品を検索してください。",
							null,
							""
						);
					} else {
						navigator.notification.alert(
							"This product is managed with the shop’s own barcode.\n" +
								"Please select the corresponding product in the Perishables, Deli or Database pages.",
							null,
							""
						);
					}

					navi.popPage({ animation: "slide" });
				}
			} else {
				// キャンセルボタン押下時
				navi.popPage({ animation: "slide" });
			}
		},
		// スキャン失敗時（プラグインによる失敗）
		function (error) {
			navigator.notification.alert("Scanning failed: " + error, null, "");
			z;
			//alert("Scanning failed: " + error);
		},
		// プラグイン設定
		{
			preferFrontCamera: false, // フロントカメラ優先 iOS and Android
			showFlipCameraButton: false, // フロントカメラ切り替えボタン表示 iOS and Android
			showTorchButton: true, // 発光ボタン表示 iOS and Android
			torchOn: false, // 強制発光 Android, launch with the torch switched on (if available)
			saveHistory: false, // スキャンデータ自動保存 Android, save scan history (default false)
			prompt: str, // 注意文言表示 Android
			resultDisplayDuration: 500, // スキャン後処理開始までのディレイ Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
			formats: "EAN_8,EAN_13", // スキャン対象フォーマット default: all but PDF_417 and RSS_EXPANDED
			orientation: "portrait", // 縦画面表示 Android only (portrait|landscape), default unset so it rotates with the device
			disableAnimations: true, // アニメーション拒否 iOS
			disableSuccessBeep: true, // スキャン時ビープ音拒否 iOS and Android
		}
	);
}
