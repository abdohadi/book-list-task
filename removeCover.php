<?php 

if (isset($_POST) && ! empty($_POST)) {
	if (file_exists($cover_path = $_POST['cover'])) {
		unlink($cover_path);		
	}
} else {
	header('LOCATION: /');
}