// **Public API requests project**

const randomUrl = 'https://randomuser.me/api/?nat=us&results=12';
const headerDiv = document.getElementsByClassName("header-inner-container");
const searchDiv = document.getElementsByClassName("search-container");
const galleryDiv = document.getElementsByClassName('gallery');

// Make an Ajax single request and pull 12 random users from the API along with some basic information .
// Display new random employee information each time user refreshes the page using the response.

function getJSON(randomUrl, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET',randomUrl);
    xhr.onload = () => {
        if( xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);            
            generateHTML(data.results.slice(0,12));
            return callback(data);
        }
    }
    xhr.send();
}

// Place search input and submit button in the header.
headerDiv[0].appendChild(searchDiv[0])
searchDiv[0].innerHTML=`<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`

// Generate the markup for each profile.
function generateHTML(data){
    data.map(employee => {
        const card = document.createElement('div');
        card.classList.add('card');

        const employeeImage= document.createElement('div');
        const employeeItems = document.createElement('div');
        employeeImage.setAttribute('class',"card-img-container");
        employeeItems.setAttribute('class',"card-info-container");

        galleryDiv[0].appendChild(card);
        card.appendChild(employeeImage);
        card.appendChild(employeeItems);

        employeeImage.innerHTML=
        `<img class="card-img" src=${employee.picture.thumbnail} alt="profile picture">`
        employeeItems.innerHTML=
        `<h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="card-text">${employee.email}</p>
        <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>`
    })
};

let results = [];
getJSON(randomUrl, (returnedData) => {
    results = returnedData.results;
});

// Create modal window to display the employee details when user click any card.
function modalInnerHtml(modalInfoDiv, employee){
    modalInfoDiv.innerHTML=`
    <img class="modal-img" src=${employee.picture.medium} alt="profile picture">
    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
    <p class="modal-text">${employee.email}</p>
    <p class="modal-text cap">${employee.location.city}</p>
    <hr>
    <p class="modal-text">${employee.phone}</p>
    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.state}, ${employee.location.postcode}</p>
    <p class="modal-text">Birthday: ${new Date(employee.dob.date).toLocaleDateString("en-US")}</p>`;
}

gallery.addEventListener('click', event => {
    const element = event.target;
    if (element.getAttribute("class") !== null && element.getAttribute("class").includes("card")) {
        const cardDiv = event.target.closest(".card");
        const nameElement = cardDiv.querySelector("#name");
        const firstName = nameElement.textContent.split(" ")[0];
        const lastName = nameElement.textContent.split(" ")[1];

        let employee = results.find(employee => employee.name.first === firstName 
            && employee.name.last === lastName);

        const modalDiv=document.createElement("div");
        modalDiv.setAttribute('class',"modal-container");
        const modal=document.createElement("div");
        modal.setAttribute('class',"modal");

        // Create button to close the modal window.
        const closeButton=document.createElement('button');
        closeButton.setAttribute('class', 'modal-close-btn');
        closeButton.setAttribute('type','button');
        closeButton.setAttribute('id', 'modal-close-btn');
        closeButton.innerHTML=`<strong>X</strong>`

        const modalInfoDiv=document.createElement('div');
        modalInfoDiv.setAttribute('class', 'modal-info-container');
        gallery.appendChild(modalDiv).appendChild(modal).appendChild(closeButton)
        modal.appendChild(modalInfoDiv);

        modalInnerHtml(modalInfoDiv,employee);

        // create buttons with a separate div and append it to the modalDiv.
        const toggleDiv=document.createElement('div');
        toggleDiv.setAttribute('class',"modal-btn-container");

        const prevButton=document.createElement('button');
        prevButton.setAttribute('class',"modal-prev btn");
        prevButton.setAttribute('type','button');
        prevButton.setAttribute('id','modal-prev');
        prevButton.textContent='Prev';

        const nextButton=document.createElement('button');
        nextButton.setAttribute('class',"modal-next btn");
        nextButton.setAttribute('type','button');
        nextButton.setAttribute('id','modal-next');
        nextButton.textContent='Next';

        modalDiv.appendChild(toggleDiv).appendChild(prevButton);
        toggleDiv.appendChild(nextButton);

        // hide the nextButton for the last employee and the prevButton for the first one.
        if(results.indexOf(employee) === 0 ){
            prevButton.style.display = 'none';
        } else if(results.indexOf(employee) === results.length - 1){
            nextButton.style.display = 'none';
        } 
                    
        closeButton.addEventListener('click',(e)=>{
            modalDiv.remove();
        });

        // Switch back and forth between employees when the detail modal window is open.
        nextButton.addEventListener('click',(e)=>{
            const nextEmployee = results[results.indexOf(employee) + 1];
            if(nextEmployee){
                modalInnerHtml(modalInfoDiv,nextEmployee);
                employee = nextEmployee;
                if(results.indexOf(nextEmployee)===results.length-1){
                    nextButton.style.display = 'none';
                } else {
                    prevButton.style.display = 'block';
                }
            }
        });
        prevButton.addEventListener('click',(e)=>{
            const prevEmployee = results[results.indexOf(employee) - 1];
            if(prevEmployee){
                modalInnerHtml(modalInfoDiv,prevEmployee);
                employee = prevEmployee;
                if (results.indexOf(prevEmployee)===0){
                    prevButton.style.display = 'none';
                } else {
                    nextButton.style.display = 'block';
                }
            }      
        });
    }
});

// Filter the employee by name with dynamically added search feature.
const searchButton=document.getElementById('search-submit');
const searchInput=document.getElementById('search-input');

searchButton.addEventListener('click',()=>{
    searchForEmployee(searchInput.value.toLowerCase());
});

searchInput.addEventListener('keyup',(e)=>{
    searchForEmployee(e.target.value.toLowerCase());
});

function searchForEmployee(input) {
    let errorMessage = galleryDiv.gallery.querySelector("#errorMessage");
    if(errorMessage !== null) {
        errorMessage.remove();
    }

    let cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        cardElement = card.querySelector("#name");
        card.style.display = '';
    });
    cards.forEach(card => {
        cardElement = card.querySelector("#name");
        if(!cardElement.textContent.toLowerCase().includes(input)) {
            card.style.display = 'none';
        }
    });
    
    let hiddenCounter = 0;
    cards.forEach(card => {
        if(card.style.display === "none") {
            hiddenCounter = hiddenCounter + 1;
        }
    })
    if(hiddenCounter === 12) {
        const noResults = document.createElement("h3");
        noResults.setAttribute('id', 'errorMessage');
        noResults.textContent = "No Results found";
        galleryDiv.gallery.appendChild(noResults);
    }
};