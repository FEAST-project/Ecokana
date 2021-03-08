<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', function () {
    return view('welcome');
});

/***************************************************************************/

/* IDEA���ʰ������10%���� */
Route::get('/IDEA/get10', 'IDEAController@get10');
Route::post('/IDEA/get10', 'IDEAController@get10');

/* JICFS���ʰ������10%���� */
Route::get('/JICFS/get10', 'JICFS_IDEA_addController@get10');
Route::post('/JICFS/get10', 'JICFS_IDEA_addController@get10');

/***************************************************************************/

/* IDEA���ʰ���ɽ�� */
Route::get('/IDEA/product_list', 'IDEAController@showList');
Route::post('/IDEA/product_list', 'IDEAController@showList');

/* JICFS���ʰ����ڡ���ɽ�� */
Route::get('/JICFS/product_list_pages', 'JICFS_IDEAController@showPages');
Route::post('/JICFS/product_list_pages', 'JICFS_IDEAController@showPages');

/* JICFS���ʰ���ɽ�� */
Route::get('/JICFS/product_list', 'JICFS_IDEA_addController@showList');
Route::post('/JICFS/product_list', 'JICFS_IDEA_addController@showList');

/***************************************************************************/

/* IDEA����ɽ�� */
Route::get('/IDEA/product', 'IDEAController@showProduct');
Route::post('/IDEA/product', 'IDEAController@showProduct');

/*SCAN_JICFS_IDEA_add������Score�ˤ�뾦��ɽ�� */
Route::get('/SCAN/product', 'JICFS_IDEA_addController@SCAN_showProduct');
Route::post('/SCAN/product', 'JICFS_IDEA_addController@SCAN_showProduct');

/*JICFS_IDEA_add������Score�ˤ�뾦��ɽ�� */
Route::get('/JICFS/product', 'JICFS_IDEA_addController@showProduct');
Route::post('/JICFS/product', 'JICFS_IDEA_addController@showProduct');

/***************************************************************************/

/* IDEA���ʡ����󥱡��Ȳ��� */
Route::get('/IDEA/QA', 'IDEA_questionnaireController@showQA');
Route::post('/IDEA/QA', 'IDEA_questionnaireController@showQA');

/* JICFS���ʡ����󥱡��Ȳ��� */
Route::get('/JICFS/QA', 'JICFS_IDEA_questionnaireController@showQA');
Route::post('/JICFS/QA', 'JICFS_IDEA_questionnaireController@showQA');

/***************************************************************************/

/* IDEA���ʡ�����ꥯ������ */
Route::get('/IDEA/req', 'IDEA_questionnaireController@requestInfo');
Route::post('/IDEA/req', 'IDEA_questionnaireController@requestInfo');

/* JICFS���ʡ�����ꥯ������ */
Route::get('/JICFS/req', 'JICFS_IDEA_questionnaireController@requestInfo');
Route::post('/JICFS/req', 'JICFS_IDEA_questionnaireController@requestInfo');

/***************************************************************************/

/*JICFS_IDEA_add���󥱡��Ȳ����幹�� */
Route::get('/JICFS/editScore', 'JICFS_IDEA_addController@editScore');
Route::post('/JICFS/editScore', 'JICFS_IDEA_addController@editScore');

/***************************************************************************/

/* IDEA���ʡ�������� */
Route::get('/IDEA/countView', 'IDEA_questionnaireController@countView');
Route::post('/IDEA/countView', 'IDEA_questionnaireController@countView');

/* JICFS���ʡ�������� */
Route::get('/JICFS/countView', 'JICFS_IDEA_questionnaireController@countView');
Route::post('/JICFS/countView', 'JICFS_IDEA_questionnaireController@countView');

/***************************************************************************/

/* IDEA���ʡ����󥱡��Ⱦ������ */
Route::get('/IDEA/getQAReq', 'IDEA_questionnaireController@getQuestionnaire');
Route::post('/IDEA/getQAReq', 'IDEA_questionnaireController@getQuestionnaire');

/* JICFS���ʡ����󥱡��Ⱦ������ */
Route::get('/JICFS/getQAReq', 'JICFS_IDEA_questionnaireController@getQuestionnaire');
Route::post('/JICFS/getQAReq', 'JICFS_IDEA_questionnaireController@getQuestionnaire');

/***************************************************************************/

