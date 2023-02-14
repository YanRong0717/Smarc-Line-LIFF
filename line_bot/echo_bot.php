<?php

/**
 * 此範例 GitHub 專案：https://github.com/GoneToneStudio/line-example-bot-tiny-php
 * 此範例教學文章：https://blog.reh.tw/archives/988
 * 官方文檔：https://developers.line.biz/en/reference/messaging-api/
 */

date_default_timezone_set("Asia/Taipei"); //設定時區為台北時區
require_once 'LINEBotTiny.php';

$message = null;
$event = null;

// $date = new DateTime();

$look_data = file_get_contents("look_data.json");
// Converts to an array
$look_data_arr = json_decode($look_data, true);
// $show_date = $date->format('Y-m-d H:i:s');
// echo $show_date;

// print_r($look_data_arr['contents']['body']['contents'][3]['contents'][1]['text']);
// $look_data_arr['contents']['body']['contents'][3]['contents'][1]['text'] = $show_date;

// die();
$client = new LINEBotTiny($channelAccessToken, $channelSecret);
foreach ($client->parseEvents() as $event) {
    $userId = $event['source']['userId'];

    switch ($event['type']) {
        case 'beacon': //postback 觸發
            $client->replyMessage(array(
                'replyToken' => $event['replyToken'],
                'messages' => array(
                    $look_data_arr,
                ),
            ));
            break;

        case 'message': //訊息觸發
            $message = $event['message'];
            switch ($message['type']) {
                case 'text': //訊息為文字
                    $client->replyMessage([
                        'replyToken' => $event['replyToken'],
                        'messages' => array(
                            $look_data_arr,
                        ),
                    ]);
                    break;
                default:
                    //error_log("Unsupporeted message type: " . $message['type']);
                    break;
            }
            break;

        case 'postback': //postback 觸發
            //require_once('postback.php'); //postback
            break;

        case 'follow': //加為好友觸發
            $client->replyMessage(array(
                'replyToken' => $event['replyToken'],
                'messages' => array(
                    $look_data_arr,
                ),
            ));
            break;

        case 'join': //加入群組觸發
            $client->replyMessage(array(
                'replyToken' => $event['replyToken'],
                'messages' => array(
                    $look_data_arr,
                ),
            ));
            break;
        default:
            //error_log("Unsupporeted event type: " . $event['type']);
            break;
    }
}
