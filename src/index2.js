import axios from "axios";
import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import SlimSelect from "slim-select";
import Notiflix from "notiflix";

const selectCat = document.querySelector(".breed-select");
const catInfo = document.querySelector(".cat-info");
const loaderContainer = document.querySelector('.loader-container');
const error = document.querySelector('.error');

// Function to show the loader and hide the error message
function showLoader(){
  loaderContainer.classList.remove('is-hidden');
  error.classList.add('is-hidden');
}

// Function to hide the loader
function hideLoader() {
  loaderContainer.classList.add('is-hidden');
}

// Function to show the error message
function showError() {
  hideLoader(); // Hide the loader container
  Notiflix.Notify.Failure('Oops! Something went wrong! Try reloading the page!');
}

window.addEventListener("load", () => {
  showLoader(); // Show loader when the page loads
});

selectCat.addEventListener("change", onSelectChange);

function createCatList() {
  showLoader(); // Show loader when fetching breeds

  fetchBreeds()
    .then(data => {
      const optionsList = data.map(({ id, name }) => ` <option value="${id}" style="font-size: 22px;">${name}</option>`).join(' ');

      selectCat.innerHTML = optionsList;

      new SlimSelect({
        select: selectCat
      });

      hideLoader(); // Hide loader on success
      selectCat.classList.remove('is-hidden');
    })
    .catch(error => {
      showError(); // Show error message on failure
    });
}

createCatList();

function onSelectChange(evt) {
  showLoader(); // Show loader when fetching cat by breed
  catInfo.classList.add('is-hidden');

  const selectedBreedId = evt.currentTarget.value;

  fetchCatByBreed(selectedBreedId)
    .then(data => {
      const { breeds, url } = data[0];
      const { name, temperament, description } = breeds[0];
      const wikipediaLink = `https://en.wikipedia.org/wiki/${name.replace(/\s/g, '_')}`;
      const breedCard = `
        <div class="cat-information">
          <div class="cat-photo">
            <img class="cat-img" width="500px" src="${url}" alt="${name}">
          </div>
          <div class="cat-card">
            <h2 class="cat-name" style="font-size: 24px;">${name}</h2>
            <p style="font-size: 18px;"><strong>Description:</strong> ${description}</p>
            <p style="font-size: 18px;"><strong>Temperament:</strong> ${temperament}</p>
            <p style="font-size: 18px;"><strong>Wikipedia:</strong> <a href="${wikipediaLink}" target="_blank" style="font-size: 18px;">${name}</a></p>
             <div id="cat"></div>
          </div>
          </div>
      `;

      catInfo.innerHTML = breedCard;
      hideLoader(); // Hide loader on success
      catInfo.classList.remove('is-hidden');
    })
    .catch(error => {
      showError(); // Show error message on failure
    });
}