<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\JICFS_IDEA_add;
use DB;

class JICFS_IDEA_addController extends Controller
{

  // JICFS商品一覧上位10%取得
  public function get10()
  {
    // 表示対象件数をカウント
    $cnt = JICFS_IDEA_add::
           where('JICFS分類', $_POST["code"])
           ->count();

    // 小数点以下は切り捨て
    $cnt = floor($cnt / 10);

    // 表示対象件数の総合スコア上位10%目にあたるスコアをreturn
    return JICFS_IDEA_add::
      where('JICFS分類', $_POST["code"])
      ->orderByRaw('補正総合スコア DESC')
      ->offset($cnt - 1)
      ->take(1)
      ->get(['Product_ID','補正総合スコア']);
  }



  public function showList()
  {
    // 取得した値をreturn
    return JICFS_IDEA_add::leftJoin('JICFS_IDEA', 'JICFS_IDEA_add.Product_ID', '=', 'JICFS_IDEA.Product_ID')
      ->where('JICFS_IDEA_add.JICFS分類', $_POST["code"])
      ->orderByRaw($_POST["sort"])
      ->skip($_POST["pageFrom"])
      ->take($_POST["cnt"])
      ->get(['JICFS_IDEA_add.Product_ID', '補正環境評価', '補正社会評価', '補正健康評価', '補正総合スコア', '伝票用商品名称(漢字)', '表示用規格(カナ)']);
  }



  // 商品ページ：DBよりJANコードで検索し、Poduct_IDでJICFS_IDEAテーブルをjoinして1レコードを取得(SCAN)
  public function SCAN_showProduct()
  {
    // 取得した値をreturn
    return JICFS_IDEA_add::leftJoin('JICFS_IDEA', 'JICFS_IDEA_add.Product_ID', '=', 'JICFS_IDEA.Product_ID')
      ->where('JICFS_IDEA_add.JANコード', $_POST["id"])
      ->get();
  }



  // 商品ページ：DBよりProduct_IDでJICFS_IDEAテーブルをjoinして1レコードを取得
  public function showProduct()
  {
    // 取得した値をreturn
    return JICFS_IDEA_add::leftJoin('JICFS_IDEA', 'JICFS_IDEA_add.Product_ID', '=', 'JICFS_IDEA.Product_ID')
      ->where('JICFS_IDEA_add.Product_ID', $_POST["id"])
      ->get();
  }



  // アンケート回答時にJICFS_IDEA_addテーブルを更新
  public function editScore()
  {
    DB::update('
		UPDATE  
			JICFS_IDEA_add T1,
			(
			SELECT 
				T2.`Product_ID`,
				LEAST(
					(T2.`環境評価` 
					+ CASE WHEN T3.`回答1-1` /  NULLIF((T3.`回答1-1` + T3.`回答1-2` + T3.`回答1-3`),0) >= 0.5 THEN 0.5 ELSE 0 END
					+ CASE WHEN T3.`回答4-1` /  NULLIF((T3.`回答4-1` + T3.`回答4-2`),0) >= 0.5                THEN 0.5 ELSE 0 END
					+ CASE WHEN T3.`回答5-1` /  NULLIF((T3.`回答5-1` + T3.`回答5-2`),0) >= 0.5                THEN 0.5 ELSE 0 END)
					,5) AS envScore,
				LEAST(
					(T2.`社会評価` 
					+ CASE WHEN T3.`回答3-1` /  NULLIF((T3.`回答3-1` + T3.`回答3-2`),0) >= 0.5                THEN 0.5 ELSE 0 END
					+ CASE WHEN T3.`回答7-3` /  NULLIF((T3.`回答7-1` + T3.`回答7-2` + T3.`回答7-3`),0) >= 0.5 THEN 0.5 ELSE 0 END
					+ CASE WHEN T3.`回答8-6` >= 1                                                             THEN 0.5 ELSE 0 END)
					,5) AS socScore,
				LEAST(
					(T2.`健康評価` 
					+ CASE WHEN T3.`回答9-2` /  NULLIF((T3.`回答9-1` + T3.`回答9-2`),0) >= 0.5                THEN 0.5 ELSE 0 END
					+ CASE WHEN T3.`回答2-1` /  NULLIF((T3.`回答2-1` + T3.`回答2-2`),0) >= 0.5                THEN 0.5 ELSE 0 END
					+ CASE WHEN T3.`回答6-1` /  NULLIF((T3.`回答6-1` + T3.`回答6-2`),0) >= 0.5                THEN 0.5 ELSE 0 END)
					,5) AS helScore,
				(T3.`回答1-1` + T3.`回答1-2` + T3.`回答1-3` + T3.`回答2-1` + T3.`回答2-2` + T3.`回答3-1` + T3.`回答3-2` + 
				T3.`回答4-1` + T3.`回答4-2` + T3.`回答5-1` + T3.`回答5-2` + T3.`回答6-1` + T3.`回答6-2` + 
				T3.`回答7-1` + T3.`回答7-2` + T3.`回答7-3` + T3.`回答8-1` + T3.`回答8-2` + T3.`回答8-3` + T3.`回答8-4` + T3.`回答8-5` + T3.`回答8-6` + 
				T3.`回答9-1` + T3.`回答9-2` ) AS ansTotal
			FROM
				JICFS_IDEA T2
			LEFT JOIN  `JICFS_IDEA_questionnaire` T3
			ON T2.`Product_ID` = T3.`Product_ID`
			) T4
		SET
			T1.`補正環境評価` = T4.envScore,
			T1.`補正社会評価` = T4.socScore,
			T1.`補正健康評価` = T4.helScore,
			T1.`補正総合スコア` = 
				CASE WHEN T4.ansTotal = 0  
					 THEN NULLIF((T4.envScore + T4.socScore),0) / 2 
					 ELSE NULLIF((T4.envScore + T4.socScore + T4.helScore),0) / 3 END	

		WHERE
			T1.`Product_ID` = T4.`Product_ID`
		AND T1.`Product_ID` = ?'
	,  [$_POST["id"]]);


    // 更新後のスコアをreturn
    return JICFS_IDEA_add::where('Product_ID', $_POST["id"])
      ->get();
  }



}