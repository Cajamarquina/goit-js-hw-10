import axios from "axios";

axios.defaults.headers.common["x-api-key"] ="live_pvzthhwcLNpXzoGTokX0tGZWTJzvh39GuvvCEkgQVjxlzqlAOTNp6AJgpMGnO3Wq"; 

const url = 'https://api.thecatapi.com/v1';

function fetchBreeds() {
  return axios.get(`${url}/breeds`)
      .then(response => {
          return response.data;
      })
      .catch(error => {

          throw new Error("", error.message);
      });

}


function fetchCatByBreed(breedId) {
  return axios.get(`${url}/images/search?breed_ids=${breedId}`)
      .then(response => {
          return response.data;
      })
      .catch(error => {

          throw new Error("", error.message);
      });

}

export { fetchBreeds, fetchCatByBreed };