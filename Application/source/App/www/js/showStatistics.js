/* アンケート関連 */

// アンケート回答時処理
//// ele:タップされた要素
//// ele.id:ボタンid（"product-qaX-X"）
//// type：IDEA/JICFS
function showStatistics(ele, type) {
	// 回答されたアンケートを取得
	var qaNo = ele.id.split("-")[1].replace("qa", "");

	// 回答されたアンケートの全選択肢を非活性化
	$("[id^=product-qa" + qaNo + "-]").each(function () {
		$(this).attr("disabled", "true");
	});

	// アンケート加算、アンケートグラフ表示、スコア補正用のsendデータを生成
	var data = {};
	if (type == "IDEA") {
		data = {
			type: "IDEA",
			code: $("#product-productID").attr("value"),
			qaNo: ele.id.replace("product-qa", ""),
			order: $("#" + ele.id).attr("order"),
		};
	} else {
		data = {
			type: "JICFS",
			code: $("#product-productID").attr("value"),
			qaNo: ele.id.replace("product-qa", ""),
			order: $("#" + ele.id).attr("order"),
		};
	}

	// アンケート加算
	var response = "";
	response = sendRequest("product_qa", data);

	// アンケートグラフ表示
	drawStatistics(response, data);

	// JICFS_IDEA_addテーブル更新（スコア補正）
	if (type != "IDEA") {
		response = sendRequest("editScore", data);
		// スコア、イメージの再表示
		drawScore(response, false);
	}
}

// アンケートグラフ表示処理
//// res:テーブルから取得したデータ
//// pageData:ページ遷移時のsendデータ
//// pageData.qaNo:回答されたアンケートNoと選択肢（"X-X"）
//// pageData.order:回答された選択肢の表示上の順番
function drawStatistics(res, pageData) {
	// 回答されたアンケートNoを取得
	var qaNo = pageData.qaNo.split("-")[0];

	// 選択肢の表示上の順番を取得
	var selectedNo = pageData.order;

	// グラフ色設定
	var color1 = "#ff4b00";
	var color2 = "#fff100";
	var color3 = "#03ae7a";
	var color4 = "#4dc4ff";
	var color5 = "#ff8082";
	var color6 = "#005aff";

	// 回答された選択肢に"選択色"を指定
	switch (selectedNo) {
		case "1":
			color1 = "#7A8A8A";
			break;
		case "2":
			color2 = "#7A8A8A";
			break;
		case "3":
			color3 = "#7A8A8A";
			break;
		case "4":
			color4 = "#7A8A8A";
			break;
		case "5":
			color5 = "#7A8A8A";
			break;
		case "6":
			color6 = "#7A8A8A";
			break;
	}

	// 言語設定
	var yes1 = "はい";
	var no1 = "いいえ";
	var notSure = "わからない";
	var yes2 = "ある";
	var no2 = "ない";
	var clear = "わかる";
	var notClear = "わからない";
	var yes3 = "ほしい";
	var notReally = "なくてもいい";
	var labeled1 = "すでにある";
	var english = "英語";
	var spanish = "スペイン語";
	var chinese = "中国語";
	var korean = "韓国語";
	var others = "その他";
	var labeled2 = "すでにある";

	if (window.settings.language == "en") {
		yes1 = "Yes";
		no1 = "No";
		notSure = "Not Sure";
		yes2 = "Yes";
		no2 = "No";
		clear = "Clear";
		notClear = "Not clear";
		yes3 = "Yes";
		notReally = "Not really";
		labeled1 = "Labeled";
		english = "English";
		spanish = "Spanish";
		chinese = "Chinese";
		korean = "Korean";
		others = "Others";
		labeled2 = "Labeled in other languages";
	}

	// 選択肢とグラフ・言語を紐づけ
	if (pageData.type == "IDEA") {
		switch (qaNo) {
			case "1":
				chartdata = [
					[
						[yes1, res[0]["回答" + qaNo + "-1"]],
						[no1, res[0]["回答" + qaNo + "-2"]],
						[notSure, res[0]["回答" + qaNo + "-3"]],
					],
				];

				datalabel = [
					yes1 + " :" + res[0]["回答" + qaNo + "-1"],
					no1 + " :" + res[0]["回答" + qaNo + "-2"],
					notSure + " :" + res[0]["回答" + qaNo + "-3"],
				];

				seriescolors = [color1, color2, color3];

				break;
			case "6":
				chartdata = [
					[
						[labeled2, res[0]["回答" + qaNo + "-6"]],
						[english, res[0]["回答" + qaNo + "-1"]],
						[spanish, res[0]["回答" + qaNo + "-2"]],
						[chinese, res[0]["回答" + qaNo + "-3"]],
						[korean, res[0]["回答" + qaNo + "-4"]],
						[others, res[0]["回答" + qaNo + "-5"]],
					],
				];

				datalabel = [
					labeled2 + " :" + res[0]["回答" + qaNo + "-6"],
					english + " :" + res[0]["回答" + qaNo + "-1"],
					spanish + " :" + res[0]["回答" + qaNo + "-2"],
					chinese + " :" + res[0]["回答" + qaNo + "-3"],
					korean + " :" + res[0]["回答" + qaNo + "-4"],
					others + " :" + res[0]["回答" + qaNo + "-5"],
				];

				seriescolors = [color1, color2, color3, color4, color5, color6];

				break;
			default:
				chartdata = [
					[
						[yes2, res[0]["回答" + qaNo + "-1"]],
						[no2, res[0]["回答" + qaNo + "-2"]],
					],
				];
				datalabel = [
					yes2 + " :" + res[0]["回答" + qaNo + "-1"],
					no2 + " :" + res[0]["回答" + qaNo + "-2"],
				];

				seriescolors = [color1, color2];

				break;
		}
	} else {
		switch (qaNo) {
			case "1":
				chartdata = [
					[
						[yes1, res[0]["回答" + qaNo + "-1"]],
						[no1, res[0]["回答" + qaNo + "-2"]],
						[notClear, res[0]["回答" + qaNo + "-3"]],
					],
				];

				datalabel = [
					yes1 + " :" + res[0]["回答" + qaNo + "-1"],
					no1 + " :" + res[0]["回答" + qaNo + "-2"],
					notClear + " :" + res[0]["回答" + qaNo + "-3"],
				];

				seriescolors = [color1, color2, color3];

				break;
			case "6":
				chartdata = [
					[
						[clear, res[0]["回答" + qaNo + "-1"]],
						[notClear, res[0]["回答" + qaNo + "-2"]],
					],
				];

				datalabel = [
					clear + " :" + res[0]["回答" + qaNo + "-1"],
					notClear + " :" + res[0]["回答" + qaNo + "-2"],
				];

				seriescolors = [color1, color2];

				break;
			case "7":
				chartdata = [
					[
						[labeled1, res[0]["回答" + qaNo + "-3"]],
						[yes3, res[0]["回答" + qaNo + "-1"]],
						[notReally, res[0]["回答" + qaNo + "-2"]],
					],
				];

				datalabel = [
					labeled1 + " :" + res[0]["回答" + qaNo + "-3"],
					yes3 + " :" + res[0]["回答" + qaNo + "-1"],
					notReally + " :" + res[0]["回答" + qaNo + "-2"],
				];

				seriescolors = [color1, color2, color3];

				break;
			case "8":
				chartdata = [
					[
						[labeled2, res[0]["回答" + qaNo + "-6"]],
						[english, res[0]["回答" + qaNo + "-1"]],
						[spanish, res[0]["回答" + qaNo + "-2"]],
						[chinese, res[0]["回答" + qaNo + "-3"]],
						[korean, res[0]["回答" + qaNo + "-4"]],
						[others, res[0]["回答" + qaNo + "-5"]],
					],
				];

				datalabel = [
					labeled2 + " :" + res[0]["回答" + qaNo + "-6"],
					english + " :" + res[0]["回答" + qaNo + "-1"],
					spanish + " :" + res[0]["回答" + qaNo + "-2"],
					chinese + " :" + res[0]["回答" + qaNo + "-3"],
					korean + " :" + res[0]["回答" + qaNo + "-4"],
					others + " :" + res[0]["回答" + qaNo + "-5"],
				];

				seriescolors = [color1, color2, color3, color4, color5, color6];

				break;
			case "9":
				chartdata = [
					[
						[yes1, res[0]["回答" + qaNo + "-1"]],
						[no1, res[0]["回答" + qaNo + "-2"]],
					],
				];
				datalabel = [
					yes1 + " :" + res[0]["回答" + qaNo + "-1"],
					no1 + " :" + res[0]["回答" + qaNo + "-2"],
				];

				seriescolors = [color1, color2];

				break;
			default:
				chartdata = [
					[
						[yes2, res[0]["回答" + qaNo + "-1"]],
						[no2, res[0]["回答" + qaNo + "-2"]],
					],
				];
				datalabel = [
					yes2 + " :" + res[0]["回答" + qaNo + "-1"],
					no2 + " :" + res[0]["回答" + qaNo + "-2"],
				];

				seriescolors = [color1, color2];

				break;
		}
	}

	// オプション
	option = {
		seriesDefaults: {
			renderer: jQuery.jqplot.PieRenderer,
			rendererOptions: {
				showDataLabels: true,
				startAngle: -90,
				shadowDepth: 0,
				padding: 2,
			},
		},
		grid: {
			drawBorder: false,
			shadow: false,
			background: "rgba(0,0,0,0)",
		},
		seriesColors: seriescolors,
		legend: {
			show: true,
			location: "e",
			placement: "outside",
			labels: datalabel,
		},
	};

	// 作成実行
	$("#product-qa" + qaNo + "-chart").show();
	$.jqplot("product-qa" + qaNo + "-chart", chartdata, option);

	// jqplotとscanのバグ対応　隠しグラフ
	$("#product-hdn-chart").show();
	$.jqplot(
		"product-hdn-chart",
		[
			["hdn1", 0],
			["hdn2", 0],
		],
		{
			seriesDefaults: {
				renderer: $.jqplot.PieRenderer,
				rendererOptions: {
					showDataLabels: false,
					padding: 10,
				},
			},
			height: 1,
			width: 1,
			legend: { show: false, location: "e" },
		}
	);
	//グラフに必須の要素以外はremoveしておく
	$("#product-hdn-chart .jqplot-series-shadowCanvas").remove();
	$("#product-hdn-chart .jqplot-grid-canvas").remove();
	$("#product-hdn-chart .jqplot-base-canvas").remove();
	$("#product-hdn-chart .jqplot-event-canvas").remove();
	$("#product-hdn-chart .jqplot-pieRenderer-highlight-canvas").remove();
}
