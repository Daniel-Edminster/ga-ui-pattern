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

    }

    goToNextSprite()
    {
        let spriteNodes = document.querySelectorAll(".spriteDisplay");
        let activeSpriteNode = document.querySelector(".spriteDisplayActive");
        let activeSpriteNodeIndex = activeSpriteNode.getAttribute("data-spriteindex");
        let numSpriteNodes = spriteNodes.length;
        let nextSpriteIndex = parseInt(activeSpriteNodeIndex) + 1;

        if(nextSpriteIndex === numSpriteNodes) nextSpriteIndex = 0;

        let nextActiveSpriteNode = document.querySelector(`[data-spriteindex="${nextSpriteIndex}"]`);
        activeSpriteNode.classList.remove("spriteDisplayActive");
        nextActiveSpriteNode.classList.add("spriteDisplayActive");

    }

    goToPreviousSprite()
    {
        let spriteNodes = document.querySelectorAll(".spriteDisplay");
        let activeSpriteNode = document.querySelector(".spriteDisplayActive");
        let activeSpriteNodeIndex = activeSpriteNode.getAttribute("data-spriteindex");
        let numSpriteNodes = spriteNodes.length;
        let nextSpriteIndex = parseInt(activeSpriteNodeIndex) - 1;

        if(nextSpriteIndex < 0) nextSpriteIndex = numSpriteNodes - 1;


        let nextActiveSpriteNode = document.querySelector(`[data-spriteindex="${nextSpriteIndex}"]`);
        activeSpriteNode.classList.remove("spriteDisplayActive");
        nextActiveSpriteNode.classList.add("spriteDisplayActive");

    }


    assignSpriteIndices()
    {
        //TODO: move all sprite DOM code here..


        // let spriteNodes = document.querySelectorAll(".spriteDisplay");
        // let numSpriteNodes = spriteNodes.length;

        // //assign all nodes data attributes if it hasn't been done already
        // if(!spriteNodes[0].getAttribute("data-spriteIndex"))
        // {
        //     console.log("attribute not found");
        //     for(let i=0;i<spriteNodes.length;i++)
        //     {
        //         spriteNodes[i].setAttribute("data-spriteIndex", i);
        //     }   
        // }

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
        let vars2  =  await this.getSpecies();

        console.log(this);
        console.log(this.currentIndex, this.nextIndex);

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
            divSpriteDisplay.setAttribute("data-spriteIndex", x);

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


let bulbasaur = new Pokemon(151);
bulbasaur.getAllDetails();
bulbasaur.renderDOM();
