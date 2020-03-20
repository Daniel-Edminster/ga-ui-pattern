String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }

class Pokemon {
    constructor(dexNum)
    {
        this.baseURL = "https://pokeapi.co/api/v2/";
        this.dexNum = dexNum;
        this.fetchURL = `${this.baseURL}pokemon/${this.dexNum}/`;
        // this.flavorText = "";
        // this.sprite = "";
        // this.details = "";
        this.isSet = 0;
        // this.species = "";


        this.getAllDetails();
        // this.getSpecies();


    }


    async getAllDetails()
    {
        // console.log(this.fetchURL);
        let a = await fetch(this.fetchURL)
        .then(response => response.json())
        .then(response => {
            // this.details = response;
            this.isSet = 1;
            // response;
            this.details = response;

            fetch(response.species.url)
                .then(res2 => res2.json())
                .then(res2 => {
                    this.species = res2;
                    return this.species;
                })
            // this.details.flavorText =
            return this.details;
        });

        

        // this.getFlavorText();
    }

    async getSpecies()
    {
        
        this.fetchURL = `${this.baseURL}pokemon-species/${this.dexNum}`;
       
        let b = await fetch(this.fetchURL)
        .then(response => 
            response.json())
        .then(response => {    

            this.species = response;

            return this.species;
        });

    }

    getEnglishFlavorText()
    {
        let received = 0;
        let err = "Flavor text not found";
        for(let i=0;i<this.species.flavor_text_entries.length;i++)
        {
            // console.log(this.species.flavor_text_entries[i].language);
   
             if(this.species.flavor_text_entries[i].language.name === "en")
                {   
                    received = 1;
                    return this.species.flavor_text_entries[i].flavor_text;
                }
        
        }
        
        return err;
    }

    async renderDOM()
    {

        let vars  = await this.getAllDetails();
        // let vars2 = await this.getTypes();
        let vars2  =  await this.getSpecies();

        console.log(this);
        // console.log(this, vars2);
        // console.log(vars);
  
            // console.log("waiting...");
            let divName = document.createElement("div");
            divName.className="pokeName";
            let name = this.details.name.capitalize();
            // console.log(name.capitalize());
            divName.innerHTML = name;
            let divFlavorText = document.createElement("div");
            divFlavorText.className="flavorText";
            divFlavorText.innerHTML= await this.getEnglishFlavorText();




            // let abilities1 = this.details.abilities[0];

            if(Array.isArray(this.details.abilities))
            {
                for(let i=0;i<this.details.abilities.length;i++)
                {
                    console.log(this.details.abilities[i].ability.name);
                }
            }

            
            document.body.appendChild(divName);
            document.body.appendChild(divFlavorText);



    }

}


let bulbasaur = new Pokemon(25);
bulbasaur.getAllDetails();
// let timer = 0;

// if(bulbasaur.details)

bulbasaur.renderDOM();
