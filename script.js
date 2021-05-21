







const form = document.querySelector("form");
const addBookBtn = document.querySelector("#add-book-btn");

addBookBtn.addEventListener("click", toggleDisplay);

function toggleDisplay () {
    form.classList.toggle("toggle-display");
}