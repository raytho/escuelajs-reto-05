const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://rickandmortyapi.com/api/character/";
const localStorage = window.localStorage;

const getData = async (api) => {
  await fetch(api)
    .then((response) => response.json())
    .then((response) => {
      const characters = response.results;
      let output = characters
        .map((character) => {
          return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `;
        })
        .join("");
      localStorage.setItem("next_fetch", response.info.next);
      let newItem = document.createElement("section");
      newItem.classList.add("Items");
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch((error) => console.log(error));
};

const loadData = async () => {
  var newUrl = localStorage.getItem("next_fetch");
  if (!newUrl) {
    await getData(API);
  } else {
    if (newUrl === "null") {
      let hr = document.createElement("hr");
      $app.appendChild(hr);
      let finalItem = document.createElement("p");
      finalItem.innerHTML = "No hay mas elementos";
      $app.appendChild(finalItem);
    } else {
      await getData(newUrl);
    }
  }
};

const intersectionObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: "0px 0px 100% 0px",
  }
);
localStorage.removeItem("next_fetch");
intersectionObserver.observe($observe);
