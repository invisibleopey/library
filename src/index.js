import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB2-o9TQMPUgsIJfqYjUfy8Rt8GOGsiYDg',
  authDomain: 'library-66b59.firebaseapp.com',
  projectId: 'library-66b59',
  storageBucket: 'library-66b59.appspot.com',
  messagingSenderId: '732168905670',
  appId: '1:732168905670:web:47a4b1c9224b25ffe788c7',
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
let user;

const loginWithGoogle = async () => {
  const userCredentials = await signInWithRedirect(auth, provider);
  user = await userCredentials.user;
};

const logOut = async () => {
  signOut(auth);
};

const form = document.querySelector('form');
const addBookBtn = document.querySelector('#add-book-btn');
const closeFormBtn = document.querySelector('.close');
const loginBtn = document.querySelector('#loginBtn');
const logoutBtn = document.querySelector('#logoutBtn');
let myLibrary = [];
let newBook;
let myBooksDiv = document.querySelector('#myBooks');
let readBtn;
let removeBtn;

addBookBtn.addEventListener('click', toggleFormDisplay);
form.addEventListener('submit', submitBook);
closeFormBtn.addEventListener('click', closeFormDisplay);
loginBtn.addEventListener('click', loginWithGoogle);
logoutBtn.addEventListener('click', logOut);

// Book Class
class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
  info() {
    return `${title} by ${author}, ${pages} pages, ${read}`;
  }
}
// Modal control for Pop-Up
function toggleFormDisplay() {
  document.querySelector('.bg-modal').style.display = 'flex';
}
function closeFormDisplay() {
  document.querySelector('.bg-modal').style.display = 'none';
}
// Adding book to Library and local storage
function addBookToLibrary() {
  myLibrary.push(newBook);
  saveLocal();
}
// Run this function on clicking submit button
function submitBook(e) {
  e.preventDefault();
  newBook = Object.create(Book);
  newBook.title = document.querySelector('#title').value;
  newBook.author = document.querySelector('#author').value;
  newBook.pages = document.querySelector('#pages').value;
  newBook.read = document.querySelector('#read').checked;
  addBookToLibrary();
  createBookCard();
  form.reset();
  closeFormDisplay();
}
// The Grid of Books
function createBookCard() {
  myBooksDiv.innerHTML = '';
  for (let i = 0; i < myLibrary.length; i++) {
    let bookCard = document.createElement('div');
    if (bookCard.dataset.index == i) {
      continue;
    } else {
      bookCard.dataset.index = i;
      let title = document.createElement('p');
      title.textContent = myLibrary[i].title;
      let author = document.createElement('p');
      author.textContent = myLibrary[i].author;
      let pages = document.createElement('p');
      pages.textContent = myLibrary[i].pages + ' Pages';
      bookCard.appendChild(title);
      bookCard.appendChild(author);
      bookCard.appendChild(pages);
    }
    readBtn = document.createElement('button');
    if (myLibrary[i].read === true) {
      readBtn.textContent = 'Read';
    } else {
      readBtn.textContent = 'Not read';
      readBtn.classList.add('not-read');
    }
    bookCard.appendChild(readBtn);
    removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    bookCard.appendChild(removeBtn);
    myBooksDiv.appendChild(bookCard);

    readBtn.addEventListener('click', toggleRead);
    removeBtn.addEventListener('click', removeBook);
  }
}
// Remove Book Btn function
function removeBook(e) {
  let indexToDelete = e.target.parentNode.dataset.index;
  myLibrary.splice(indexToDelete, 1);
  saveLocal();
  createBookCard();
}
// Toggle Read button Function
function toggleRead(e) {
  let readStatus = e.target.textContent;
  let index = e.target.parentNode.dataset.index;
  if (readStatus === 'Read') {
    myLibrary[index].read = false;
    e.target.textContent = 'Not read';
    e.target.classList.add('not-read');
  } else {
    myLibrary[index].read = true;
    e.target.textContent = 'Read';
    e.target.classList.remove('not-read');
  }
  saveLocal();
}
// Local Storage
function saveLocal() {
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}
function restoreLocal() {
  myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
  if (myLibrary === null) myLibrary = [];
  createBookCard();
}
// Call this function everytime my app is revisited or reloaded
restoreLocal();
