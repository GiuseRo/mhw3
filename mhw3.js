// key api classifica
const api_endpoint =
  "https://api-football-standings.azharimm.site/leagues/ita.1/standings?season=2021&sort=asc";

//Oauth2 spotify
const client_id = "0c7b86cb17d2457e982a91f9890776ba";
const client_secret = "86573e75674e40a6bdcee2759bc3efb2";
let token;

function onResponse(response) {
  return response.json();
}
function onJson(json) {
  console.log(json);
  const elenco = document.querySelector("#classifica");
  elenco.innerHTML = "";
  document.body.classList.add("show");
  const results = json.data.standings;
  for (let result of results) {
    console.log(result.team.name);
    const contenitore = document.createElement("div");
    let pos = document.createElement("p");
    const testo = document.createElement("p");

    const img = document.createElement("img");
    img.src = result.team.logos[0].href;
    pos.innerHTML = result.stats[8].value + " ";
    pos.appendChild(img);
    pos.innerHTML +=
      " " +
      result.team.name +
      " " +
      result.stats[6].value +
      " punti su " +
      result.stats[3].value +
      " partite giocate";
    if (result.stats[8].value >= 18) pos.classList.add("retro");
    if (result.stats[8].value <= 7) pos.classList.add("europa");
    contenitore.appendChild(pos);
    contenitore.appendChild(testo);
    elenco.appendChild(contenitore);
  }
}

function sendRequest(event) {
  document.querySelector(".hide").classList.remove("hide");
  event.currentTarget.classList.add("hide");
  fetch(api_endpoint).then(onResponse).then(onJson);
}

function reset(event) {
  document.querySelector(".hide").classList.remove("hide");
  event.currentTarget.classList.add("hide");
  document.querySelector("#classifica").innerHTML = "";
}

function onTokenResponse(response) {
  return response.json();
}

function onTokenJson(json) {
  token = json.access_token;
}
function onMJson(json) {
  console.log(json);
  const el = document.querySelector("#elenco");
  el.innerHTML = "";
  document.body.classList.add("show");
  const results=json.tracks.items;
  for(const result of results){
    console.log(result.name);
    const img = document.createElement('img');
    const box = document.createElement("div")
    img.src=result.album.images[0].url;
    const titolo=document.createElement("h1")
    titolo.innerHTML="titolo: "+result.name;
    const album=document.createElement("h3");
    album.innerHTML="titolo album: "+result.album.name;
    const artista=document.createElement("p");
    artista.innerHTML="nome artista: "+result.artists[0].name;
    const date=document.createElement("data")
    date.innerHTML="data rilascio: "+result.album.release_date;
    box.appendChild(img);
    box.appendChild(titolo);
    box.appendChild(album);
    box.appendChild(artista);
    box.appendChild(date);
    el.appendChild(box);
  }
}

function sendMusic(event) {
  event.preventDefault();
  const tipo = document.querySelector("#tipo").value;
  const encoded = encodeURIComponent(tipo);
  console.log("eseguo ricerca di " + encoded);
  fetch(
    "https://api.spotify.com/v1/search?type=track&include_external=audio&limit=4&q=" +
      encoded,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  )
    .then(onResponse)
    .then(onMJson);
}

const show = document.querySelector(".at");
show.addEventListener("click", sendRequest);
const hide = document.querySelector("#nas");
hide.addEventListener("click", reset);

fetch("https://accounts.spotify.com/api/token", {
  method: "post",
  body: "grant_type=client_credentials",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "basic " + btoa(client_id + ":" + client_secret),
  },
})
  .then(onTokenResponse)
  .then(onTokenJson);

const invio = document.querySelector(".submit");
invio.addEventListener("click", sendMusic);