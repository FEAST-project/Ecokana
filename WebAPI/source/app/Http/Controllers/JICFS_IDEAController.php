<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\JICFS_IDEA;

class JICFS_IDEAController extends Controller
{
  // 商品一覧ページ表示：DBよりJICFS_IDEAテーブルの製品件数を取得
  public function showPages()
  {
    // 取得した値をreturn
    return JICFS_IDEA::where('JICFS分類', $_POST["code"])
      ->count();
  }



}
