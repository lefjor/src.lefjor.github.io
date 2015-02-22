<?php
require("HTTPPost.php");

// input xml data
$xml="<?xml version=\"1.0\" encoding=\"iso-8859-1\"?> <departments><department><departmentName>R&amp;D</departmentName> <person> <name>John Schmidt</name> ";
$xml=$xml . "<address>Red street 3</address> <status>A</status> </person> <person> <name>Paul Bones</name> <address>White street 5</address> <status>A</status> ";
$xml=$xml . "</person> <person> <name>Mark Mayer</name> <address>Blue street 5</address> <status>A</status> </person> <person> <name>Janet Black</name> ";
$xml=$xml . "<address>Black street 8</address> <status>I</status> </person></department><department> <departmentName>Sales</departmentName> <person> ";
$xml=$xml . "<name>Juan Gomez</name> <address>Green street 3</address> <status>A</status> </person> <person> <name>Juliet Bones</name> <address>White street 5</address> ";
$xml=$xml . " <status>A</status> </person></department></departments>";

// make request to FOP server
$httppost=new HTTPPost();
$pdfdata=$httppost->post_request("localhost","8087","departmentEmployees.fo",$xml);

// save PDF output to a PDF file
$myFile = "testFile.pdf";
$fh = fopen($myFile, 'w') or die("can't open file");
fwrite($fh, $pdfdata);
fclose($fh);


?>