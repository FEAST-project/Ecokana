<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\IDEA_questionnaire;

class IDEA_questionnaireController extends Controller
{
  public function showQA()
  {
    // IDEA_questionnaireテーブルを更新
    IDEA_questionnaire::where('Product_ID', $_POST["id"])
      ->increment(urldecode($_POST["target"]));

    // 更新後のレコードをreturn
    return IDEA_questionnaire::where('Product_ID', $_POST["id"])
      ->get();
  }



  public function requestInfo()
  {
    // 情報リクエストを加算
    IDEA_questionnaire::where('Product_ID', $_POST["id"])
      ->increment('情報リクエスト');
  }



  public function countView()
  {
    // 閲覧回数を加算
    IDEA_questionnaire::where('Product_ID', $_POST["id"])
      ->increment('閲覧回数');
  }



  public function getQuestionnaire()
  {
    // アンケート情報取得 レコードをreturn
    return IDEA_questionnaire::where('Product_ID', $_POST["id"])
      ->get();
  }



}
