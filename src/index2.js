import axios from "axios";
import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import SlimSelect from "slim-select";
import Notiflix from "notiflix";


const selectCat = document.querySelector(".breed-select")
const catInfo = document.querySelector(".cat-info")
const loader = document.querySelector('.loader')
const error = document.querySelector('.error')

// Function to show the loader and hide the error message
function showLoader() {
    loader.classList.remove('is-hidden');
    error.classList.add('is-hidden');
  }
  
  // Function to hide the loader
  function hideLoader() {
    loader.classList.add('is-hidden');
  }
  
  // Function to show the error message
  function showError() {
    error.classList.remove('is-hidden');
  }
  
  window.addEventListener("load", () => {
    showLoader(); // Show loader when the page loads
  });

selectCat.addEventListener("change", onSelectChange)


function createCatList() {
    loader.classList.remove('is-hidden');
    selectCat.classList.add('is-hidden');
    error.classList.add('is-hidden')

    fetchBreeds()
        .then(data => {

            const optionsList = data.map(({ id, name }) => ` <option value="${id}">${name}</option>`
            ).join(' ');

            selectCat.innerHTML = optionsList;

            new SlimSelect({
                select: selectCat
            })

            loader.classList.add('is-hidden');
            selectCat.classList.remove('is-hidden')
        })
        .catch(error => {
            Notify.failure('Oops! Something went wrong! Try reloading the page!')
        });
}

createCatList();

function onSelectChange(evt) {
    loader.classList.remove('is-hidden');
    catInfo.classList.add('is-hidden');

    const selectedBreedId = evt.currentTarget.value;

    fetchCatByBreed(selectedBreedId)
        .then(data => {
            renderMarkupInfo(data);
            loader.classList.add('is-hidden');
            catInfo.classList.remove('is-hidden');
        })
        .catch(error => {
            loader.classList.add('is-hidden');
            Notify.failure('Oops! Something went wrong! Try reloading the page!')
        });
}

function renderMarkupInfo(data) {
    const { breeds, url } = data[0];
    const { name, temperament, description } = breeds[0];
    const wikipediaLink = `https://en.wikipedia.org/wiki/${name.replace(/\s/g, '_')}`;
    const breedCard = `
  <div class=cat-info>
  <span class="cat-photo">
  <img class="cat-img" width = "500px" src="${url}" alt="${name}">
  </span>
  <span class="cat-card">
  <h2 class="cat-name" font-size = "24px"> ${name}</h2>
  <p><strong>Description:</strong> ${description}</p>
  <p><strong>Temperament:</strong> ${temperament}</p> 
  <p><strong>Wikipedia:</strong> <a href="${wikipediaLink}" target="_blank">${name} </a></p> 
  </span>
  </div>
  <div id="zaza">
        <div id="cat"></div>
</div>`;

    catInfo.innerHTML = breedCard;
}