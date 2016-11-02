<?php
// File Name: proxy.php
// gmail
$api_key = 'db32e54143f260bffaed8a970bfd6dd7';


$API_ENDPOINT = 'https://api.forecast.io/forecast/';
$url = $API_ENDPOINT . $api_key . '/';

if(!isset($_GET['url'])) die();
$url = $url . $_GET['url'];
$url = file_get_contents($url);

print_r($url);
