import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB2-o9TQMPUgsIJfqYjUfy8Rt8GOGsiYDg',
  authDomain: 'library-66b59.firebaseapp.com',
  projectId: 'library-66b59',
  storageBucket: 'library-66b59.appspot.com',
  messagingSenderId: '732168905670',
  appId: '1:732168905670:web:47a4b1c9224b25ffe788c7',
};

// Initialize firebase app
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(firebaseApp);

const loginWithGoogle = async () => {
  try {
    const userCredentials = await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('There was an error logging in with google redirect', error);
  }
};

const logOut = async () => {
  signOut(auth);
};

const monitorAuthState = async () => {
  let unsubscribe;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginBtn.classList.add('hide-btn');
      logoutBtn.classList.remove('hide-btn');
      // Set up event listener for books collection
      const queryCol = query(collection(db, 'books'), where('userId', '==', auth.currentUser.uid));

      unsubscribe = onSnapshot(queryCol, (querySnapshot) => {
        // Reset the Library to empty array to prevent data duplication
        myLibrary = [];
        querySnapshot.forEach((book) => {
          let bookId = book.id;
          myLibrary.push({
            ...book.data(),
            bookId,
          });
        });
        createBookCard();
      });
    } else {
      logoutBtn.classList.add('hide-btn');
      loginBtn.classList.remove('hide-btn');
      restoreLocal();
      unsubscribe();
    }
  });
};

monitorAuthState();

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
  if (auth.currentUser) {
    addBookToCloud();
  } else {
    myLibrary.push(newBook);
    saveLocal();
  }
}
// Add the Book to Books Collection

const addBookToCloud = async () => {
  try {
    const bookRef = await addDoc(collection(db, 'books'), {
      ...newBook,
      userId: auth.currentUser.uid,
    });
  } catch (error) {
    console.error('Error writing document:', error);
  }
};

// Run this function on clicking submit button
function submitBook(e) {
  e.preventDefault();
  newBook = Object.create(Book);
  newBook.title = document.querySelector('#title').value;
  newBook.author = document.querySelector('#author').value;
  newBook.pages = Number(document.querySelector('#pages').value);
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
async function removeBook(e) {
  let indexToDelete = e.target.parentNode.dataset.index;
  if (auth.currentUser) {
    let targetBookId = myLibrary[indexToDelete].bookId;
    await deleteDoc(doc(db, 'books', targetBookId));
  } else {
    myLibrary.splice(indexToDelete, 1);
    saveLocal();
    createBookCard();
  }
}
// Toggle Read button Function
async function toggleRead(e) {
  let readStatus = e.target.textContent;
  let index = e.target.parentNode.dataset.index;
  if (readStatus === 'Read') {
    if (auth.currentUser) {
      let targetBookId = myLibrary[index].bookId;
      const bookRef = doc(db, 'books', targetBookId);
      await updateDoc(bookRef, {
        read: false,
      });
    } else {
      myLibrary[index].read = false;
      saveLocal();
    }
    e.target.textContent = 'Not read';
    e.target.classList.add('not-read');
  } else {
    if (auth.currentUser) {
      let targetBookId = myLibrary[index].bookId;
      const bookRef = doc(db, 'books', targetBookId);
      await updateDoc(bookRef, {
        read: true,
      });
    } else {
      myLibrary[index].read = true;
      saveLocal();
    }
    e.target.textContent = 'Read';
    e.target.classList.remove('not-read');
  }
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

// TODO: Display User Name beside the log out button
// TODO: Add a timestamp to order the books by
