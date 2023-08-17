import axios from "axios";
import { fetchBreeds, fetchCatByBreed } from "./cat-api.js";
import SlimSelect from "slim-select";
import Notiflix from "notiflix";

axios.defaults.headers.common["x-api-key"] ="live_pvzthhwcLNpXzoGTokX0tGZWTJzvh39GuvvCEkgQVjxlzqlAOTNp6AJgpMGnO3Wq";

const slimBreeds = new SlimSelect({
  select: ".breed-select",
  placeholder: "Select a breed",
  searchPlaceholder: "Search",
  allowDeselect: true,
  closeOnSelect: true,
});

const loader = Notiflix.Loading;

const catInfo = document.querySelector(".cat-info");
const imageContainer = document.querySelector(".image");
const catTextContainer = document.querySelector(".cat-text");

slimBreeds.on("change", async (info) => {
  const selectedBreedId = info.value[0];
  loader.show("Loading Cat Information...");
  try {
    const catData = await fetchCatByBreed(selectedBreedId);
    displayCatInfo(catData[0]);
  } catch (error) {
    showError();
  } finally {
    loader.hide();
  }
});

async function displayCatInfo(catData) {
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
  loader.show("Loading Breeds...");
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
    loader.hide();
  }
})();
