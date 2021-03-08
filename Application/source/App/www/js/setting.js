/* 設定関連 */

/****************************** ファイル保存前処理 ******************************/
// 各種カウンタ保存処理
//// target:加算対象
function addCount(target) {
	// 回数を+1し、カウンタ管理ファイルに保存する
	switch (target) {
		case "startUp":
			window.counter.startUp = parseInt(window.counter.startUp) + 1;
			break;
		case "toHome":
			window.counter.toHome = parseInt(window.counter.toHome) + 1;
			break;
		case "footer":
			window.counter.footer = parseInt(window.counter.footer) + 1;
			break;
		default:
			break;
	}
	saveSettings("counter.json");
}

// 表示言語保存処理
// language:jp/en
function saveLanguage(language) {
	// 変数に反映し、設定ファイルに保存する
	window.settings.language = language;
	saveSettings("settings.json");
	// 言語切り替え処理
	changeLanguage();
}

//言語切り替え処理
function changeLanguage() {
	// 初期値は日本語
	if (typeof window.settings.language === "undefined") {
		window.settings.language = "jp";
	}

	// 切り替え処理
	if (window.settings.language == "jp") {
		$(".en").each(function () {
			$(this).hide();
		});
		$(".jp").each(function () {
			$(this).show();
		});
	} else {
		$(".jp").each(function () {
			$(this).hide();
		});
		$(".en").each(function () {
			$(this).show();
		});
	}
}

// 設定適用ボタン押下時処理
// importance: 選択された重要度(環境、社会、健康)
function saveImportance() {
	// 設定ファイルに保存する
	saveSettings("settings.json");

	// 1つ前の画面（ホーム画面）に戻る
	navi.popPage({ animation: "slide" });
}

/****************************** ファイル保存処理 ******************************/
// ファイルを保存する
//// settingsFileName:保存ファイル名
//// history:保存する履歴
//// deleteFlg:履歴削除フラグ
function saveSettings(settingsFileName, history, deleteFlg) {
	// 設定データをJSONフォーマットの文字列に変換
	var jsonData = null;
	switch (settingsFileName) {
		case "counter.json":
			// 各種カウンタを変換
			jsonData = JSON.stringify(window.counter);
			break;
		case "settings.json":
			// 重要度・言語設定を変換
			jsonData = JSON.stringify(window.settings);
			break;
		default:
			break;
	}

	// 保存する履歴（表示した商品情報）を保持
	var addHistory = history;

	// ファイル保存実行
	// dataDirectoryフォルダのDirectoryEntryオブジェクトを取得
	window.resolveLocalFileSystemURL(
		cordova.file.dataDirectory,
		// （第2引数）成功したら呼び出される関数 ファイルを作成しデータを書き込む
		function success1(directoryEntry) {
			//console.log("saveSettings():resolveLocalFileSystemURI Success: "
			//            + directoryEntry.nativeURL);

			// settingsFileNameファイルを取得（存在しないときは作成）
			directoryEntry.getFile(
				settingsFileName,
				{ create: true },
				// （getFileの第3引数）成功したら呼び出される関数
				function success2(fileEntry) {
					//console.log("saveSettings():directoryEntry.getFile Success: "
					//                + fileEntry.nativeURL);

					// FileWriterオブジェクトを作成
					fileEntry.createWriter(
						// （第1引数）成功したら呼び出される関数
						function success3(fileWriter) {
							//console.log("saveSettings():fileEntry.createWriter Success: "
							//            + fileWriter.localURL);

							// データ書き込み後のハンドラーをセット
							fileWriter.onwriteend = function (e) {
								//console.log('Write of file "' + settingsFileName + '" completed.');
							};
							// データ書き込み失敗時のハンドラーをセット
							fileWriter.onerror = function (e) {
								//console.log('Write failed: ' + e.toString());
							};

							// 保存内容編集
							switch (settingsFileName) {
								case "counter.json":
									// カウンタ管理ファイル
									// データを上書き
									fileWriter.write(jsonData);
									break;
								case "settings.json":
									// 重要度・言語設定ファイル
									// データを上書き
									fileWriter.write(jsonData);
									break;
								case "history.txt":
									if (deleteFlg) {
										// 削除の場合は空文字で上書き
										fileWriter.write("");
										// ダイアログを表示
										navigator.notification.alert(
											"これまでの検索履歴を消去しました。",
											null,
											""
										);
									} else {
										// 追記の場合は履歴ファイルの末尾に追記
										try {
											fileWriter.seek(fileWriter.length);
										} catch (e) {
											//console.log("file doesn't exist!");
										}
										fileWriter.write(addHistory);
									}
									break;
								default:
									break;
							}
						},
						// （第2引数）失敗したら呼び出される関数
						function fail(error) {
							//console.log("saveSettings():fileEntry.createWriter Error: "
							//           + error.code);
						}
					);
				},
				// （getFileの第4引数）失敗したら呼び出される関数
				function fail(error) {
					//console.log("saveSettings():directoryEntry.getFile Error: "
					//                + error.code);
				}
			);
		},

		// （第3引数）失敗したら呼び出される関数
		function fail(error) {
			console.log(
				"saveSettings():resolveLocalFileSystemURI Error: " + error.code
			);
		}
	);
}

/****************************** ファイル読み込み処理 ******************************/
// ファイルを読み込む
//// settingsFileName:読み込みファイル名
function loadSettings(settingsFileName) {
	// 設定ファイルへのパス
	var urlToFile = cordova.file.dataDirectory + settingsFileName;

	// 設定ファイルのFileEntryオブジェクトを取得
	window.resolveLocalFileSystemURL(
		urlToFile,
		// （第2引数）成功したら呼び出される関数
		function success1(fileEntry) {
			//console.log("loadSettings():resolveLocalFileSystemURL Success: "
			//            + fileEntry.nativeURL);
			// Fileオブジェクトを取得
			fileEntry.file(
				// （fileメソッドの第1引数）成功したら呼び出される関数
				function success2(file) {
					// FileReaderオブジェクトを作成
					var reader = new FileReader();

					// ファイル読み込み後の処理を指定
					reader.onloadend = function (e) {
						//console.log("read success: " + e.target.result);
						// ファイルの内容（JSON）を復元してsettingsオブジェクトに格納
						if (settingsFileName == "counter.json") {
							// カウンタ管理ファイル
							// 変数に保持
							window.counter = JSON.parse(e.target.result);
						} else if (settingsFileName == "settings.json") {
							// 重要度・言語設定ファイル
							// 変数に保持
							window.settings = JSON.parse(e.target.result);
							// 言語切り替え処理用の関数読み出し
							// ※ここで直接言語切り替え処理を行うと失敗するため。原因不明
							dosome();
						} else {
							// 履歴ファイル
							// デバッグ用ダイアログ表示
							navigator.notification.alert(
								"履歴ファイル：" + e.target.result,
								null,
								""
							);
						}
					};

					// ファイル読み込みを実行
					reader.readAsText(file);
				},
				// （第2引数）失敗したら呼び出される関数
				function fail(error) {
					//console.log("loadSettings():fileEntry.file Error: " + error.code);
				}
			);
		},
		// （第3引数）失敗したら呼び出される関数
		function fail(error) {
			//console.log("loadSettings():resolveLocalFileSystemURL Error: "
			//            + error.code);
		}
	);
}

// 言語切り替え処理用の関数
function dosome() {
	changeLanguage();
}

/****************************** 設定画面編集 ******************************/
// 設定画面1を描画
function drawSetting_1() {
	switch (window.settings.importanceEnv) {
		case "1":
			$(".setting-env .font-small .jp").text("重要ではない");
			$(".setting-env .font-small .en").text("Not important");
			break;
		case "2":
			$(".setting-env .font-small .jp").text("重要");
			$(".setting-env .font-small .en").text("Important");
			break;
		case "3":
			$(".setting-env .font-small .jp").text("非常に重要");
			$(".setting-env .font-small .en").text("Very important");
			break;
	}
	switch (window.settings.importanceSoc) {
		case "1":
			$(".setting-soc .font-small .jp").text("重要ではない");
			$(".setting-soc .font-small .en").text("Not important");
			break;
		case "2":
			$(".setting-soc .font-small .jp").text("重要");
			$(".setting-soc .font-small .en").text("Important");
			break;
		case "3":
			$(".setting-soc .font-small .jp").text("非常に重要");
			$(".setting-soc .font-small .en").text("Very important");
			break;
	}
	switch (window.settings.importanceHel) {
		case "1":
			$(".setting-hel .font-small .jp").text("重要ではない");
			$(".setting-hel .font-small .en").text("Not important");
			break;
		case "2":
			$(".setting-hel .font-small .jp").text("重要");
			$(".setting-hel .font-small .en").text("Important");
			break;
		case "3":
			$(".setting-hel .font-small .jp").text("非常に重要");
			$(".setting-hel .font-small .en").text("Very important");
			break;
	}

	// デバッグ用ボタン表示切り替え
	if (window.api_type != "test") {
		$(".setting-debugHis").remove();
		$(".setting-resetCounter").remove();
	}
}

// 設定画面2を描画
// type:設定対象 env/soc/hel
function drawSetting_2(type) {
	// 設定対象を保持
	$("#setting_2-type").attr("value", type);

	// 選択時チェックアイコンを一旦リセット
	$(".setting_2-fa-icon ons-icon").parent().prev().css({ color: "#808080" });
	$(".setting_2-fa-icon ons-icon").remove();

	// 設定に応じて選択時チェックアイコンを配置
	switch (type) {
		case "env":
			$(".setting-title2jp").last().text("環境");
			$(".setting-title2en").last().text("The Environmental Impacts");
			switch (window.settings.importanceEnv) {
				case "1":
					$(".setting-imp1 .setting_2-fa-icon")
						.last()
						.append('<ons-icon icon="check">');
					break;
				case "2":
					$(".setting-imp2 .setting_2-fa-icon")
						.last()
						.append('<ons-icon icon="check">');
					break;
				case "3":
					$(".setting-imp3 .setting_2-fa-icon")
						.last()
						.append('<ons-icon icon="check">');
					break;
			}
			break;
		case "soc":
			$(".setting-title2jp").last().text("社会");
			$(".setting-title2en").last().text("The Social Impacts");
			switch (window.settings.importanceSoc) {
				case "1":
					$(".setting-imp1 .setting_2-fa-icon")
						.last()
						.append('<ons-icon icon="check">');
					break;
				case "2":
					$(".setting-imp2 .setting_2-fa-icon")
						.last()
						.append('<ons-icon icon="check">');
					break;
				case "3":
					$(".setting-imp3 .setting_2-fa-icon")
						.last()
						.append('<ons-icon icon="check">');
					break;
			}
			break;
		case "hel":
			$(".setting-title2jp").last().text("健康");
			$(".setting-title2en").last().text("The Public Health Impacts");
			switch (window.settings.importanceHel) {
				case "1":
					$(".setting-imp1 .setting_2-fa-icon")
						.last()
						.append('<ons-icon icon="check">');
					break;
				case "2":
					$(".setting-imp2 .setting_2-fa-icon")
						.last()
						.append('<ons-icon icon="check">');
					break;
				case "3":
					$(".setting-imp3 .setting_2-fa-icon")
						.last()
						.append('<ons-icon icon="check">');
					break;
			}
			break;
	}

	// 選択時チェックアイコンの色を指定
	$(".setting_2-fa-icon ons-icon").parent().prev().css({ color: "#52a095" });
}

// 設定画面2＿重要度切り替え処理
// btn:選択されたボタン1~3
function changeImportance(btn) {
	// 設定対象を取得
	var targetType = $("#setting_2-type").attr("value");

	// 選択されたボタンを取得
	var afterParam = "";
	switch (btn) {
		case 1:
			afterParam = "1";
			break;
		case 2:
			afterParam = "2";
			break;
		case 3:
			afterParam = "3";
			break;
	}

	// 重要度設定変数にセット
	switch (targetType) {
		case "env":
			window.settings.importanceEnv = afterParam;
			break;
		case "soc":
			window.settings.importanceSoc = afterParam;
			break;
		case "hel":
			window.settings.importanceHel = afterParam;
			break;
	}

	// 設定画面2を再描画
	drawSetting_2(targetType);
}

// 重要度初期化処理
function clearImportance() {
	window.settings.importanceEnv = "1";
	window.settings.importanceSoc = "1";
	window.settings.importanceHel = "1";

	// 設定画面1を再描画
	drawSetting_1();
}
