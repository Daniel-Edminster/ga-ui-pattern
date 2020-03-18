console.log("api.js loaded.");

let apk;
let pkmnLength;
let dexNum;
let pkmnContainer;
let sprite;
let img;

function renderSinglePokemon(url)
{
    fetch(url)
    .then(response => response.json())
    .then(singlePokemon => {

        // console.log(singlePokemon);
        sprite = singlePokemon.sprites.front_default;

        img = document.createElement("img");
        img.setAttribute("src", sprite);
        img.className = "sprite";

        pkmnContainer = document.createElement("div");
        pkmnContainer.className="pkmnContainer";
        pkmnContainer.id=`dex-${dexNum}`;

        pkmnContainer.appendChild(img);



       

        document.querySelector("#pkmn").appendChild(pkmnContainer);
        // console.log(sprite);
        // return sprite;
    })
  
}

function fetchKantoPokemon()
{
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(response => response.json())
    .then(allpokemon => {

        pkmnLength = allpokemon.results.length;
        // console.log(pkmnLength);
        // console.log(allpokemon);


  
        for(let i=0;i<pkmnLength;i++)
        {
            dexNum = i+1;


            renderSinglePokemon(allpokemon.results[i].url);

            // img.setAttribute("src", sprite);


        }
  
  
    });
        
}



fetchKantoPokemon();

// let pkmn = document.querySelector("#pkmn");



// pkmn.style.border = "1px solid black";
// pkmn.style.borderRadius = ".6em";
// pkmn.style.height = "75px";
// pkmn.style.width = "75px";
// pkmn.style.backgroundColor = "#f9f9f9";