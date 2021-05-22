const form = document.querySelector("form");
const addBookBtn = document.querySelector("#add-book-btn");

addBookBtn.addEventListener("click", toggleDisplay);

function toggleDisplay () {
    form.classList.toggle("toggle-display");
}


let myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        return `${title} by ${author}, ${pages} pages, ${read}`
        // return title + " by " + author + ", " + pages + " pages," + read;
    }

}

// const purpleHibiscus = new Book ("Purple Hibiscus", "Chimamanda Ngozie Adichie", 307, "read");
// console.log(purpleHibiscus.info());

function addBookToLibrary() {
    myLibrary.push(newBook);
}


let newBook;
form.addEventListener("submit", submitBook);

function submitBook(e) {
    e.preventDefault();
    newBook = Object.create(Book);
    newBook.title = document.querySelector("#title").value;
    newBook.author = document.querySelector("#author").value;
    newBook.pages = document.querySelector("#pages").value;
    newBook.read = document.querySelector("#read").checked;
    addBookToLibrary();
    createBookCard();
    // console.log(myLibrary);
    // console.log(newBook);
    // console.log(document.querySelector("#title").value)
    // console.log(document.querySelector("#author").value)
    // console.log(document.querySelector("#pages").value)
    // console.log(document.querySelector("#read").checked)
    toggleDisplay();

}

let myBooksDiv = document.querySelector("#myBooks");
let readBtn;
let removeBtn;


function createBookCard() {
    myBooksDiv.innerHTML = "";
    for (let i = 0; i < myLibrary.length; i++) {
        let bookCard = document.createElement("div");
        if (bookCard.dataset.index == i) {
            continue
        } else {
        bookCard.dataset.index = i;
        let title = document.createElement("p");
           title.textContent = myLibrary[i].title;
        let author = document.createElement("p");
           author.textContent = myLibrary[i].author;
        let pages = document.createElement("p");
           pages.textContent = myLibrary[i].pages + " Pages";
        bookCard.appendChild(title);
        bookCard.appendChild(author);
        bookCard.appendChild(pages);
        }
        readBtn = document.createElement("button");
        if (myLibrary[i].read === true) {
            readBtn.textContent = "Read";
        } else {
            readBtn.textContent = "Not read"
        }
        bookCard.appendChild(readBtn);
        removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        bookCard.appendChild(removeBtn);
        myBooksDiv.appendChild(bookCard);

        removeBtn.addEventListener("click", removeBook);
    }
}
function removeBook (e) {
    let indexToDelete = e.target.parentNode.dataset.index;
    myLibrary.splice(indexToDelete, 1);
    createBookCard();
    // console.log(e.target.parentNode.dataset.index);
}











