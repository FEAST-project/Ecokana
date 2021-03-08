/* 商品一覧（ページ表示）、商品一覧画面の描画 */

// ページ描画処理
// res:テーブルから取得したデータ
// pageData:画面遷移時パラメータ
//// pageData.type:画面タイプ（IDEA/JICFS）
//// pageData.namejp:漢字分類名
//// pageData.nameen:漢字分類名（英語）
//// pageData.code:選択されたカテゴリー
//// pageData.sortby:セレクトボックスによるソート設定
function drawProduct_list(res, pageData) {
	/************************** 初期処理 **************************/
	var type = pageData.type; // IDEA/JICFS
	var namejp = pageData.namejp; // 漢字分類名
	var nameen = pageData.nameen; // 漢字分類名（英語）
	var code = ""; // code(JICFS専用)
	if (type != "IDEA") {
		code = pageData.code;
	}

	var productionSite = [
		// 野菜・産地のセレクトボックス作成用①
		"北海道",
		"青森",
		"岩手",
		"宮城",
		"秋田",
		"山形",
		"福島",
		"茨城",
		"栃木",
		"群馬",
		"埼玉",
		"千葉",
		"東京",
		"神奈川",
		"新潟",
		"富山",
		"石川",
		"福井",
		"山梨",
		"長野",
		"岐阜",
		"静岡",
		"愛知",
		"三重",
		"滋賀",
		"京都",
		"大阪",
		"兵庫",
		"奈良",
		"和歌山",
		"鳥取",
		"島根",
		"岡山",
		"広島",
		"山口",
		"徳島",
		"香川",
		"愛媛",
		"高知",
		"福岡",
		"佐賀",
		"長崎",
		"熊本",
		"大分",
		"宮崎",
		"鹿児島",
		"沖縄",
	];
	var dispProductionSite = []; // 野菜・産地、水揚げ地のセレクトボックス作成用②
	var dispProductionMethod = []; // 漁法のセレクトボックス作成用②

	// 変数定義 画面のタイトル
	var title1jp = "";
	var title2jp = "";
	var title1en = "";
	var title2en = "";

	// 変数定義 総合スコア上位10%目のスコア
	var data = {};
	var res_get10 = "";
	var score_10 = 0;

	/************************** html描画 **************************/
	// hidden項目とツールバー（タイトル）の編集 ※ソート変更時は行わない
	if (pageData.sortBy === undefined) {
		// 総合スコア上位10%目のスコアを取得
		switch (type) {
			case "IDEA":
			case "JICFS":
				data = { type: type, code: code, namejp: namejp, nameen: nameen };
				res_get10 = sendRequest("get10", data);
				score_10 = (
					Math.round(res_get10[0]["補正総合スコア"] * 10) / 10
				).toFixed(1);
				break;
			default:
				break;
		}

		// スコア順のテーブル取得データと総合スコア上位10%を保持
		$(".product_list-tempRes").last().val(JSON.stringify(res));
		$(".product_list-tempScore10").last().val(score_10);

		// 画面指定
		switch (type) {
			case "IDEA":
				title1jp = "商品一覧（生鮮食品、お惣菜）";
				title2jp = namejp;
				title1en = "Product List (Perishable foods, Deli)";
				title2en = nameen;
				break;
			case "JICFS":
			case "JICFS_pages":
				title1jp = "商品一覧（JICFS_IDEA）";
				title2jp = namejp;
				title1en = "Product List (JICFS_IDEA)";
				title2en = nameen;
				break;
			default:
				break;
		}

		// 画面タイトル
		$(".product_list-title1jp").last().text(title1jp);
		$(".product_list-title2jp").last().text(title2jp);
		$(".product_list-title1en").last().text(title1en);
		$(".product_list-title2en").last().text(title2en);

		// 画面タイトル＿文字サイズ調整
		if (window.settings.language != "jp") {
			if (title2en.length > 25) {
				$(".product_list-title2en")
					.last()
					.parent(".font-middle")
					.attr(
						"style",
						"font-size:" +
							parseInt(
								parseFloat(
									$(".product_list-title2en")
										.last()
										.parent(".font-middle")
										.css("font-size")
								) - 4.5
							).toFixed(1) +
							"px; line-height:2vh;"
					);
			}
		}

		// 画面タイトル＿表示中カテゴリー情報
		switch (type) {
			case "IDEA":
				$(".product_list-title3jp")
					.last()
					.text(res.length + " 商品");
				$(".product_list-title3en")
					.last()
					.text(res.length + " products");
				break;
			case "JICFS":
				$(".product_list-title3jp")
					.last()
					.text($(".product_list-title3jp").first().text());
				$(".product_list-title3en")
					.last()
					.text($(".product_list-title3en").first().text());
				break;
			case "JICFS_pages":
				$(".product_list-title3jp")
					.last()
					.text(res + " 商品");
				$(".product_list-title3en")
					.last()
					.text(res + " products");
				break;
			default:
				break;
		}

		// カテゴリーアイコン
		$.getJSON("json/category.json", function (json) {
			switch (type) {
				case "IDEA":
					var jsonData = json.IDEA_category2;
					labelA: for (var i in jsonData) {
						for (var j in jsonData[i]) {
							if (jsonData[i][j].code == namejp) {
								$(".product_list-toolbar .right")
									.last()
									.append(
										'<img class="category-icon" src="' +
											jsonData[i][j].img +
											'">'
									);
								break labelA;
							}
						}
					}
					break;
				case "JICFS":
				case "JICFS_pages":
					var jsonData = json.JICFS_category2;
					labelB: for (var i in jsonData) {
						for (var j in jsonData[i]) {
							if (
								jsonData[i][j].code == code.substr(0, 4) ||
								jsonData[i][j].code == code
							) {
								$(".product_list-toolbar .right")
									.last()
									.append(
										'<img class="category-icon" src="' +
											jsonData[i][j].img +
											'">'
									);
								break labelB;
							}
						}
					}
					break;
				default:
					break;
			}
		});
	}

	// ボタン挿入位置指定
	// product_list.htmlの"product_list-placeholder"classの位置を検出する
	var target = "";
	switch (type) {
		case "IDEA":
		case "JICFS":
			$(".product_list-placeholder")
				.removeClass("product_list-placeholder")
				.addClass("product_list-button-list");
			target = document.getElementsByClassName("product_list-button-list");
			target = target[target.length - 1];
			break;

		case "JICFS_pages":
			$(".product_list-placeholder")
				.removeClass("product_list-placeholder")
				.addClass("category-button-list");
			target = document.getElementsByClassName("category-button-list");
			target = target[target.length - 1];
			break;
		default:
			break;
	}

	// 挿入ボタン編集
	var insert = "";
	switch (type) {
		case "IDEA":
		case "JICFS":
			//JICFS_pages以外は通常表示
			for (var i in res) {
				// ボタン編集内容の初期化
				insert = "";

				// ボタンタグ属性設定開始
				insert += '<ons-button class="button"';

				// 遷移先画面
				switch (type) {
					case "IDEA":
						// 商品ページ（生鮮食品、お惣菜）
						insert +=
							"onclick=\"navi.pushPage('product.html',{animation:'slide'," +
							" data:{type:'IDEA'," + // 遷移先のカテゴリー
							"code: '" +
							res[i]["Product_ID"] +
							"'}})\""; // 遷移先のコード
						break;

					case "JICFS":
						// 商品ページ（JICFS_IDEA）
						insert +=
							"onclick=\"navi.pushPage('product.html',{animation:'slide'," +
							" data:{type:'JICFS'," + // 遷移先のカテゴリー
							"code: '" +
							res[i]["Product_ID"] +
							"'}})\""; // 遷移先のコード
						break;

					default:
						break;
				}

				// 総合スコア計算
				var score = 0;
				score = Math.round(res[i]["補正総合スコア"] * 10) / 10;

				// Product_ID属性を付与
				insert += 'id="' + res[i]["Product_ID"] + '" ';

				// 総合スコア属性を付与
				insert += 'score="' + score.toFixed(1) + '" ';

				// 絞り込み条件属性を付与
				switch (namejp) {
					case "牛":
					case "豚":
					case "鶏":
						insert += 'target="' + res[i]["肉・国産/輸入の別"] + '" ';
						break;
					case "野菜類":
					case "果物類":
						insert += 'target1="' + res[i]["野菜・産地"] + '" ';
						dispProductionSite.push(res[i]["野菜・産地"]); //表示する野菜・果物の産地を保持
						insert += 'target2="' + res[i]["野菜・季節"] + '" ';
						break;
					case "魚類":
					case "貝類":
					case "海老・蟹類":
					case "烏賊・蛸類":
						insert += 'target1="' + res[i]["魚・水揚げ地"] + '" ';
						dispProductionSite.push(res[i]["魚・水揚げ地"]); //表示する魚・水揚げ地を保持
						insert += 'target2="' + res[i]["魚・生産方法"] + '" ';
						dispProductionMethod.push(res[i]["魚・生産方法"]); //表示する魚・生産方法を保持
						break;
					default:
						break;
				}

				// ボタンタグ属性設定終了
				insert += " >";

				// 商品名
				insert += '<span class="font-middle"';

				// 上位10%アイコン表示の場合は商品名幅をアイコン分狭くする
				score_10 = $(".product_list-tempScore10").last().val();
				if (score_10 > 0 && score.toFixed(1) >= score_10) {
					insert += ' style="width:62vw !important"';
				}
				insert += ">";

				switch (type) {
					case "IDEA":
						insert += "<span>" + res[i]["製品名"] + "</span>";
						break;
					case "JICFS":
					case "JICFS_pages":
						insert += "<span>" + res[i]["伝票用商品名称(漢字)"] + "</span>";
						break;
					default:
						break;
				}

				insert += "</span>";

				insert += "<br>";

				// 追加情報編集
				switch (type) {
					case "IDEA":
						if (
							(res[i]["野菜・産地"] != "" &&
								res[i]["野菜・産地"] != "その他（平均）") ||
							res[i]["野菜・季節"] != "" ||
							(res[i]["魚・水揚げ地"] != "" &&
								res[i]["魚・水揚げ地"] != "平均（統計値）") ||
							(res[i]["魚・生産方法"] != "" &&
								res[i]["魚・生産方法"] != "漁業全般")
						) {
							insert += '<span class="font-small">';
							insert += "<span>";
							if (
								res[i]["野菜・産地"] != "" &&
								res[i]["野菜・産地"] != "その他（平均）"
							) {
								insert += "   " + res[i]["野菜・産地"];
							}
							if (res[i]["野菜・季節"] != "") {
								insert += "   " + res[i]["野菜・季節"];
							}
							if (
								res[i]["魚・水揚げ地"] != "" &&
								res[i]["魚・水揚げ地"] != "平均（統計値）"
							) {
								insert += "   " + res[i]["魚・水揚げ地"];
							}
							if (
								res[i]["魚・生産方法"] != "" &&
								res[i]["魚・生産方法"] != "漁業全般"
							) {
								insert += "   " + res[i]["魚・生産方法"];
							}
							insert += "</span>";
							insert += "</span>";
						}

						break;
					default:
						break;
				}

				// 上位10%アイコン
				if (score_10 > 0 && score.toFixed(1) >= score_10) {
					insert += '<img src="img/common/list_10.png">';
				}
				insert += '<span class="font-score"';
				if (score.toFixed(1) >= 2.4) {
					insert += ' style="background-color:#D9A0BB"';
				} else if (score.toFixed(1) >= 1.5) {
					insert += ' style="background-color:#EBC339"';
				} else {
					insert += ' style="background-color:#D5CECB"';
				}
				insert += ">" + score.toFixed(1) + "</span>";

				// 右矢印アイコン用領域を確保
				insert += '<span class="product_list-fa-icon"></span>';

				insert += "</ons-button>";

				// ボタンを出力
				target.insertAdjacentHTML("beforeend", insert);

				// 右矢印アイコン出力 ※このタイミングで出力しないと表示が崩れる
				$(".product_list-fa-icon")
					.last()
					.append('<ons-icon icon="angle-right">');
			}

			// セレクトボックス編集
			var insertSlc1 = "";

			// ソート変更後にはセレクトボックスの編集を行わない
			if (pageData.sortBy === undefined) {
				if (type == "IDEA") {
					// 名前順-スコア順切り替え
					insertSlc1 += '<table class="product_list-sel_table">';

					insertSlc1 += "<tr><td>";
					insertSlc1 += '<span class="jp">表示順</span>';
					insertSlc1 += '<span class="en">Sort by</span>';
					insertSlc1 += "</td><td>";
					insertSlc1 +=
						'<ons-select id="product_list-sel0" modifier="material"' +
						"onchange=\"product_listChangeSort(event,'" +
						type +
						"','" +
						namejp +
						"','" +
						nameen +
						"')\">";

					if (window.settings.language == "jp") {
						insertSlc1 += '<option value="score">スコア</option>';
						insertSlc1 += '<option value="name">商品名</option>';
					} else {
						insertSlc1 += '<option value="score">Score</option>';
						insertSlc1 += '<option value="name">Product Name</option>';
					}
					insertSlc1 += "</ons-select>";
					insertSlc1 += "</td></tr>";

					// カテゴリー別絞り込み
					switch (namejp) {
						case "牛":
						case "豚":
						case "鶏":
							//すべて／国産／輸入
							insertSlc1 += "<tr><td>";
							insertSlc1 += '<span class="jp">国産/輸入</span>';
							insertSlc1 += '<span class="en">Domestic/Import</span>';
							insertSlc1 += "</td><td>";
							insertSlc1 +=
								'<ons-select id="product_list-sel1" modifier="material" onchange="product_listSelectMeat(event)">';
							if (window.settings.language == "jp") {
								insertSlc1 += '<option value="すべて">すべて</option>';
								insertSlc1 += '<option value="国産">国産</option>';
								insertSlc1 += '<option value="輸入">輸入</option>';
							} else {
								insertSlc1 += '<option value="すべて">All</option>';
								insertSlc1 += '<option value="国産">Domestic</option>';
								insertSlc1 += '<option value="輸入">Import</option>';
							}
							insertSlc1 += "</ons-select>";
							insertSlc1 += "</td></tr>";

							break;
						case "野菜類":
						case "果物類":
							//すべて／産地
							insertSlc1 += "<tr><td>";
							insertSlc1 += '<span class="jp">産地</span>';
							insertSlc1 += '<span class="en">Production site</span>';
							insertSlc1 += "</td><td>";
							insertSlc1 +=
								'<ons-select id="product_list-sel1" modifier="material" onchange="product_listSelectVesi(event)">';
							if (window.settings.language == "jp") {
								insertSlc1 += '<option value="すべて">すべて</option>';
							} else {
								insertSlc1 += '<option value="すべて">All</option>';
							}

							$.each(productionSite, function (index, value) {
								if ($.inArray(value, dispProductionSite) !== -1) {
									insertSlc1 +=
										'<option value="' + value + '">' + value + "</option>";
								}
							});
							insertSlc1 += "</ons-select>";
							insertSlc1 += "</td></tr>";

							//すべて／今日出回っている野菜のみを表示
							insertSlc1 += "<tr><td>";
							insertSlc1 += '<span class="jp">季節</span>';
							insertSlc1 += '<span class="en">Season</span>';
							insertSlc1 += "</td><td>";
							insertSlc1 +=
								'<ons-select id="product_list-sel2" modifier="material" onchange="product_listSelectVesi(event)">';
							if (window.settings.language == "jp") {
								insertSlc1 +=
									'<option value="今日">今日売っている野菜のみ</option>';
								insertSlc1 += '<option value="すべて">すべて</option>';
							} else {
								insertSlc1 +=
									'<option value="今日">Only show the vegetables available today</option>';
								insertSlc1 += '<option value="すべて">All</option>';
							}

							insertSlc1 += "</ons-select>";
							insertSlc1 += "</td></tr>";

							break;

						case "魚類":
						case "貝類":
						case "海老・蟹類":
						case "烏賊・蛸類":
							//すべて／水揚げ地で絞り込む
							// リストの重複を削除、ソート
							var dispProductionSite = dispProductionSite.filter(function (
								x,
								i,
								self
							) {
								return self.indexOf(x) === i;
							});
							dispProductionSite.sort();

							insertSlc1 += "<tr><td>";
							insertSlc1 += '<span class="jp">水揚げ地</span>';
							insertSlc1 += '<span class="en">Landing site</span>';
							insertSlc1 += "</td><td>";
							insertSlc1 +=
								'<ons-select id="product_list-sel1" modifier="material" onchange="product_listSelectFish(event)">';

							if (window.settings.language == "jp") {
								insertSlc1 += '<option value="すべて">すべて</option>';
							} else {
								insertSlc1 += '<option value="すべて">All</option>';
							}

							$.each(dispProductionSite, function (index, value) {
								if (value != "" && value != "平均（統計値）")
									insertSlc1 +=
										'<option value="' + value + '">' + value + "</option>";
							});
							insertSlc1 += "</ons-select>";
							insertSlc1 += "</td></tr>";

							//すべて／漁法で絞り込む
							// リストの重複を削除、ソート
							var dispProductionMethod = dispProductionMethod.filter(function (
								x,
								i,
								self
							) {
								return self.indexOf(x) === i;
							});
							dispProductionMethod.sort();

							insertSlc1 += "<tr><td>";
							insertSlc1 += '<span class="jp">漁法</span>';
							insertSlc1 += '<span class="en">Fishing method</span>';
							insertSlc1 += "</td><td>";
							insertSlc1 +=
								'<ons-select id="product_list-sel2" modifier="material" onchange="product_listSelectFish(event)">';
							if (window.settings.language == "jp") {
								insertSlc1 += '<option value="すべて">すべて</option>';
							} else {
								insertSlc1 += '<option value="すべて">All</option>';
							}

							$.each(dispProductionMethod, function (index, value) {
								if (value != "" && value != "漁業全般")
									insertSlc1 +=
										'<option value="' + value + '">' + value + "</option>";
							});

							insertSlc1 += "</ons-select>";
							insertSlc1 += "</td></tr>";

							break;

						default:
							break;
					}

					insertSlc1 += "</table>";

					// セレクトボックス出力
					$(target).last().prepend(insertSlc1);
				}
			}

			break;

		case "JICFS_pages":
			//JICFS_pagesはページボタンを表示

			// 全件数からページ数と件数/ページを決定する場合の例(???件/ページ)
			//    var cnt = 0;
			//    if (res <= 2500){ // 2500件以下は250件/ページ
			//        cnt = 250;
			//    }else if(res <= 5000){ // 5000件以下は500件/ページ
			//        cnt = 500;
			//    }else if (res <= 10000){ // 10000件以下は10ページになるように調整（6800件→700件*10ページ）
			//        cnt = Math.ceil(res/1000)*100;
			//    }else{ // 10000件以上は1000件/ページ
			//        cnt = 1000;
			//    }

			// 300件/ページでボタンを表示
			var cnt = 300;
			var pageCnt = 0;
			pageCnt = Math.floor(res / cnt);
			if (res % cnt > 0) {
				pageCnt += 1;
			}

			// 挿入ボタン編集
			insert = "";
			for (var i = 1; i < pageCnt + 1; i++) {
				if (i % 2 != 0) {
					/// 奇数番目（左列）の処理
					insert += "<div class='product_list-button-list-child'>";
				}

				// ボタンタグ属性設定開始
				insert += '<ons-button class="button product_list_smallButton"';

				// 遷移先画面
				insert +=
					"onclick=\"navi.pushPage('product_list.html',{animation:'slide'," +
					" data:{type:'JICFS'," + // 商品一覧（JICFS_IDEA）
					" code: '" +
					code +
					"'," + // JICFS分類 （'110101'~'199797'）
					" page: '" +
					i +
					"'," + // ページ数（1~x）
					" cnt: '" +
					cnt +
					"'," + // 件数/ページ数（250~1000）
					" namejp: '" +
					namejp +
					"'," + // 漢字名（'醤油'~'その他食品'）
					" nameen: '" +
					nameen +
					"'}})\""; // 英語名（次画面のタイトル用）

				// ボタンタグ属性設定終了
				insert += " >";

				// 件数
				var dispPage = "";
				if (i != pageCnt) {
					dispPage = cnt * (i - 1) + 1 + "～" + cnt * i;
				} else {
					dispPage = cnt * (i - 1) + 1 + "～" + res;
				}
				insert += '<span class="product_list-text">';
				insert += '<div  class="font-middle">';
				insert += "<span>" + dispPage + "</span>";
				insert += "</div>";
				insert += '<div  class="font-small">';

				insert += "</div>";
				insert += "</span>";

				insert += "</ons-button>";

				// ボタンを1行ずつ出力
				if (i % 2 == 0 || i == pageCnt) {
					insert += "</div>";
					target.insertAdjacentHTML("beforeend", insert);
					insert = "";
				}
			}
			break;
		default:
			break;
	}

	// 言語切り替え ※描画が多いためこのタイミングで実行しないと正しく切り替えできない
	changeLanguage();

	// ボタンサイズ調整前処理
	// ※スキャン・検索後ページ挿入の場合、全ボタンがhiddenであるため、一度show()させる
	if (pageData.afterScanFlg !== undefined) {
		if (pageData.afterScanFlg && type == "JICFS") {
			$("ons-navigator > ons-page[id='product_list.html']:last").show();
		}
	}

	// ボタンサイズ調整＿文字列要素の高さに合わせる
	$(".product_list-button-list")
		.last()
		.children("ons-button")
		.each(function () {
			$(this).attr(
				"style",
				"height:" +
					(parseInt($(this).find(".font-middle").height()) +
						parseInt($(this).find(".font-small").height() + 30) +
						"px")
			);
			if ($(this).find(".font-small").length) {
				$(this).find(".font-middle span").addClass("product_list-setPosition");
			}
		});

	// ボタンサイズ調整後処理
	// ※スキャン・検索後ページ挿入の場合、全ボタンがhiddenに戻す
	// ※スキャン・検索後ページ挿入の場合、「ホームに戻る」ダイアログを表示させておく
	if (pageData.afterScanFlg !== undefined) {
		if (pageData.afterScanFlg && type == "JICFS") {
			$("ons-navigator > ons-page[id='product_list.html']:last").hide();

			showToHome();
		}
	}

	// IDEA野菜・果物の初回表示時のみ絞り込み状態で表示
	// ※初期値が"すべて"ではないため
	if (pageData.sortBy === undefined) {
		if (type == "IDEA") {
			switch (namejp) {
				case "野菜類":
				case "果物類":
					product_listSelectVesi(event, true);
					break;
				default:
					break;
			}
		}
	}

	// スキャン・検索後ページ挿入の場合は、次の画面をinsertする
	// 商品一覧（ページ表示）→商品一覧1ページ目
	if (pageData.afterScanFlg !== undefined) {
		if (pageData.afterScanFlg && type == "JICFS_pages") {
			insertAfterScan("JICFS", code, pageData.namejp, pageData.nameen);
		} else if (pageData.afterScanFlg && type == "JICFS") {
			//最後の画面（商品一覧1ページ目）をinsertしたらscan画面・検索画面を削除する
			navi.removePage(1);
		}
	}
}

/****************************** ソート・絞り込み ******************************/

// セレクトボックスによる絞り込み＿牛・豚・鶏
// すべて／国産／輸入
function product_listSelectMeat(event) {
	var displayNoneList = [];

	// 非表示リストの作成
	// すべて／国産／輸入
	if ($("#product_list-sel1 .select-input").val() == "すべて") {
		// すべての場合は何もしない
	} else {
		$(".product_list-button-list")
			.last()
			.children("ons-button")
			.each(function () {
				if (
					$(this).attr("target") != $("#product_list-sel1 .select-input").val()
				) {
					// 国産／輸入がセレクトと一致していなかったら非表示リストにidを追加
					displayNoneList.push($(this).attr("id"));
				}
			});
	}

	// 表示切り替え
	$(".product_list-button-list")
		.last()
		.children("ons-button")
		.each(function () {
			if ($.inArray($(this).attr("id"), displayNoneList) === -1) {
				// ボタンidが非表示リストに入ってなければ表示
				$(this).slideDown();
			} else {
				$(this).slideUp();
			}
		});
}

// セレクトボックスによる絞り込み＿野菜類・果物類
// すべて／産地、すべて／今日出回っている野菜のみを表示
//flgFirst：初期表示時のみtrue
function product_listSelectVesi(event, flgFirst) {
	var displayNoneList = [];

	// 非表示リストの作成
	// すべて／産地
	if ($("#product_list-sel1 .select-input").val() == "すべて") {
		// すべての場合は何もしない
	} else {
		$(".product_list-button-list")
			.last()
			.children("ons-button")
			.each(function () {
				if (
					$(this).attr("target1") != $("#product_list-sel1 .select-input").val()
				) {
					// 産地がセレクトと一致していなかったら非表示リストにidを追加
					displayNoneList.push($(this).attr("id"));
				}
			});
	}

	// すべて／今日出回っている野菜のみを表示
	if ($("#product_list-sel2 .select-input").val() == "すべて") {
		// すべての場合は何もしない
	} else {
		// 昨日のYYYYMMDDを取得
		var today = new Date();
		var yesterday = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() - 1
		);

		$(".product_list-button-list")
			.last()
			.children("ons-button")
			.each(function () {
				if (
					$(this).attr("target2") === undefined ||
					$(this).attr("target2") == ""
				) {
					// 野菜・季節が空欄のボタンは表示
				} else {
					// 「、」区切りされている分の判定を行う
					var termList = $(this).attr("target2").split("、");
					var thisID = $(this).attr("id");
					var dispFlg = false;

					$.each(termList, function (index, value) {
						// 期間を取得
						var fromMonth = parseInt(value.split("～")[0].split("月")[0]);
						var fromDay = parseInt(
							value.split("～")[0].split("月")[1].replace("日", "")
						);
						var from = new Date(today.getFullYear(), fromMonth - 1, fromDay);

						var toMonth = parseInt(value.split("～")[1].split("月")[0]);
						var toDay = parseInt(
							value.split("～")[1].split("月")[1].replace("日", "")
						);
						var to = new Date(today.getFullYear(), toMonth - 1, toDay);
						if (!dispFlg) {
							if (fromMonth > toMonth) {
								//年をまたぐ場合(ex:10~6月)
								if (yesterday >= from) {
									// 表示(ex：12月)
									dispFlg = true;
								} else if (yesterday <= to) {
									// 表示(ex：4月)
									dispFlg = true;
								} else {
									// 非表示(ex：8月)
								}
							} else {
								//年をまたがない場合(ex:6~10月)
								if (yesterday >= from) {
									if (yesterday <= to) {
										// 表示(ex：8月)
										dispFlg = true;
									} else {
										// 非表示(ex：12月)
									}
								} else {
									// 非表示(ex：4月)
								}
							}
						}
					});
					if (!dispFlg) {
						displayNoneList.push(thisID);
					}
				}
			});
	}

	// 表示切り替え
	$(".product_list-button-list")
		.last()
		.children("ons-button")
		.each(function () {
			if ($.inArray($(this).attr("id"), displayNoneList) === -1) {
				// ボタンidが非表示リストに入ってなければ表示
				$(this).slideDown();
			} else {
				if (flgFirst) {
					// 初期表示時にアニメーションが見えてしまうのを回避
					$(this).hide();
				} else {
					$(this).slideUp();
				}
			}
		});
}

// セレクトボックスによる絞り込み＿魚類・貝類・海老・蟹類・烏賊・蛸類
// すべて／水揚げ地・漁法で絞り込む
function product_listSelectFish(event) {
	var displayNoneList = [];

	// 非表示リストの作成
	// すべて／水揚げ地
	if ($("#product_list-sel1 .select-input").val() == "すべて") {
		// すべての場合は何もしない
	} else {
		$(".product_list-button-list")
			.last()
			.children("ons-button")
			.each(function () {
				if (
					$(this).attr("target1") != $("#product_list-sel1 .select-input").val()
				) {
					// 産地がセレクトと一致していなかったら非表示リストにidを追加
					displayNoneList.push($(this).attr("id"));
				}
			});
	}

	// すべて／漁法
	if ($("#product_list-sel2 .select-input").val() == "すべて") {
		// すべての場合は何もしない
	} else {
		$(".product_list-button-list")
			.last()
			.children("ons-button")
			.each(function () {
				if (
					$(this).attr("target2") != $("#product_list-sel2 .select-input").val()
				) {
					// 産地がセレクトと一致していなかったら非表示リストにidを追加
					displayNoneList.push($(this).attr("id"));
				}
			});
	}

	// 表示切り替え
	$(".product_list-button-list")
		.last()
		.children("ons-button")
		.each(function () {
			if ($.inArray($(this).attr("id"), displayNoneList) === -1) {
				// ボタンidが非表示リストに入ってなければ表示
				$(this).slideDown();
			} else {
				$(this).slideUp();
			}
		});
}

// セレクトボックスによるソート変更
// スコア順／名前順
//// in_type:画面タイプ（IDEA/JICFS）
//// in_namejp:漢字分類名
//// in_nameen:漢字分類名（英語）
function product_listChangeSort(event, in_type, in_namejp, in_nameen) {
	var tempRes = "";
	var nextPageData = {
		type: in_type,
		namejp: in_namejp,
		nameen: in_nameen,
		sortBy: $("#product_list-sel0 .select-input").val(),
	};

	//保持中のテーブル取得データを読み込む
	tempRes = JSON.parse($(".product_list-tempRes").last().val());

	// 並べ替え用の配列に格納
	var i = 0;
	var sort = [];
	var n = tempRes.length;

	if (nextPageData.sortBy == "name") {
		//名前順に並び替え
		for (i = 0; i < n; i++) {
			sort[i] = [tempRes[i].製品名, tempRes[i]];
		}

		sort.sort((x, y) => x[0].localeCompare(y[0], "ja"));
		for (i = 0; i < n; i++) {
			sort[i] = sort[i][1];
		}
		tempRes = sort;
	}

	//セレクトボックス・商品ボタンを一旦削除
	$(".product_list-button-list ons-button").each(function () {
		$(this).remove();
	});

	// ソート後のテーブル取得データを使用して商品一覧を再描画
	drawProduct_list(tempRes, nextPageData);

	// 絞り込み設定がある場合は反映させる
	if ($("#product_list-sel1").length) {
		document.getElementById("product_list-sel1").onchange();
	}
}
