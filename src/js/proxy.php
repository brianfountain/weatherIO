<?php
// File Name: proxy.php
// Bri's cookbook
$api_key = '503d1a670aacb46ca5bfd8470e2fd18b';


$API_ENDPOINT = 'https://api.forecast.io/forecast/';
$url = $API_ENDPOINT . $api_key . '/';

if(!isset($_GET['url'])) die();
$url = $url . $_GET['url'];
$url = file_get_contents($url);

print_r($url);
