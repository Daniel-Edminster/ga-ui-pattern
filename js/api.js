console.log("api.js loaded.");

let apk;
let pkmnLength;
let dexNum = 0;
let dxid;
let pkmnContainer;
let sprite;
let img;

function getPokemonByDexNumber(dxNm)
{


}

function orderPokemonByDexNumber()
{
    // let pool = document.querySelectorAll('div[id^="dex-"]');
    let pool = document.querySelectorAll("[data-dexnum]");
    // console.log(pool);
    let poolArray = Array.prototype.slice.call(pool, 0);

    console.log(poolArray[0].dataset.dexnum);

}

function renderSinglePokemon(url, dexNum)
{
    fetch(url)
    .then(response => response.json())
    .then(singlePokemon => {

        // console.log(singlePokemon);
        sprite = singlePokemon.sprites.front_default;
        // dexNum += 1;
        img = document.createElement("img");
        img.setAttribute("src", sprite);
        img.className = "sprite";

        pkmnContainer = document.createElement("div");
        pkmnContainer.className="pkmnContainer";
        // pkmnContainer.id=`dex-${dexNum}`;
        pkmnContainer.setAttribute("data-dexnum", dexNum);

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
            // dexNum = i+1;

            dxid = i+1;
            renderSinglePokemon(allpokemon.results[i].url,dxid);

            // img.setAttribute("src", sprite);


        }
  
  
    });
        
}




fetchKantoPokemon();
setTimeout(() => {
    orderPokemonByDexNumber();
}, 5000);


