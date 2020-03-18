console.log("api.js loaded.");

let apk;
let pkmnLength;
let dexNum;
let pkmnContainer;
function fetchKantoPokemon()
{
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(response => response.json())
    .then(allpokemon => {

        pkmnLength = allpokemon.results.length;
        console.log(pkmnLength);
  
        for(let i=0;i<pkmnLength;i++)
        {
            console.log(i);
            dexNum = i+1;
            pkmnContainer = document.createElement("div");
            pkmnContainer.className="pkmnContainer";
            pkmnContainer.id=`dex-${dexNum}`;

            document.querySelector("#pkmn").appendChild(pkmnContainer);
        }
  
  
    });
        
        // {
        // pkmnLength = allpokemon.results.length;

        // for(let i=0;i<pkmnLength;i++)
        // {
        //     dexNum = i+1;
        //     pkmnContainer = document.createElement("div");
        //     pkmnContainer.className="pkmnContainer";
        //     pkmnContainer.id=`dex-${dexNum}`;

        //     document.querySelector("#pkmn").appendChild(pkmnContainer);
        // }
    // }
    // );
}

fetchKantoPokemon();

// let pkmn = document.querySelector("#pkmn");



// pkmn.style.border = "1px solid black";
// pkmn.style.borderRadius = ".6em";
// pkmn.style.height = "75px";
// pkmn.style.width = "75px";
// pkmn.style.backgroundColor = "#f9f9f9";