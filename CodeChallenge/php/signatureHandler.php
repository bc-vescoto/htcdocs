<?php
require_once 'signature.php';

if ( isset($_POST['functionname'])) {
  if (isset($_POST['request_path'])) {
    $request_path = $_POST['request_path'];
  }
  if (isset($_POST['request_body'])) {
    $request_body = $_POST['request_body'];
  }
  if (isset($_POST['expires'])) {
    $expires = $_POST['expires'];
  }
  $HTTP_method = "PATCH";
  $secret_key = "NvQXJmhKnmbMSdYr6BbQ3aQBYmYiiaHA7yGaOEgi";
  $request_body = '{'.'"name":"'.$request_body.'"'.'}';
  $api_key = "JieGwyOuGE7Wr6OIXITt8UFHcTpF.zKp7X";
  $expires = time()+15;
  $parameters["api_key"] = $api_key;
  $parameters["expires"] = $expires;

  $myOoyalaAPI = new OoyalaAPI();
  $result = $myOoyalaAPI->send_title($HTTP_method, $api_key, $secret_key, $expires, $request_path, $request_body, $parameters=array());
  echo $result;
}
 ?>
