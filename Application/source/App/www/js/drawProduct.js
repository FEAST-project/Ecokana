/* 商品画面の描画 */

// ページ描画処理
// res:テーブルから取得したデータ
// pageData:画面遷移時パラメータ
//// pageData.type:画面タイプ（IDEA/JICFS）
function drawProduct(res, pageData) {
	$.getJSON("json/QA.json", function (json) {
		/************************** 初期処理 **************************/
		var type = pageData.type; // IDEA/JICFS

		// 商品タイプを保持
		$("#product-tempType").val(type);

		// 商品情報を保持
		// ※スコア補正時にテーブルから上位10%を取得するために使用する。
		// 　IDEAはスコア補正しないので不要
		if (type != "IDEA") {
			$("#product-tempCategory").val(res[0]["JICFS分類"]);
		}

		// Product_IDを保持
		$("#product-productID").attr("value", res[0]["Product_ID"]);

		/************************** html描画 **************************/
		// 製品名
		if (type == "IDEA") {
			$("#product-productName").text(res[0]["製品名"]);
		} else {
			$("#product-productName").text(res[0]["伝票用商品名称(漢字)"]);
		}

		// 製品名の文字サイズ調整
		// 基本は16pxで、折り返して2行までならヘッダーに収まる
		// 3行を超える場合は文字サイズを小さくする
		// 3行の判定は製品名枠の高さにて行う
		if ($("#product-productName").height() > 50) {
			$("#product-productName").css({ "font-size": "12px" });
		}

		// 規格
		$("#product-volume").text(res[0]["表示用規格(カナ)"]);

		// 画面右上のメッセージ（追加情報）
		$(".product-subData.jp").text("");
		$(".product-subData.en").text("");
		if (type == "IDEA") {
			if (res[0]["資源評価"] != "") {
				$(".product-subData.jp").text("資源水準・動向：" + res[0]["資源評価"]);
				switch (res[0]["資源評価"]) {
					case "下位・減少":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Low-Decrease"
						);
						break;
					case "低位・減少傾向":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Low-Decrease"
						);
						break;
					case "低位・減少":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Low-Decrease"
						);
						break;
					case "低位・不安定":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Low-Unstable"
						);
						break;
					case "低位・横ばい":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Low-Constant"
						);
						break;
					case "低位・微増":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Low-Slight Increase"
						);
						break;
					case "低位・増加":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Low-Increase"
						);
						break;
					case "低位～中位・横ばい":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Low to Middle-Constant"
						);
						break;
					case "中位～低位・横ばい":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Middle to Low-Constant"
						);
						break;
					case "中位・減少":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Middle-Decrease"
						);
						break;
					case "中位・安定":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Middle-Stable"
						);
						break;
					case "中位・横ばい":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Middle-Constant"
						);
						break;
					case "中位・増加":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "Middle-Increase"
						);
						break;
					case "高位・減少":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "High-Decrease"
						);
						break;
					case "高位・安定":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "High-Stable"
						);
						break;
					case "高位・不安定":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "High-Unstable"
						);
						break;
					case "高位・横ばい":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "High-Constant"
						);
						break;
					case "高位・増加傾向":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "High-Increase"
						);
						break;
					case "高位・増加":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "High-Increase"
						);
						break;
					case "高位・─":
						$(".product-subData.en").text(
							"Stock Status and Trend：" + "High- -"
						);
						break;
					case "─":
						$(".product-subData.en").text("Stock Status and Trend：" + "-");
						break;
					default:
						break;
				}
			}
			if (res[0]["加温・無加温"] == "加熱") {
				$(".product-subData.jp").text("加温器具の利用：有");
				$(".product-subData.en").text(
					"Use of Heating Device for Cultivation：Yes"
				);
			} else if (res[0]["加温・無加温"] == "無加温") {
				$(".product-subData.jp").text("加温器具の利用：無");
				$(".product-subData.en").text(
					"Use of Heating Device for Cultivation：No"
				);
			}
		} else {
			$(".product-subData.jp").text(
				""
			);
			$(".product-subData.en").text(
				""
			);
			$(".product-data .right").attr("style", "text-align: left;");
			$(".product-subData.jp").addClass("font_s");
			$(".product-subData.en").addClass("font_s");
		}

		// 各種スコア表示
		drawScore(res, true);

		// 注意メッセージ
		if (type == "IDEA") {
			$(".product-msg.jp").text("");
			$(".product-msg.en").text("");
		} else {
			$(".product-msg.jp").text(
				"※各スコアは個別商品ではなく企業名に基づいて算出したものです。"
			);
			$(".product-msg.en").text(
				"※Each core is based on the information of company, not of individual product."
			);
		}

		// QAの設置
		// jsonを読み込み
		var jsonData = null;

		if (type == "IDEA") {
			jsonData = json.IDEA;
		} else {
			jsonData = json.JICFS;
		}

		// アンケートの描画
		var target = ".product-data";
		var insert = "";

		for (var i in jsonData) {
			insert += '<div id="product-qa' + jsonData[i].id + '">';
			insert += '<p class="jp font_s">' + jsonData[i].jp + "</p>";
			insert += '<p class="en font_s">' + jsonData[i].en + "</p>";
			for (var j in jsonData[i].ans) {
				if (j == 4) {
					insert += "<br>";
				}
				insert +=
					'<ons-checkbox id="product-qa' +
					jsonData[i].id +
					"-" +
					jsonData[i].ans[j].no +
					'"' +
					' input-id="' +
					jsonData[i].id +
					"-" +
					jsonData[i].ans[j].no +
					'" ' +
					' order="' +
					(parseInt(j) + 1) +
					'" ' +
					" onclick=\"showStatistics(this,'" +
					type +
					"')\"></ons-checkbox>";
				insert +=
					'<label for="' +
					jsonData[i].id +
					"-" +
					jsonData[i].ans[j].no +
					'" class="jp font_s">' +
					jsonData[i].ans[j].jp +
					"   </label>";
				insert +=
					'<label for="' +
					jsonData[i].id +
					"-" +
					jsonData[i].ans[j].no +
					'" class="en font_s">' +
					jsonData[i].ans[j].en +
					"   </label>";
			}
			insert += '<div id="product-qa' + jsonData[i].id + '-chart"></div>';
			insert += "</div>";
		}

		insert += "</div>";

		// アンケートを出力 ※一旦IDEA/JICFS別の全アンケート項目を出力する
		$(target).last().append(insert);

		// 商品に関係ないアンケートを削除
		if (type == "IDEA") {
			if (res[0]["Product_ID"].toString().substr(0, 2) != "11") {
				$("#product-qa7").remove();
			}

			if (!(res[0]["漢字分類名"] == "牛" || res[0]["漢字分類名"] == "鶏")) {
				$("#product-qa8").remove();
			}

			if (res[0]["Product_ID"].toString().substr(0, 2) != "12") {
				$("#product-qa9").remove();
			}
			if (res[0]["Product_ID"].toString().substr(0, 2) != "13") {
				$("#product-qa10").remove();
			}
			if (res[0]["Product_ID"].toString().substr(0, 2) != "14") {
				$("#product-qa11").remove();
			}
		}

		// 情報リクエストボタンに属性を追加
		if (type == "IDEA") {
			$(".product-request").attr(
				"onclick",
				"navi.pushPage('requestInfo.html',{animation:'slide', data:{type:'IDEA',code: '" +
					res[0]["Product_ID"] +
					"'}})"
			);
		} else {
			$(".product-request").attr(
				"onclick",
				"navi.pushPage('requestInfo.html',{animation:'slide', data:{type:'JICFS',code: '" +
					res[0]["Product_ID"] +
					"'}})"
			);
		}

		// スキャン画面・検索画面から移動した場合は、戻り先のカテゴリー①～商品一覧（1ページ目）画面をinsertする
		if (type == "SCAN") {
			$.getJSON("json/category.json", function (json) {
				var jsonData = null;
				if (res[0]["JICFS分類"].slice(0, 2) == "12") {
					jsonData = json.JICFS_category2[res[0]["JICFS分類"].slice(0, 2)];
				} else {
					jsonData = json.JICFS_category3[res[0]["JICFS分類"].slice(0, 4)];
				}

				for (var i in jsonData) {
					if (jsonData[i].code == res[0]["JICFS分類"]) {
						//カテゴリー①をinsertする。
						//他の画面はdrawCategory()、drawProduct_list()で順々にinsertする
						insertAfterScan(
							"JICFS_1",
							res[0]["JICFS分類"],
							jsonData[i].namejp,
							jsonData[i].nameen
						);
						break;
					}
				}
			});
		}

		// 閲覧回数を加算
		countView(type);

		// 情報リクエスト比率表示
		drawRequestRatio(type);

		// 言語切り替え ※描画が多いためこのタイミングで実行しないと正しく切り替えできない
		changeLanguage();

		// 「フッター説明」ダイアログ表示
		showFooter();

		// 履歴に登録するデータを保持
		// 現在の日時
		var d = new Date();
		// 2桁のゼロ埋め
		var fillZero = function (number) {
			return ("0" + number).slice(-2);
		};
		// 年月日時分秒を取得
		var year = d.getFullYear(); // 年
		var month = fillZero(d.getMonth() + 1); // 月
		var date = fillZero(d.getDate()); // 日
		var hour = fillZero(d.getHours()); // 時
		var minute = fillZero(d.getMinutes()); // 分
		var second = fillZero(d.getSeconds()); // 秒
		// 年月日時分秒の文字列の作成(YYYYMMDDHHMMSS)
		var str =
			year +
			"/" +
			month +
			"/" +
			date +
			" " +
			hour +
			":" +
			minute +
			":" +
			second;

		if (type == "SCAN") {
			type = "JICFS";
		}
		var historyText =
			"{" + type + "," + res[0]["Product_ID"] + "," + str + "},\n";
		saveSettings("history.txt", historyText);
	});
}

//res:アンケート回答後のJICFS_IDEA_addテーブル取得データ , flgFisrt：true->初回表示※JICFSのみ使用
function drawScore(res, flgFirst) {
	//表示中の商品タイプを取得
	var tempType = $("#product-tempType").val();

	//総合スコアの初期値をhiddenにセット
	if (flgFirst) {
		$("#product-initScore").val(
			(Math.round(res[0]["補正総合スコア"] * 10) / 10).toFixed(1)
		);
		$("#product-tempScore").val(
			(Math.round(res[0]["補正総合スコア"] * 10) / 10).toFixed(1)
		);
	}

	//最新のスコアを取得
	var newScore = (Math.round(res[0]["補正総合スコア"] * 10) / 10).toFixed(1);
	$("#product-newScore").val(newScore);

	//総合スコア表示
	$("#product-score").text(newScore);
	if (newScore >= 2.4) {
		$("#product-score").css({ "background-color": "#D9A0BB" });
	} else if (newScore >= 1.5) {
		$("#product-score").css({ "background-color": "#EBC339" });
	} else {
		$("#product-score").css({ "background-color": "" });
	}

	//上位10%の総合スコアを取得
	var score_10 = $("#product-score_10").val();
	if (tempType == "IDEA") {
		//IDEAは商品一覧画面のhiddenから取得
		score_10 = $(".product_list-tempScore10").last().val();
	} else {
		//JICFSは初回または総合スコアが変更された場合にテーブルから再取得
		var tempScore = $("#product-tempScore").val();
		if (flgFirst || tempScore != newScore) {
			var tempCategory = $("#product-tempCategory").val();
			var tempData = { type: tempType, code: tempCategory };
			var res_get10 = sendRequest("get10", tempData);
			score_10 = (Math.round(res_get10[0]["補正総合スコア"] * 10) / 10).toFixed(
				1
			);
			$("#product-score_10").val(score_10);
			$("#product-tempScore").val(newScore);
		}
	}

	//総合スコアが上位10%であればアイコンを表示
	if (score_10 > 0 && newScore >= score_10) {
		$(".product-score10").show();
	} else {
		$(".product-score10").hide();
	}

	//環境・社会・健康評価表示
	var envScore = 0;
	if (tempType == "IDEA") {
		envScore = (Math.round(res[0]["環境評価"] * 10) / 10).toFixed(1);
	} else {
		envScore = (Math.round(res[0]["補正環境評価"] * 10) / 10).toFixed(1);
	}
	$("#product-EnvImpacts span:first").text(""); 
	$("#product-EnvImpacts .jp").text("");
	$("#product-EnvImpacts .en").text("");
	$("#product-EnvImpacts").css({ color: "" });

	if (envScore > 0.0) {
		$("#product-EnvImpacts span:first").text(envScore);
		$("#product-EnvImpacts").removeClass("font-scoreNodata");
		$("#product-EnvImpacts").addClass("font-score");
		if (envScore > 4.0) {
			$("#product-EnvImpacts").css({ color: "#5DBF8D" });
			$("#product-EnvImage")
				.children("img")
				.attr("src", "img/product/環境_5.png");
		} else if (envScore >= 3.0) {
			$("#product-EnvImpacts").css({ color: "#C97B3F" });
			$("#product-EnvImage")
				.children("img")
				.attr("src", "img/product/環境_4.3.png");
		} else {
			$("#product-EnvImpacts").css({ color: "#770606" });
			$("#product-EnvImage")
				.children("img")
				.attr("src", "img/product/評価_2.1.png");
		}
	} else {
		$("#product-EnvImpacts .jp").text("利用可能なデータがありません");
		$("#product-EnvImpacts .en").text("No data available");
		$("#product-EnvImpacts").removeClass("font-score");
		$("#product-EnvImpacts").addClass("font-scoreNodata"); 
		$("#product-EnvImage")
			.children("img")
			.attr("src", "img/product/データなし.png");
	}

	var socScore = 0;
	if (tempType == "IDEA") {
		socScore = (Math.round(res[0]["社会評価"] * 10) / 10).toFixed(1);
	} else {
		socScore = (Math.round(res[0]["補正社会評価"] * 10) / 10).toFixed(1);
	}
	$("#product-SocImpacts span:first").text("");
	$("#product-SocImpacts .jp").text("");
	$("#product-SocImpacts .en").text("");
	$("#product-SocImpacts").css({ color: "" });
	if (socScore > 0.0) {
		$("#product-SocImpacts span:first").text(socScore);
		$("#product-SocImpacts").removeClass("font-scoreNodata");
		$("#product-SocImpacts").addClass("font-score");
		if (socScore > 4.0) {
			$("#product-SocImpacts").css({ color: "#5DBF8D" });
			$("#product-SocImage")
				.children("img")
				.attr("src", "img/product/社会_5.png");
		} else if (socScore >= 3.0) {
			$("#product-SocImpacts").css({ color: "#C97B3F" });
			$("#product-SocImage")
				.children("img")
				.attr("src", "img/product/社会_4.3.png");
		} else {
			$("#product-SocImpacts").css({ color: "#770606" });
			$("#product-SocImage")
				.children("img")
				.attr("src", "img/product/評価_2.1.png");
		}
	} else {
		$("#product-SocImpacts .jp").text("利用可能なデータがありません");
		$("#product-SocImpacts .en").text("No data available");
		$("#product-SocImpacts").removeClass("font-score");
		$("#product-SocImpacts").addClass("font-scoreNodata");
		$("#product-SocImage")
			.children("img")
			.attr("src", "img/product/データなし.png");
	}

	var helScore = 0;
	if (tempType == "IDEA") {
		helScore = (Math.round(res[0]["健康評価"] * 10) / 10).toFixed(1);
	} else {
		helScore = (Math.round(res[0]["補正健康評価"] * 10) / 10).toFixed(1);
	}
	$("#product-HelImpacts span:first").text("");
	$("#product-HelImpacts .jp").text("");
	$("#product-HelImpacts .en").text("");
	$("#product-HelImpacts").css({ color: "" });
	if (helScore > 0.0) {
		$("#product-HelImpacts span:first").text(helScore);
		$("#product-HelImpacts").removeClass("font-scoreNodata");
		$("#product-HelImpacts").addClass("font-score");
		if (helScore > 4.0) {
			$("#product-HelImpacts").css({ color: "#5DBF8D" });
			$("#product-HelImage")
				.children("img")
				.attr("src", "img/product/健康_5.png");
		} else if (helScore >= 3.0) {
			$("#product-HelImpacts").css({ color: "#C97B3F" });
			$("#product-HelImage")
				.children("img")
				.attr("src", "img/product/健康_4.3.png");
		} else {
			$("#product-HelImpacts").css({ color: "#770606" });
			$("#product-HelImage")
				.children("img")
				.attr("src", "img/product/評価_2.1.png");
		}
	} else {
		$("#product-HelImpacts .jp").text("利用可能なデータがありません");
		$("#product-HelImpacts .en").text("No data available");
		$("#product-HelImpacts").removeClass("font-score");
		$("#product-HelImpacts").addClass("font-scoreNodata");
		$("#product-HelImage")
			.children("img")
			.attr("src", "img/product/データなし.png");
	}
}

/****************************** 表示編集関数 ******************************/
// 商品一覧のスコア・アイコンの再表示
function redrawProduct_list() {
	//対象はJICFS・SCANのみ
	if ($("#product-tempType").val() != "IDEA") {
		var targetID = $("#product-productID").val();
		var score_10 = $("#product-productID").val();
		var initScore = $("#product-initScore").val();
		var newScore = $("#product-newScore").val();
		var score_10 = $("#product-score_10").val();

		if (initScore != newScore) {
			//表示中の全商品（最大300件）を再判定する
			$("ons-navigator > ons-page[id='product_list.html']:last").show();
			$(".product_list-button-list")
				.last()
				.children("ons-button")
				.each(function () {
					//総合スコアの更新
					if ($(this).attr("id") == targetID) {
						$(this).find(".font-score").text(newScore);
						if (newScore >= 2.4) {
							$(this)
								.find(".font-score")
								.attr("style", "background-color:#D9A0BB");
						} else if (newScore >= 1.5) {
							$(this)
								.find(".font-score")
								.attr("style", "background-color:#EBC339");
						} else {
							$(this)
								.find(".font-score")
								.attr("style", "background-color:#D5CECB");
						}
					}

					//一旦、商品名幅・アイコンをリセット
					$(this).find("img").remove();
					$(this).find(".font-middle").attr("style", "width:");

					//再調整・再判定
					if (score_10 > 0 && $(this).find(".font-score").text() >= score_10) {
						$(this).find(".font-middle").attr("style", "width:62vw !important");
						$(this)
							.find(".font-score")
							.before('<img src="img/common/list_10.png">');
					}
					$(this).attr(
						"style",
						"height:" +
							(parseInt($(this).find(".font-middle").height()) +
								parseInt($(this).find(".font-small").height() + 30) +
								"px")
					);
				});
		}
	}
}

// 閲覧回数加算処理
// type：IDEA/JICFS
function countView(type) {
	var data = {};
	if (type == "IDEA") {
		data = { type: "IDEA", code: $("#product-productID").attr("value") };
	} else {
		data = { type: "JICFS", code: $("#product-productID").attr("value") };
	}

	// 閲覧回数加算
	sendRequest("countView", data);
}

// 情報リクエスト比率表示処理
// type：IDEA/JICFS
function drawRequestRatio(type) {
	var data = {};
	if (type == "IDEA") {
		data = { type: "IDEA", code: $("#product-productID").attr("value") };
	} else {
		data = { type: "JICFS", code: $("#product-productID").attr("value") };
	}

	var response = "";

	// 情報リクエスト後のテーブルレコードを取得
	response = sendRequest("getQAReq", data);

	// 比率を再計算
	var ratio = 0;
	if (response[0]["情報リクエスト"] > response[0]["閲覧回数"]) {
		$(".product-requestRatio .product-requestRatio-req").text(
			response[0]["閲覧回数"]
		);
		$(".product-requestRatio .product-requestRatio-view").text(
			response[0]["閲覧回数"]
		);
		ratio = 100;
	} else {
		$(".product-requestRatio .product-requestRatio-req").text(
			response[0]["情報リクエスト"]
		);
		$(".product-requestRatio .product-requestRatio-view").text(
			response[0]["閲覧回数"]
		);
		ratio = (response[0]["情報リクエスト"] / response[0]["閲覧回数"]) * 100;
	}

	// 情報リクエスト比率再表示
	$(".product-requestRatio-bar-req").attr("style", "width:" + ratio + "%");
}
