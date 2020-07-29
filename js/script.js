
//######## 	https://api.jsonbin.io/b/5f20050591806166284a87e5/1		// public bin 	##############

class Book {
	id;
	name;
	author;
	release_date;
	cover;

	constructor(book, id = null, cover = null) {
		this.id = id ? id : BookStorage.lastId() + 1;
		this.name = book.name;
		this.author = book.author;
		this.release_date = book.release_date;
		this.cover = cover ? cover : book.cover;
	}
}

class BookList {
	list = [];

	constructor(list) {
		this.list = list;
	}

	/*
	 * Searches for books by name or author using "Regular Expression"
	 */
	search(value) {
		let regex = RegExp(value, 'i');

		let matchedBooks = this.list.filter(book => {
			return regex.test(book.name) || regex.test(book.author);
		});

		return matchedBooks;
	}

	/*
	 * Sorts books by name, author or release_date
	 */
	sortBy(key) {
		if (key == '') {
			this.list.sort((a, b) => b.id - a.id);
		} else if (key == 'release_date') {
			this.list.sort((a, b) => {
				let objA = new Date(a.release_date);
				let dateA = objA.getTime();

				let objB = new Date(b.release_date);
				let dateB = objB.getTime();

			  	return dateA - dateB;
			});
		} else {
			this.list.sort((a, b) => {
				var varA = a[key].toUpperCase();
	  			var varB = b[key].toUpperCase();

				if (varA < varB) {
					return -1;
				}

				if (varA > varB) {
					return 1;
				}

				return 0;
			});
		}

		this.list.reverse();

		return this.list;
	}
}

class UI {
	/*
	 * Displays either a success or error message
	 */
	static displayMsg(type, text) {
		$('.msg').remove();
		$('body').append(`<div class="${type}-msg msg">${text}</div>`);
	}

	/*
	 * Redisplays books after sorting
	 */
	static redisplayBooks(sortedBooks) {
		$('#book-table tbody').html('');

		this.displayBooks(sortedBooks);
	}

	/*
	 * Add book/books to the table 
	 */
	static displayBooks(data) {
		data.forEach((book, index) => {
			this.prependToTable(book);
		});
	}

	/*
	 * Add book to the beginning of the books table
	 */
	static prependToTable(book) {
		let date = new Date(book.release_date);
		let releaseDate = date.toDateString();
		let row = `
			<tr>
				<td class="custom_img-td"><img src="${book.cover}"></td>
				<td><span>${book.name}</span></td>
				<td><span>${book.author}</span></td>
				<td><span class="custom_date">${releaseDate}</span></td>
				<td><span><button class="btn btn-danger remove-btn" data-id="${book.id}">Remove From List</button></span></td>
			</tr>
		`;

		$('#book-table tbody').prepend(row);
	}

	/*
	 * Remove book row from the books table
	 */
	static removeBook(el) {
		el.parentElement.parentElement.parentElement.remove();
	}

	/*
	 * Clear all inputs
	 */
	static clearInputs() {
		$('#search-input').val('');
		$('#sort-by').val('');
		$('#url-input').val('');
		let form = new Form($('#book-form'));
		form.clearInputs();
	}
}

class Form {
	element;
	data = {};

	constructor(form) {
		let formId = form[0].activeElement ? form[0].activeElement.form.id : form[0][0].form.id;
		this.element = $(`#${formId}`)[0];
		let formData = new FormData(this.element);

		formData.forEach((val, key) => {
			this.data[key] = val;
		});
	}

	/*
	 * Returns data which might be a url or book info depeding on the form
	 */
	getData() {
		return this.data.hasOwnProperty('url') ? this.data.url : this.data;
	}

	/*
	 * Returns cover in FormData object 
	 */
	getCover() {
		let formData = new FormData();
		formData.append('cover', this.getData().cover);

		return formData;
	}

	/*
	 * Checks if inputs are not empty
	 */
	checkInputs() {
		for (let item in this.data) {
			if (this.data[item] == '') {
				return false;
			}
		}

		return true;
	}

	/*
	 * Clears input fields
	 */
	clearInputs() {
		for (let input of this.element.elements) {
			if (input.type != 'submit') {
				input.value = '';
			}
		}
	}
}

class BookStorage {
	localStorage = window.localStorage;

	/*
	 * Stores books in local storage
	 */ 
	static add(data, cover = null) {
		let bookList = this.get();
		let lastAddedBooks = [];

		if (Array.isArray(data)) {
			data.forEach((item, index) => {
				let bookId = index + this.lastId() + 1;
				let book = new Book(item, bookId);

				lastAddedBooks.push(book);
				bookList.push(book);
			});
		} else {
			let book = new Book(data, null, cover);
			
			lastAddedBooks.push(book);
			bookList.push(book);
		}

		this.setNew(bookList);

		return lastAddedBooks;
	}

	/*
	 * Returns books array from local storage
	 */ 
	static get() {
		return localStorage.getItem('books') ? JSON.parse(localStorage.getItem('books')) : [];
	}

	/*
	 * Removes a book from local storage
	 */ 
	static remove(id) {
		let bookList = this.get();

		let index = bookList.findIndex((book) => {
			return book.id == id;
		});

		bookList.splice(index, 1);

		this.setNew(bookList);
	}

	/*
	 * Sets new 'books' storage
	 */
	static setNew(bookList) {
		localStorage.setItem('books', JSON.stringify(bookList));
	}

	/*
	 * Returns the last index of the book list
	 * Returns 0 if the storage is empty
	 */ 
	static lastId() {
		let list = this.get();

		return list.length === 0 ? -1 : list[list.length-1].id;
	}
}


$(function() {
	// Set things to default
	window.curSearchSortList = null;
	window.curSearchList = null;
	window.curSortList = null;
	UI.clearInputs();


	// Get books from the LocalStorage and display them to the DOM
	UI.displayBooks(BookStorage.get());


	// Event: Submit form to get list through url
	$('#url-form').on('submit', (e) => {
		e.preventDefault();

		let form = new Form($(this));

		if (form.checkInputs()) {
			// Get books list
			$.ajax({
				url: form.getData()
			})
			.done((books) => {
				if (books.length > 0) {
					// Add List to LocalStorage
					let lastAddedBooks = BookStorage.add(books);

					// Dispaly books to the DOM
					UI.displayBooks(lastAddedBooks);

					// Show success msg when adding books list
					UI.displayMsg('success', 'List added successfully');

					// Clear input fields
					form.clearInputs();
				}
			})
			.fail((error) => {
				if (error.responseJSON) {
					UI.displayMsg('error', error.responseJSON.message);
				} else {
					UI.displayMsg('error', 'Something went wrong. Please try again!');
				}
			});
		} else {
			// Show error msg if url input is empty
			UI.displayMsg('error', 'You need to provide a URL');
		}
	});


	// Event: Submit form to add book
	$('#book-form').on('submit', (e) => {
		e.preventDefault();

		let form = new Form($(this));

		if (form.checkInputs()) {
			// Send cover file to the backend
			$.ajax({
				url: 'storeCover.php',
				method: 'post',
				data: form.getCover(),
				processData: false,
				contentType: false
			})
			.done((response) => {
				response = JSON.parse(response);

				if (response.error) {
					// Show error msg
					UI.displayMsg('error', response.message);
				} else {
					// Add book to LocalStorage
					let lastAddedBook = BookStorage.add(form.getData(), response.image_path);

					// Display book to the DOM
					UI.displayBooks(lastAddedBook);

					// Show success msg
					UI.displayMsg('success', 'Book addedd successfully');

					// Clear input fields
					form.clearInputs();
				}
			});
		} else {
			// Show error msg if any input is empty
			UI.displayMsg('error', 'All fields are required');
		}
	});


	// Event: Press "Remove From List" btn to remove a book
	$(document).on('click', '.remove-btn', (e) => {
		e.preventDefault();

		// Remove book from LocalStorage
		BookStorage.remove(e.target.dataset.id);

		// Remove book from the DOM
		UI.removeBook(e.target);

		// Display success msg
		UI.displayMsg('success', 'Book removed from list successfully'); 
	});


	// Event: Submit search form
	$('#search-form').on('submit', (e) => {
		e.preventDefault();

		let searchValue = $(this).find('#search-input').val();
		let booksToSearch = curSortList ? curSortList : BookStorage.get();
		let matchedBooks;

		if (searchValue == '') {
			curSearchSortList = null;
			curSearchList = null;

			matchedBooks = booksToSearch;
		} else {
			let bList = new BookList(BookStorage.get());
			let sList = bList.search(searchValue);
			curSearchList = sList;

			if (curSortList) {
				let bookList = new BookList(booksToSearch);
				matchedBooks = bookList.search(searchValue);
			
				curSearchSortList = matchedBooks;
			} else {
				matchedBooks = curSearchList;
				curSearchSortList = null;
			}

		}
		
		UI.redisplayBooks(matchedBooks);
	});


	// Event: Change the "sort_by" select field
	$('#sort-by').on('change', (e) => {
		let sortValue = e.target.value; 
		let booksToSort = curSearchList ? curSearchList : BookStorage.get();
		let bookList = new BookList(booksToSort);
		let sortedBooks;

		if (sortValue == '') {
			curSortList = null;
			curSearchSortList = null;
			
			if (curSearchList)
				sortedBooks = bookList.sortBy(sortValue);
			else {
				sortedBooks = booksToSort;
			}
		} else {
			sortedBooks = bookList.sortBy(sortValue);
			
			let bList = new BookList(BookStorage.get());
			let sBooks = bList.sortBy(sortValue);
			curSortList = sBooks;
			
			if (curSearchList) {
				curSearchSortList = sortedBooks;
			} else {
				curSearchSortList = null;
			}
		}

		UI.redisplayBooks(sortedBooks);
	});
});


function dd(data) {
	console.log(data);
}