/* 情報リクエスト確定画面、情報リクエスト完了画面の描画 */

// 情報リクエスト確定画面の編集
//// type:画面タイプ（IDEA/JICFS）
//// code:商品コードなど
function drawRequest(type, code) {
	// Product_IDを保持
	$("#requestInfo-productID").attr("value", code);

	// 情報リクエスト確定ボタンに属性を追加
	if (type == "IDEA") {
		$(".requestInfo-request").attr(
			"onclick",
			"navi.pushPage('requestDone.html',{animation:'slide', data:{type:'IDEA',code: '" +
				code +
				"'}})"
		);
	} else {
		$(".requestInfo-request").attr(
			"onclick",
			"navi.pushPage('requestDone.html',{animation:'slide', data:{type:'JICFS',code: '" +
				code +
				"'}})"
		);
	}
}

// 情報リクエスト処理
//// ele:クリックされた要素
//// type：IDEA/JICFS,
function requestInfo(ele, type) {
	var data = {};
	if (type == "IDEA") {
		data = { type: "IDEA", code: $("#product-productID").attr("value") };
	} else {
		data = { type: "JICFS", code: $("#product-productID").attr("value") };
	}

	sendRequest("product_request", data);
}

// 情報リクエスト完了画面の戻るボタンイベント
function backFromRequestDone() {
	var navi = document.getElementById("navi");
	// 一つ前の画面（情報リクエスト確認画面）を削除して商品ページに戻る
	navi.pageLoader.unload(navi.pages[navi.pages.length - 2]);
	navi.popPage({ animation: "slide" });
}

// 商品ページの情報リクエストボタンを無効化, 情報リクエスト比率を再描画
function afterRequest() {
	$(".product-request").addClass("product-request-unable");
	$(".requestInfo-request").addClass("requestInfo-request-unable");
	drawRequestRatio($("#product-tempType").attr("value"));
}
