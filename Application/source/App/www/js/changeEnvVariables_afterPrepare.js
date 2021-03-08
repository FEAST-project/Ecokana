// config.xmlパラメータ読み込み
// this plugin replaces arbitrary text in arbitrary files
//
// Look for the string CONFIGURE HERE for areas that need configuration
//
module.exports = function (context) {
	var ConfigParser = context.requireCordovaModule("cordova-common")
		.ConfigParser;
	var cfg = new ConfigParser("config.xml");
	var fs = require("fs");
	var path = require("path");
	var rootdir = process.argv[2];
	function replace_string_in_file(filename, to_replace, replace_with) {
		var data = fs.readFileSync(filename, "utf8");
		var result = data.replace(to_replace, replace_with);
		fs.writeFileSync(filename, result, "utf8");
		console.log(to_replace, replace_with);
	}
	var target = "test"; // ターゲットのデフォルト値 ＊変更不要
	target = cfg.getPreference("targetAPI"); // "targetAPI"要素を取得

	// "targetAPI"をスクリプトに反映
	if (rootdir) {
		// CONFIGURE HERE
		// with the names of the files that contain tokens you want
		// replaced. Replace files that have been copied via the prepare step.

		// 反映対象スクリプトを指定
		var filestoreplace = [
			"../platforms/ios/www/js/common.js",
			"../platforms/android/app/src/main/assets/www/js/common.js",
		];

		filestoreplace.forEach(function (val, index, array) {
			var fullfilename = path.join(rootdir, val);
			if (fs.existsSync(fullfilename)) {
				// CONFIGURE HERE
				// with the names of the token values. For example,
				// below we are looking for the token
				// /*REP*/ 'api.example.com' /*REP*/ and will replace
				// that token

				// スクリプト中の文字列"api_server"を取得した"targetAPI"に置換
				replace_string_in_file(fullfilename, "api_server", target);
			} else {
				// console.log("missing: "+fullfilename);
			}
		});
	}
};
