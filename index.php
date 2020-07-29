<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Book-List Task</title>

	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
	<h1 class="text-center">Book <span class="custom_text-primary">List</span></h1>

	<div class="container">
		<div class="col-lg-8 mx-auto custom_form-section">
			<h3 class="custom_form-heading">Add List</h3>

			<form class="custom_url-form" id="url-form">
				<div class="row">
					<div class="col-md-9 m-auto d-flex">
						<input type="text" name="url" placeholder="Enter List URL" class="form-control" id="url-input">
						<input type="submit" value="Add List" class="form-control col-md-6 mx-auto custom_bg-primary my-0 ml-1 ml-2">
					</div>
				</div>
			</form>

			<h3 class="custom_or text-center">OR</h3>

			<h3 class="custom_form-heading">Add Book To List</h3>

			<form class="custom_book-form" id="book-form" enctype="multipart/form-data">
				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label for="name">Name</label>
							<input type="text" name="name" class="form-control">
						</div>
					</div>

					<div class="col-md-6">
						<div class="form-group">
							<label for="author">Author</label>
							<input type="text" name="author" class="form-control">
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label for="date">Release Date</label>
							<input type="date" name="release_date" class="form-control">
						</div>
					</div>

					<div class="col-md-6">
						<div class="form-group">
							<label for="cover">Cover</label>
							<input type="file" name="cover" class="form-control-file">
						</div>
					</div>
				</div>

				<input type="submit" value="Add Book" class="form-control col-md-6 mx-auto custom_bg-primary">
			</form>
		</div>

		<div class="custom_sort-search-section">
			<div class="row custom_sort-search-container">
				<div class="col-md-7">
					<form class="custom_search-form" id="search-form">
						<input type="text" placeholder="Search by Book Name or Author" class="form-control" id="search-input">
						<button><img src="icons/search-icon.png" alt="Search"></button>
					</form>
				</div>

				<div class="col-md-5">
					<div class="custom_sort-section">
						<div class="custom_sort-by">Sort By </div>
						<select name="sort_by" class="form-control" id="sort-by">
							<option value="" selected="">...</option>
							<option value="name">Name</option>
							<option value="author">Author</option>
							<option value="release_date">Release Date</option>
						</select>
					</div>
				</div>
			</div>
		</div>

		<table class="table table-hover custom_book-table text-center" id="book-table">
			<thead class="thead-dark">
				<tr>
					<th scope="col">Cover</th>
					<th scope="col">Name</th>
					<th scope="col">Author</th>
					<th scope="col">Release Date</th>
					<th scope="col">Action</th>
				</tr>
			</thead>

			<tbody>
				
			</tbody>
		</table>
	</div>


	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/script.js"></script>
</body>
</html>