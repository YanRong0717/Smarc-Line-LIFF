<?php

$id_array_start = 0; //搜尋從ids中第幾個開始
$id_array_end = 5; //搜尋到ids中第幾個結束 ，或是下面會改成$ids的陣列長度，若要使用此行，則需把下面的第77行 $id_array_end = count($ids) 注解掉;

//-------------------------------------------------------------------------------------------------------------------------------------------------

set_time_limit(0); //設置運行時間為無上限
ini_set('memory_limit', '256M'); //調整記憶體上限

include "env.php";

$smarc_id = $_POST['smarc_id'];
$date = $_POST['date'];

$cmd = "get_user_ids";
$data = '';

$public_key = getPublicKey();
$curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -X POST %s';
$curl_cmd = sprintf($curl_cmd, $public_key, $cmd, addslashes($data), $url);

exec($curl_cmd, $output);
//--------------------------------------
$AA = str_replace('\'', "", $output[0]);
$BB = json_decode($AA);
$codee = $BB->code;
$dataaa = $BB->data;
$ids;

if ($codee == 500) {
    foreach ($dataaa as $value) {
        // print_r($value);
        $ids = explode(",", $value);
    }
    // print_r($ids);
}

$id_array_end = count($ids);
// print_r(count($ids));
//--------------------------------------

$num = 7; //要往回搜尋幾天
$smarc_id;

$QQ = "";
$result = array();

for ($i = $id_array_start; $i <= $id_array_end - 1; $i++) {

    $smarc_id = $ids[$i];
    $getDate = date("Y-m-d"); //當天日期
    // $getDate = "2020-07-13";
    $date = str_replace('-', '/', $getDate);
    $date = date('Y-m-d', strtotime($date . "+1 days")); //因為回圈內一開始先-1了

    for ($j = 1; $j <= $num; $j++) {
        $date = date('Y-m-d', strtotime($date . "-1 days"));
        $data = '{"smarc_id": ' . $smarc_id . ', "type": 1, "date":"' . $date . '"}';

        $cmd = "get_enote";

        $public_key = getPublicKey();
        $curl_cmd = 'curl -s -k -d "key=%s&cmd=%s&data=%s" -H "Content-Type: application/x-www-form-urlencoded" -X POST %s';
        $curl_cmd = sprintf($curl_cmd, $public_key, $cmd, addslashes($data), $url);

        exec($curl_cmd, $output);

        $QQ = str_replace('\'', "", $output[0]);
        $WW = json_decode($QQ);
        $code = $WW->code;

        if ($code == 600) {
            $this_one = array($smarc_id, $date, "Yes");
            array_push($result, $this_one);
        } else {
            $this_one = array($smarc_id, $date, "No");
            array_push($result, $this_one);
        }
        $output = "";
    }
}
// print_r($result);

//---------------------------------------------------
// https://www.mxp.tw/6852/
$csv_arr = array();
$csv_arr[] = array('smarc_id', 'date', 'result');

$filename = "Enote-" . date("Y-m-d") . ".csv";
//設定瀏覽器讀取此份資料為不快取，與解讀行為是下載 CSV 檔案
header('Pragma: no-cache');
header('Expires: 0');
header('Content-Disposition: attachment;filename="' . $filename . '";');
header('Content-Type: application/csv; charset=UTF-8');

for ($q = 0; $q < count($result); $q++) {
    //開始根據資料變數組裝後面的陣列資料
    $csv_arr[] = array($result[$q][0], $result[$q][1], $result[$q][2]);
}

//確保輸出內容符合 CSV 格式，定義下列方法來處理
function csvstr(array $fields): string
{
    $f = fopen('php://memory', 'r+');
    if (fputcsv($f, $fields) === false) {
        return false;
    }
    rewind($f);
    $csv_line = stream_get_contents($f);
    return rtrim($csv_line);
}

//正式循環輸出陣列內容
for ($k = 0; $k < count($csv_arr); $k++) {
    if ($k == 0) {
        //檔案標頭如果沒補上 UTF-8 BOM 資訊的話，Excel 會解讀錯誤，偏向輸出給程式觀看的檔案
        // echo "xEFxBBxBF";
    }
    //輸出符合規範的 CSV 字串以及斷行
    echo csvstr($csv_arr[$k]) . PHP_EOL;
}
//跑完這份檔案就會是下載一份完整的 CSV 檔案囉！

// print_r($output);
// echo json_encode($output);
