<?php 

if ($_GET) {
	header("LOCATION: /");
}

$isError = true;
$message = 'The uploaded file must be an image';
$image_path = '';

if (isset($_FILES) && ! empty($_FILES)) {
	$file = $_FILES['cover'];
	$file_name_str = $file['name'];
	$file_name_arr = explode('.', $file_name_str);
	$tmp_name = $file['tmp_name'];
	
	$check_image = getimagesize($tmp_name);
	$ext = $file_name_arr[count($file_name_arr) - 1];
	$size = $file['size'];
	$new_file_name = md5(random_bytes(10)) . '.' . $ext;

	$allowed_ext = ['png', 'jpg', 'jpeg'];

	if ($check_image == false) {
		$message = 'The uploaded file must be an image';
	} else {
		if (! in_array($ext, $allowed_ext)) {
			$message = 'The image be of type {' . implode(', ', $allowed_ext) . '}';
		} else {
			if ($size > 1024 * 1024 * 3) {
				$message = 'The image size must be less than 3Mb';
			} else {
				move_uploaded_file($tmp_name, 'images/' . $new_file_name);
				$isError = false;
				$image_path = 'images/' . $new_file_name;
			}
		}
	}
}

echo json_encode([
	'error' => $isError,
	'message' => $message,
	'image_path' => $image_path
]);