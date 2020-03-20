String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }

class Pokemon {
    constructor(dexNum)
    {
        this.baseURL = "https://pokeapi.co/api/v2/";
        this.dexNum = dexNum;
        this.fetchURL = `${this.baseURL}pokemon/${this.dexNum}/`;
        this.spriteIndex = [];

        this.iterator = 0;
        this.decrementer = 0;

        // console.log(typeof this.iterator);


    }

    goToNextSprite()
    {

        if(!this.iterator)
        {
            this.iterator = 0;
        }

        let currentSpriteNode = document.querySelector(".spriteDisplayActive");
        let numSpriteNodes = document.querySelector(".pokeSprite").childNodes.length;

        if(this.iterator === numSpriteNodes -1)
        {
            this.iterator = 0;

            let currentSpriteNode = document.querySelector(".spriteDisplayActive");
            currentSpriteNode.classList.remove("spriteDisplayActive");

            currentSpriteNode = document.querySelectorAll(".spriteDisplay")[0];
            currentSpriteNode.classList.add("spriteDisplayActive");
        
        }
        else  {
            // console.log("<=4");
            // console.log(currentSpriteNode);
            currentSpriteNode.nextSibling.classList.add("spriteDisplayActive");
            currentSpriteNode.classList.remove("spriteDisplayActive");

            this.iterator++;
            // console.log(this.iterator);
        }

    }

    goToPreviousSprite()
    {
        
        let currentSpriteNode = document.querySelector(".spriteDisplayActive");
        let numSpriteNodes = document.querySelector(".pokeSprite").childNodes.length;

        if(!this.iterator)
        {
            this.iterator = 0;
        }

        if(this.iterator === 0)
        {
            let nextSpriteNode = document.querySelectorAll(".spriteDisplay")[numSpriteNodes-1];
            currentSpriteNode.classList.remove("spriteDisplayActive");
            nextSpriteNode.classList.add("spriteDisplayActive");
            
        }

        



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

            return this.details;
        });
    
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

        //NAME
        let divName = document.createElement("div");
        divName.className="pokeName";
        let name = this.details.name.capitalize();

        //FLAVOR TEXT
        divName.innerHTML = name;
        let divFlavorText = document.createElement("div");
        divFlavorText.className="flavorText";
        divFlavorText.innerHTML= await this.getEnglishFlavorText();

        //SPRITES
        this.spriteIndex.push(this.details.sprites.front_default);
        this.spriteIndex.push(this.details.sprites.back_default);
        this.spriteIndex.push(this.details.sprites.front_shiny);
        this.spriteIndex.push(this.details.sprites.back_shiny);

        let divSpriteContainer = document.createElement("div");
        divSpriteContainer.className = "spriteContainer modal-screen-left scanlines";

        let leftArrow = document.createElement("div");
        leftArrow.className = "arrowContainer";
        leftArrow.innerHTML = "<i class=\"arrow left\"></i>";
        let rightArrow = document.createElement("div");
        rightArrow.className = "arrowContainer";
        rightArrow.innerHTML = "<i class=\"arrow right\"></i>";

        leftArrow.addEventListener("click", this.goToPreviousSprite);
        rightArrow.addEventListener("click", this.goToNextSprite);



        let divSprite = document.createElement("div");
        divSprite.className = "pokeSprite spritebg";


        for(let x=0;x<this.spriteIndex.length;x++)
        {
            let divSpriteDisplay = document.createElement("div");
            let imgSprite = document.createElement("img");
            imgSprite.setAttribute("src", this.spriteIndex[x]);
            divSpriteDisplay.className = "spriteDisplay";

            if(x === 0)
            {
                divSpriteDisplay.classList.add("spriteDisplayActive");
            }
            else {

            }

            divSpriteDisplay.appendChild(imgSprite);
            divSprite.appendChild(divSpriteDisplay); 
            divSpriteContainer.appendChild(leftArrow);  
            divSpriteContainer.appendChild(divSprite);
            divSpriteContainer.appendChild(rightArrow); 

        }


        //ABILITIES

        let divAbilities = document.createElement("div");
        divAbilities.className = "abilities";

        let abilityItem;
        if(Array.isArray(this.details.abilities))
        {
            for(let i=0;i<this.details.abilities.length;i++)
            {
                abilityItem = document.createElement("div");
                abilityItem.className= "abilityItem";
                abilityItem.setAttribute("data-ability-index", i);
                abilityItem.innerHTML = this.details.abilities[i].ability.name;
                divAbilities.appendChild(abilityItem);

            }
        }

        document.body.appendChild(divSpriteContainer);
        document.body.appendChild(divName);
        document.body.appendChild(divFlavorText);
        document.body.appendChild(divAbilities);

    }

}


let bulbasaur = new Pokemon(6);
bulbasaur.getAllDetails();
bulbasaur.renderDOM();
