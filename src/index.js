import axios from "axios";
import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import SlimSelect from "slim-select";
import Notiflix from "notiflix";

axios.defaults.headers.common["x-api-key"] ="live_pvzthhwcLNpXzoGTokX0tGZWTJzvh39GuvvCEkgQVjxlzqlAOTNp6AJgpMGnO3Wq";


const loader = Notiflix.Loading;

const catInfo = document.querySelector(".cat-info");
const imageContainer = document.querySelector(".image");
const catTextContainer = document.querySelector(".cat-text");

const slimBreeds = new SlimSelect({
  select: ".breed-select",
  placeholder: "Select a breed",
  searchPlaceholder: "Search",
  allowDeselect: true,
  closeOnSelect: true,
  onChange: async (info) => {
    const selectedBreedId = info.value[0];
    Notiflix.Loading.pulse("Loading Cat Information..."); // Use Loading.pulse to show loading animation
    try {
      const catData = await fetchCatByBreed(selectedBreedId);
      displayCatInfo(catData[0]);
    } catch (error) {
      showError();
    } finally {
      Notiflix.Loading.remove(); // Use Loading.remove to hide loading animation
    }
  },
});

function displayCatInfo(catData) {
  imageContainer.innerHTML = `<img src="${catData.url}" alt="Cat Image" width="100%">`;
  catTextContainer.innerHTML = `
    <h2>${catData.breeds[0].name}</h2>
    <p><strong>Breed:</strong> ${catData.breeds[0].name}</p>
    <p><strong>Description:</strong> ${catData.breeds[0].description}</p>
    <p><strong>Temperament:</strong> ${catData.breeds[0].temperament}</p>
  `;
}

function showError() {
  Notiflix.Notify.failure("An error occurred. Please try again.");
}

(async function () {
    Notiflix.Loading.pulse("Loading Breeds..."); // Use Loading.pulse to show loading animation

    try {
      const breeds = await fetchBreeds();
      const options = breeds.map((breed) => ({
        value: breed.id,
        text: breed.name,
      }));
      slimBreeds.setData(options);
    } catch (error) {
      showError();
    } finally {
      Notiflix.Loading.remove(); // Use Loading.remove to hide loading animation
    }
  })();