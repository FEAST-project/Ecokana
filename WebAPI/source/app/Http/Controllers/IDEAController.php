<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\IDEA;

class IDEAController extends Controller
{

  // 商品一覧上位10%取得
  public function get10()
  {

    $cnt = 0;
    if ($_POST["namejp2"] != "") {
      // 表示対象件数をカウント
      $cnt =  IDEA::where('漢字分類名', $_POST["namejp1"])
                  ->orWhere('漢字分類名', $_POST["namejp2"])
                  ->count();

      // 小数点以下は切り捨て
      $cnt = floor($cnt / 10);

      // 表示対象件数の総合スコア上位10%目にあたるスコアをreturn
      return DB::table('IDEA')->select(DB::raw("Product_ID,  (`環境評価` + `健康評価`)/2 AS 補正総合スコア"))
                              ->where('漢字分類名', $_POST["namejp1"])
                              ->orWhere('漢字分類名', $_POST["namejp2"])
                              ->orderByRaw('補正総合スコア DESC')
                              ->offset($cnt - 1)
                              ->take(1)
                              ->get(['Product_ID','補正総合スコア']);
    } else {
      // 表示対象件数をカウント
      $cnt =  IDEA::where('漢字分類名', $_POST["namejp1"])
                  ->count();

      // 小数点以下は切り捨て
      $cnt = floor($cnt / 10);

      // 表示対象件数の総合スコア上位10%目にあたるスコアをreturn
      return DB::table('IDEA')->select(DB::raw("Product_ID,  (`環境評価` + `健康評価`)/2 AS 補正総合スコア"))
                              ->where('漢字分類名', $_POST["namejp1"])
                              ->orderByRaw('補正総合スコア DESC')
                              ->offset($cnt - 1)
                              ->take(1)
                              ->get(['Product_ID','補正総合スコア']);
    }
  }



  // 商品一覧：DBよりIDEAテーブルの製品一覧を取得
  public function showList()
  {
    // 取得した値をreturn
    if ($_POST["namejp2"] != "") {
      return DB::table('IDEA')->select(DB::raw("Product_ID, 環境評価, 社会評価, 健康評価, (`環境評価` + `健康評価`)/2 AS 補正総合スコア, `肉・国産/輸入の別`, 野菜・産地, 野菜・季節, 魚・水揚げ地, 魚・生産方法, 製品名"))
        ->where('漢字分類名', $_POST["namejp1"])
        ->orWhere('漢字分類名', $_POST["namejp2"])
        ->orderByRaw($_POST["sort"])
        ->get(['Product_ID', '環境評価', '社会評価', '健康評価', '補正総合スコア', '肉・国産/輸入の別', '野菜・産地', '野菜・季節', '魚・水揚げ地', '魚・生産方法', '製品名']);
    } else {
      return DB::table('IDEA')->select(DB::raw("Product_ID, 環境評価, 社会評価, 健康評価, (`環境評価` + `健康評価`)/2 AS 補正総合スコア, `肉・国産/輸入の別`, 野菜・産地, 野菜・季節, 魚・水揚げ地, 魚・生産方法, 製品名"))
        ->where('漢字分類名', $_POST["namejp1"])
        ->orderByRaw($_POST["sort"])
        ->get(['Product_ID', '環境評価', '社会評価', '健康評価', '補正総合スコア', '肉・国産/輸入の別', '野菜・産地', '野菜・季節', '魚・水揚げ地', '魚・生産方法', '製品名']);
    }
  }



  // 商品ページ：DBよりIDEAテーブルの1レコードを取得
  public function showProduct()
  {
    // 取得した値をreturn
    //return IDEA::where('Product_ID', $_POST["id"])
    //  ->get();

    return DB::table('IDEA')->select(DB::raw("*, (`環境評価` + `健康評価`)/2 AS 補正総合スコア"))
      ->where('Product_ID', $_POST["id"])
      ->get();
  }



}
