class Library {
    myLibrary;
    
    constructor () {
        this.myLibrary = []
    }

    logLibrary = () => {
        console.log(this.myLibrary);
    }

    deleteEntry = () => {
        const deleteButtons = document.querySelectorAll(".delete-row");
        
        const deleteBook = (e) => {    
            const parentTr = e.target.parentNode.parentNode;
            parentTr.remove();

            // row index number of clicked delete button 
            const index = parseInt(parentTr.id.split("-")[1]);

            this.myLibrary.splice(index, 1);  
            this.saveToStorage();
            this.clearTableRows();
            this.createTableRows();
        }

        deleteButtons.forEach(b => b.addEventListener("click", deleteBook));
    }

    clearTableRows = () => {
        const tableBody = document.querySelector("tbody");
        tableBody.innerHTML = "";
    }

    createTableRows = () => {
        const createRows = (() => {
            const tableBody = document.querySelector("tbody");

            for (let i = 0; i < this.myLibrary.length; i++) {
                const tableRow = document.createElement("tr");
                tableRow.id = `row-${i}`;
                let currentBook = this.myLibrary[i];

                for (const prop in currentBook) {
                    const tableData = document.createElement("td");
                    tableData.innerText = currentBook[prop];
                    
                    if (prop === "status") {
                        tableData.contentEditable = 'true';
                    } 

                    tableRow.appendChild(tableData);
                    
                }
                tableBody.appendChild(tableRow);
            }
        })();
        
        const addDeleteButton =  (() => {
            const tableRows = document.querySelectorAll("tbody > tr");

            for (let i = 0; i < tableRows.length; i++) {
                const td = document.createElement("td");

                const button = document.createElement("button");
                button.classList.add("delete-row");
                button.innerText = "X";

                td.appendChild(button);
                tableRows[i].appendChild(td);
            }
            this.deleteEntry();
        })();

        const changeStatus = (e) => {
            let index = Number(e.target.parentNode.id.split("-")[1]);
            this.myLibrary[index].status = e.target.innerText;
            this.saveToStorage();
        };

        const tableRows = document.querySelectorAll("tbody > tr");
        tableRows.forEach(e => e.addEventListener("input", changeStatus));

        return {createRows};
    }

    saveToStorage = () => {
        localStorage.setItem("myLibrary", JSON.stringify(this.myLibrary));
    }

    addBook = () => {
        const inputs = Array.from(document.querySelectorAll('input[type=text]'));
        const bookInfo = ["title", "author", "genre","pages", "status", "entry-date"];
        let newBook = {};
        
        for (let i = 0; i < inputs.length; i++) {
            newBook[bookInfo[i]] = inputs[i].value;
        }

        const date = new Date();
        const entryDate = (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear();
        
        newBook["entry-date"] = entryDate;

        this.myLibrary.push(newBook);
        this.saveToStorage();
    }

    hideShowElements = (e) => {
        const formPopUp = document.querySelector(".form-popup");
        const libraryPopup = document.querySelector(".library-popup");
        const options = document.querySelector(".options");

        switch (e.target.id || e.target.class) {
            case "new-book":
                formPopUp.classList.remove("hide");
                break;

            case "display-library":
                if (this.myLibrary.length > 0) {
                    options.classList.add("hide")
                    libraryPopup.classList.remove("hide");
                } else {
                    alert("Library is empty");
                }
                break;

            case "form-submit":
                this.addBook;
                formPopUp.classList.add("hide");
                break;

            case "form-close":
                formPopUp.classList.add("hide");
                break;

            case "lib-close":
                libraryPopup.classList.add("hide");
                options.classList.remove("hide");
                break;

            case "lib-clear":
                const userAnswer = confirm("Are you sure you want to clear your library?");
                
                if (userAnswer) {
                    this.myLibrary = [];
                    this.clearTableRows();
                    localStorage.clear();

                    libraryPopup.classList.add("hide");
                    options.classList.remove("hide");
                }
                break;
        }
    }

    getFromStorage = () => {
        const storedLibrary = localStorage.getItem("myLibrary");

        if (storedLibrary && storedLibrary.length) {
            this.myLibrary = JSON.parse(storedLibrary);
        }
    }

    start = () => {
        const newBook = document.querySelector("#new-book");
        newBook.addEventListener("click", this.hideShowElements);

        const form = document.querySelector("form");
        form.addEventListener("submit", (event) => {
    
            let submitter = event.submitter;
            let handler = submitter.id;

            if (handler) {
                this.addBook();
            } else {
                return;
            }
        });

        const formClose = document.querySelector("#form-close");
        formClose.addEventListener("click", this.hideShowElements);

        const displayLibrary = document.querySelector("#display-library");
        displayLibrary.addEventListener("click", this.hideShowElements);

        const libClose = document.querySelector("#lib-close");
        libClose.addEventListener("click", this.hideShowElements);

        const libClear = document.querySelector("#lib-clear");
        libClear.addEventListener("click", this.hideShowElements);

        this.getFromStorage();
        this.createTableRows();
    }
}

let library = new Library()
library.start();