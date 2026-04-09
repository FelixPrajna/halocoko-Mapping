<?php
session_start();

$lang = $_SESSION['lang'] ?? 'id';

$translations = [
    'id' => [
        'title' => 'Routing Motorist',
        'upload' => 'Upload File',
        'warehouse' => 'Gudang',
        'generate' => 'Generate Route',
        'motorist' => 'Motorist',
        'batch' => 'Batch',
        'stop' => 'Stop',
        'distance' => 'Jarak',
        'time' => 'Waktu',
        'break' => 'Istirahat',
        'fuel' => 'Bensin',
        'total' => 'TOTAL',
        'average' => 'Rata-rata per Motorist',
        'minute' => 'menit',
        'hour' => 'jam'
    ],
    'zh' => [
        'title' => '配送路线系统',
        'upload' => '上传文件',
        'warehouse' => '仓库',
        'generate' => '生成路线',
        'motorist' => '配送员',
        'batch' => '批次',
        'stop' => '站点',
        'distance' => '距离',
        'time' => '时间',
        'break' => '休息',
        'fuel' => '燃料',
        'total' => '总计',
        'average' => '每位配送员平均',
        'minute' => '分钟',
        'hour' => '小时'
    ]
];

function t($key){
    global $translations, $lang;
    return $translations[$lang][$key] ?? $key;
}
?>