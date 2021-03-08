/* JANコード検索 */

// JANコード検索処理
function JANCodeSearch() {
	// 入力されたJANコードを取得
	var targetJAN = $("#targetJAN").val();

	// 検索処理
	var response = "";
	// targetJAN = "9999999999999"; // デバッグ用コード指定
	response = sendRequest("product", { type: "SCAN", code: targetJAN }); //SCANと同様の処理なのでtypeを流用する

	// エラー時処理
	if (response == "error") {
		// ネットワークエラー
		window.networkErr = false;
		if (window.settings.language == "jp") {
			navigator.notification.alert(
				"エラーが発生しました。\n" + "しばらくしてから再度実行してください。",
				() => {},
				""
			);
		} else {
			navigator.notification.alert(
				"An error occurred.\n" + "Please try again later.",
				() => {},
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
				break;
			default:
				// 成功時処理（商品ページへ遷移）
				navi.pushPage("product.html", {
					animation: "slide",
					data: { type: "SCAN", code: targetJAN, res: response },
				});
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
	}
}
