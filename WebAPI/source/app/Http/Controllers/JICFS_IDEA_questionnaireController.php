<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\JICFS_IDEA_questionnaire;


class JICFS_IDEA_questionnaireController extends Controller
{
  public function showQA()
  {
    // JICFS_IDEA_questionnaireテーブルを更新
    JICFS_IDEA_questionnaire::where('Product_ID', $_POST["id"])
      ->increment(urldecode($_POST["target"]));


    // 更新後のレコードをreturn
    return JICFS_IDEA_questionnaire::where('Product_ID', $_POST["id"])
      ->get();
  }



  public function requestInfo()
  {
    // 情報リクエストを加算
    JICFS_IDEA_questionnaire::where('Product_ID', $_POST["id"])
      ->increment('情報リクエスト');
  }



  public function countView()
  {
    // 閲覧回数を加算
    JICFS_IDEA_questionnaire::where('Product_ID', $_POST["id"])
      ->increment('閲覧回数');
  }



  public function getQuestionnaire()
  {
    // アンケート情報取得 レコードをreturn
    return JICFS_IDEA_questionnaire::where('Product_ID', $_POST["id"])
      ->get();
  }



}
