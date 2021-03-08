/* 商品カテゴリー画面の描画 */

// ページ描画処理
// pageData:画面遷移時パラメータ
//// pageData.type:画面タイプ（IDEA_1~2/JICFS1~3）
//// pageData.code:選択されたカテゴリー
function drawCategory(pageData) {
	$.getJSON("json/category.json", function (json) {
		/************************** 初期処理 **************************/
		// pageDataを展開
		var type = pageData.type; //IDEA_1,IDEA_2,JICFS_1,JICFS_2,JICFS_3
		var code = ""; //1ページ目：undefined、2ページ目：2桁、3ページ目：4桁、スキャン・検索によるページ挿入：6桁
		if (pageData.code !== undefined) {
			code = pageData.code;
		}

		// 変数定義 画面タイトル
		var title1jp = "";
		var title2jp = "";
		var title1en = "";
		var title2en = "";

		// 変数定義 json
		var jsonData = null;

		/************************** html描画 **************************/
		// 画面指定、json読み込み
		switch (type) {
			case "IDEA_1": // 商品カテゴリー一覧①（生鮮食品、お惣菜）
				title1jp = "商品カテゴリー一覧①";
				title2jp = "（生鮮食品、お惣菜）";
				title1en = "Product Categories①";
				title2en = "(Perishable foods, Deli)";
				jsonData = json.IDEA_category1;
				break;

			case "IDEA_2": // 商品カテゴリー一覧②（生鮮食品、お惣菜）
				title1jp = "商品カテゴリー一覧②";
				title2jp = "（生鮮食品、お惣菜）";
				title1en = "Product Categories②";
				title2en = "(Perishable foods, Deli)";
				jsonData = json.IDEA_category2[code.slice(0, 2)];
				break;

			case "JICFS_1": // 商品カテゴリー一覧①（JICFS_IDEA）
				title1jp = "商品カテゴリー一覧①";
				title2jp = "（JICFS_IDEA）";
				title1en = "Product Categories①";
				title2en = "(JICFS_IDEA)";
				jsonData = json.JICFS_category1;
				break;

			case "JICFS_2": // 商品カテゴリー一覧②（JICFS_IDEA）
				title1jp = "商品カテゴリー一覧②";
				title2jp = "（JICFS_IDEA）";
				title1en = "Product Categories②";
				title2en = "(JICFS_IDEA)";
				jsonData = json.JICFS_category2[code.slice(0, 2)];
				break;

			case "JICFS_3": // 商品カテゴリー一覧③（JICFS_IDEA）
				title1jp = "商品カテゴリー一覧③";
				title2jp = "（JICFS_IDEA）";
				title1en = "Product Categories③";
				title2en = "(JICFS_IDEA)";
				jsonData = json.JICFS_category3[code.slice(0, 4)];
				break;

			default:
				break;
		}

		// jsonデータを重要度設定に従いソート ※JICFS商品カテゴリー一覧②③のみ
		switch (type) {
			case "JICFS_2": // 商品カテゴリー一覧②（JICFS_IDEA）
			case "JICFS_3": // 商品カテゴリー一覧③（JICFS_IDEA）
				// 並べ替え用の配列に格納
				var i = 0;
				var sort = [];
				var arrSome = [];
				var arrOthers = [];
				var n = jsonData.length;

				if (window.settings.language == "jp") {
					for (i = 0; i < n; i++) {
						sort[i] = [jsonData[i].namejpKana, jsonData[i]];
					}
				} else {
					for (i = 0; i < n; i++) {
						sort[i] = [jsonData[i].nameen, jsonData[i]];
					}
				}

				// 並べ替え
				sort.sort();
				for (i = 0; i < n; i++) {
					sort[i] = sort[i][1];
				}

				//"Other"系は末尾に挿入
				for (i = 0; i < n; i++) {
					if (sort[i].nameen.startsWith("Other")) {
						arrOthers.push(sort[i]);
					} else {
						arrSome.push(sort[i]);
					}
				}
				jsonData = arrSome.concat(arrOthers);

				break;

			default:
				break;
		}

		// 画面タイトル
		$(".category-title1jp").last().text(title1jp);
		$(".category-title2jp").last().text(title2jp);
		$(".category-title1en").last().text(title1en);
		$(".category-title2en").last().text(title2en);

		// ボタン挿入位置指定
		// category.htmlの"category-button-list"classの位置を検出する
		var target = "";
		target = document.getElementsByClassName("category-button-list");
		target = target[target.length - 1];

		// 挿入ボタン編集
		var insert = "";
		for (var i in jsonData) {
			if (i == 0 || i % 2 == 0) {
				// 奇数番目（左列）の処理
				insert += "<div class='category-button-list-child'>";
			}

			// ボタンタグ属性設定開始
			insert += "<ons-button ";

			// 遷移先画面
			switch (type) {
				case "IDEA_1": // 商品カテゴリー一覧①（生鮮食品、お惣菜）
					insert +=
						"onclick=\"navi.pushPage('category.html',{animation:'slide'," +
						" data:{type:'IDEA_2'," + // 商品カテゴリー一覧②（生鮮食品、お惣菜）
						"code: '" +
						jsonData[i].code +
						"'}})\"" + // Product_ID上2桁
						' class="button" ';
					break;

				case "IDEA_2": // 商品カテゴリー一覧②（生鮮食品、お惣菜）
					insert +=
						"onclick=\"navi.pushPage('product_list.html',{animation:'slide'," +
						" data:{type:'IDEA'," + // 商品一覧（生鮮食品、お惣菜）
						" namejp: '" +
						jsonData[i].namejp +
						"'," + // 漢字分類名
						" nameen: '" +
						jsonData[i].nameen +
						"'}})\"" + // 漢字分類名（英語（次画面のタイトル用））
						' class="button" ';
					break;

				case "JICFS_1": // 商品カテゴリー一覧①（JICFS_IDEA）
					insert +=
						"onclick=\"navi.pushPage('category.html',{animation:'slide'," +
						" data:{type:'JICFS_2'," + // 商品カテゴリー一覧②（JICFS_IDEA）
						"code: '" +
						jsonData[i].code +
						"'}})\"" + // JICFS商品分類(中分類)
						' class="button" ';
					break;

				case "JICFS_2": // 商品カテゴリー一覧②（JICFS_IDEA）
					switch (code.slice(0, 2)) {
						case "99":
							// 特定のカテゴリーは商品一覧ページへ遷移する
							insert +=
								"onclick=\"navi.pushPage('product_list.html',{animation:'slide'," +
								" data:{type:'JICFS_pages'," + // 商品一覧（JICFS_IDEA）
								" code: '" +
								jsonData[i].code +
								"'," + // JICFS分類 
								" namejp: '" +
								jsonData[i].namejp +
								"'," + // 漢字名
								" nameen: '" +
								jsonData[i].nameen +
								"'}})\"" + // 英語名（次画面のタイトル用）
								' class="button" ';
							break;

						default:
							insert +=
								"onclick=\"navi.pushPage('category.html',{animation:'slide'," +
								" data:{type:'JICFS_3'," + // 商品カテゴリー一覧③（JICFS_IDEA）
								"code: '" +
								jsonData[i].code +
								"'}})\"" + // JICFS商品分類(小分類)
								' class="button" ';
							break;
					}
					break;

				case "JICFS_3": // 商品カテゴリー一覧②（JICFS_IDEA）
					insert +=
						"onclick=\"navi.pushPage('product_list.html',{animation:'slide'," +
						" data:{type:'JICFS_pages'," + // 商品一覧ページ画面（JICFS_IDEA）
						" code: '" +
						jsonData[i].code +
						"'," + // JICFS分類 
						" namejp: '" +
						jsonData[i].namejp +
						"'," + // 漢字名
						" nameen: '" +
						jsonData[i].nameen +
						"'}})\"" + // 英語名（次画面のタイトル用）
						' class="button category_smallButton" ';
					break;

				default:
					break;
			}

			// ボタンタグ属性設定終了
			insert += " >";

			// カテゴリーアイコン
			if (type != "JICFS_3") {
				insert += '<img class="category-icon" src="' + jsonData[i].img + '">';
			}

			// カテゴリー名
			insert += '<span class="category-text">';
			insert += '<div  class="font-middle">';
			insert +=
				'<span class="jp">' +
				jsonData[i].namejp +
				'</span><span class="en">' +
				jsonData[i].nameen +
				"</span>";
			insert += "</div>";
			insert += '<div  class="font-small">';

			switch (type) {
				case "IDEA_1": // 商品カテゴリー一覧①（生鮮食品、お惣菜）
					insert += "<span>" + jsonData[i].cnt + " " + "</span>";
					insert +=
						'<span class="jp">カテゴリー</span><span class="en">Categories</span>';
					break;
				case "IDEA_2": // 商品カテゴリー一覧②（生鮮食品、お惣菜）
					insert += "<span>" + jsonData[i].cnt + " " + "</span>";
					insert +=
						'<span class="jp">商品</span><span class="en">Products</span>';
					break;
				default:
					// JICFS版ではカテゴリー／商品数は表示しない
					break;
			}

			insert += "</div>";
			insert += "</span>";

			insert += "</ons-button>";

			// ボタンを1行ずつ出力
			if (i % 2 != 0 || i == jsonData.length - 1) {
				insert += "</div>";
				target.insertAdjacentHTML("beforeend", insert);
				insert = "";
			}
		}

		// 文字サイズ調整
		if (window.settings.language != "jp") {
			$(".category_smallButton .en").each(function () {
				if ($(this).text().length > 40) {
					$(this)
						.parent(".font-middle")
						.attr(
							"style",
							"font-size:" +
								parseInt(
									parseFloat($(this).parent(".font-middle").css("font-size")) -
										4
								).toFixed(1) +
								"px; line-height:2vh;"
						);
				}
			});
		}

		// 言語切り替え ※描画が多いためこのタイミングで実行しないと正しく切り替えできない
		changeLanguage();

		// 「ホームに戻る」ダイアログ表示
		switch (type) {
			case "IDEA_1":
			case "JICFS_1":
				showToHome();
				break;
			default:
				break;
		}

		// スキャン・検索後ページ挿入の場合は、次の画面をinsertする
		// カテゴリー①→②→③→商品一覧or商品一覧（ページ表示）
		if (pageData.afterScanFlg !== undefined) {
			if (pageData.afterScanFlg) {
				var insType = "";
				switch (type) {
					case "JICFS_1":
						insType = "JICFS_2";
						break;
					case "JICFS_2":
						if (code.slice(0, 2) == "99") { //特定のカテゴリーは商品一覧画面へ
							insType = "JICFS_pages";
						} else {
							insType = "JICFS_3";
						}
						break;
					case "JICFS_3":
						insType = "JICFS_pages";
						break;
				}
				insertAfterScan(insType, code, pageData.namejp, pageData.nameen);
			}
		}
	});
}
