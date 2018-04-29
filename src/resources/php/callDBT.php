<?php

header("Content-Type: application/json");

include($_SERVER['DOCUMENT_ROOT'] . "/config.php");

if (empty($_POST['url']) || empty($_POST['parameters']))
	return false;

$url = $_POST['url'];
$parameters = $_POST['parameters'];

$request = $url . '?key=' . $_config_api_key;

foreach ($parameters as $key => $value) {
	$request .= '&' . $key . '=' . $value;
}

$response = file_get_contents($request);
echo $response;