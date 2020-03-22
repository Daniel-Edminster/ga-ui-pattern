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
        this.moveList = [];
        // this.DOMobjects = [0,1,2,3];

        this.getAllDetails();
        this.renderDOM();

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
             if(this.species.flavor_text_entries[i].language.name === "en")
                {   
                    received = 1;
                    return this.species.flavor_text_entries[i].flavor_text;
                }
        
        }
        
        return err;
    }
    
    getAndArrangeTypes()
    {
        let numTypes = this.details.types.length;
        let orderedTypes = [];
        let slot = 1;

        for(let i=0;i<numTypes;i++)
        {
            orderedTypes[this.details.types[i].slot -1] = this.details.types[i].type.name.toUpperCase();
        }

        return orderedTypes;
    }
    
    async getAbilityDetails(url)
    {
        let abilityDescription;
        let c = await fetch(url)
        .then(response => response.json())
        .then(response => {
            for(let i=0;i<response.effect_entries.length;i++)
            {

                if(response.effect_entries[i].language.name === "en")
                {
                    abilityDescription = response.effect_entries[i].short_effect;
                    break;
                }
            }      
     
        });

        return abilityDescription;

    }

    async getEvolutionChain()
    {
        url = this.species.evolution_chain.url;

        let d = await fetch(url)
        .then(response => response.json())
        .then(response => {


        })

        return d;
    }

    changeModularContent()
    {

        // if(!event) 
        // {
        //     let event = window.event();
        //     console.log(event);
        //     let display = event.target.getAttribute("data-access");
        // }
        
        let storedViews = document.querySelector(".storedViews").value;
        let viewArray = storedViews.split("|||");

        console.log("storedViews: ", viewArray);

        let display = event.target.getAttribute("data-access");

        switch (display)
        {
            case "abilities":
                document.querySelector(".modularInfoContainer").innerHTML = viewArray[0];
                break;

            case "moves":
                document.querySelector(".modularInfoContainer").innerHTML = viewArray[1];
                break;


        }



    }




    async getMoveDetails()
    {
        let numMoves = this.details.moves.length;

        for(let i=0; i<numMoves;i++)
        {
            let move = await fetch(this.details.moves[i].move.url)
            .then(response => response.json())
            .then(response => {

                let moveDetails = 
                {
                    name: response.name,
                    type: response.type.name,
                    power: response.power,
                    PP: response.pp,
                    attr: response.damage_class.name,
                    accuracy: response.accuracy,
                    effectChance: response.effect_chance,
                    desc: ""
                }

                //Find the first English entry..
                for(let j=0;j<response.flavor_text_entries.length;j++)
                {
                    if(response.flavor_text_entries[j].language.name == "en")
                    {
                        moveDetails.desc = response.flavor_text_entries[j].flavor_text;
                        break;
                    }
                }
                
                return moveDetails;
            })

            this.moveList.push(move);
        }
    }




    async renderDOM()
    {

        let vars  = await this.getAllDetails();
        vars  =  await this.getSpecies();
        vars  =  await this.getMoveDetails();

        console.log(this);

        //Modal Container
        let divDexFlexContainer = document.createElement("div");
        divDexFlexContainer.className ="dexFlexBoxContainer";

        //Modal Left Arrow
        let divDexFlexLeftArrow = document.createElement("div");
        divDexFlexLeftArrow.className ="dexFlexLeft";

        //Modal Right Arrow
        let divDexFlexRightArrow = document.createElement("div");
        divDexFlexRightArrow.className ="dexFlexRight";

        //Modal Inner Left
        let divDexFlexInnerLeft = document.createElement("div");
        divDexFlexInnerLeft.className = "dexFlexInnerLeft";

        //Modal Inner Right
        let divDexFlexInnerRight = document.createElement("div");
        divDexFlexInnerRight.className = "dexFlexInnerRight";


        //NAME & Descriptors
        let divDescriptor = document.createElement("div");
        divDescriptor.className = "pokeDescriptorContainer scanlines";

        let divDescriptorGrid = document.createElement("div");
        divDescriptorGrid.className = "pokeDescriptorGrid";


        let divName = document.createElement("div");
        divName.className="pokeName";
        let name = this.details.name.toUpperCase();

        let pDexNum = document.createElement("p");
        pDexNum.className = "dexNum";
        pDexNum.innerHTML = `No. ${this.dexNum}`;
        let divHeight = document.createElement("div");
        divHeight.className = "pokeHeight";
        divHeight.innerHTML = "H: "+ (this.details.height / 10) +"m";
        let divWeight = document.createElement("div");
        divWeight.className = "pokeWeight";
        divWeight.innerHTML = "W: " + (this.details.weight / 10) + "kg";
        let divType = document.createElement("div");
        divType.className = "pokeType";
        divType.innerHTML = `TYPE: ${this.getAndArrangeTypes().join("/")}`;
        

        divDescriptorGrid.appendChild(divName);
        divDescriptorGrid.appendChild(divHeight);
        divDescriptorGrid.appendChild(divWeight);
        divDescriptorGrid.appendChild(divType);
        
        //FLAVOR TEXT
        divName.innerHTML = name;
        let divFlavorText = document.createElement("div");
        divFlavorText.className="flavorText";
        divFlavorText.innerHTML= await this.getEnglishFlavorText();
        divName.appendChild(pDexNum);
        
        divDescriptorGrid.appendChild(divFlavorText);

        divDescriptor.appendChild(divDescriptorGrid);

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

        let abilityName;
        let abilityDescription;
        let abilityDescriptionList = document.createElement("dl");

        if(Array.isArray(this.details.abilities))
        {
            for(let i=0;i<this.details.abilities.length;i++)
            {
                abilityName = document.createElement("dt");
                abilityName.className = "abilityName";
                abilityName.setAttribute("data-ability-index", i);
                abilityName.innerHTML = this.details.abilities[i].ability.name.capitalize();
                abilityDescription = document.createElement("dd");
                abilityDescription.className = "abilityDescription";
                abilityDescription.setAttribute("data-ability-index", i);

                abilityDescription.innerHTML = await this.getAbilityDetails(this.details.abilities[i].ability.url);

                abilityDescriptionList.appendChild(abilityName);
                abilityDescriptionList.appendChild(abilityDescription);

            }
        }
        divAbilities.appendChild(abilityDescriptionList);

        if(this.DOMobjects == null)
        {
            this.DOMobjects = [divAbilities];
        }
        else {
            this.DOMobjects.push(divAbilities);
        }


        //Modular Content Container
        let divModularContainer = document.createElement("div");
        divModularContainer.className = "modularInfoContainer scanlines";

        //Modular Buttons
        //TODO: Turn  into function call...
        let divModularButtonContainer = document.createElement("div");
        divModularButtonContainer.className = "modularButtonContainer";
        
        let divModularButton = document.createElement("div");
        divModularButton.className = "modularButtonFlexItem";
        divModularButton.innerHTML = "<a href=\"#\" class=\"modularButton\" data-access=\"abilities\">Abilities</a>";
        divModularButton.addEventListener("click", this.changeModularContent);


        divModularButtonContainer.appendChild(divModularButton);

        divModularButton = document.createElement("div");
        divModularButton.className = "modularButtonFlexItem";
        divModularButton.innerHTML = "<a href=\"#\" class=\"modularButton\" data-access=\"moves\">Moves</a>";
        divModularButton.addEventListener("click", this.changeModularContent);

        divModularButtonContainer.appendChild(divModularButton);

        divModularButton = document.createElement("div");
        divModularButton.className = "modularButtonFlexItem";
        divModularButton.innerHTML = "<a href=\"#\" class=\"modularButton\" data-access=\"evolutions\">Evolutions</a>";
        divModularButton.addEventListener("click", this.changeModularContent);

        divModularButtonContainer.appendChild(divModularButton);
        
        divModularButton = document.createElement("div");
        divModularButton.className = "modularButtonFlexItem";
        divModularButton.innerHTML = "<a href=\"#\" class=\"modularButton\" data-access=\"base-stats\">Base Stats</a>";
        divModularButton.addEventListener("click", this.changeModularContent);

        divModularButtonContainer.appendChild(divModularButton);

        //MOVES
        let divMoveContainer = document.createElement("div");
        divMoveContainer.className = "allMovesContainer";
        let numMoves = this.moveList.length;

       
        for(let y=0;y<numMoves;y++)
        {
            let curMove = document.createElement("div");
            curMove.className = "singleMoveContainer";
            
            let curMoveName = document.createElement("div");
            curMoveName.className = "singleMoveName";
            curMoveName.innerHTML = this.moveList[y].name.capitalize();

            let curMoveStats = document.createElement("div");
            curMoveStats.className = "singleMoveStats";
            curMoveStats.innerHTML = `Pw: ${this.moveList[y].power} / Ac: ${this.moveList[y].accuracy} / PP: ${this.moveList[y].PP} / At: ${this.moveList[y].attr}`;

            let curMoveType = document.createElement("div");
            curMoveType.className = "singleMoveType";
            curMoveType.innerHTML = `Type: ${this.moveList[y].type}`;

            let curMoveDescription = document.createElement("div");
            curMoveDescription.className = "singleMoveDescription";
            curMoveDescription.innerHTML = this.moveList[y].desc;
            
            curMove.appendChild(curMoveName);
            curMove.appendChild(curMoveStats);
            curMove.appendChild(curMoveType);
            curMove.appendChild(curMoveDescription);           

            divMoveContainer.appendChild(curMove);
        }

        this.DOMobjects.push(divMoveContainer);

        //append move container to modular container..
        divModularContainer.appendChild(divMoveContainer);


        let hrInnerLeft = document.createElement("hr");
        let hrInnerRight = document.createElement("hr");
        let hrInnerRight2 = document.createElement("hr");
        let hrInnerRight3 = document.createElement("hr");

    

        divDexFlexInnerLeft.appendChild(divSpriteContainer);
        divDexFlexInnerLeft.appendChild(hrInnerLeft);
        divDexFlexInnerLeft.appendChild(divDescriptor);
  
        divDexFlexInnerRight.appendChild(divModularContainer);
        divDexFlexInnerRight.appendChild(hrInnerRight);
        divDexFlexInnerRight.appendChild(divModularButtonContainer);
        divDexFlexInnerRight.appendChild(hrInnerRight2);
        divDexFlexInnerRight.appendChild(hrInnerRight3);


        divDexFlexContainer.appendChild(divDexFlexLeftArrow);
        divDexFlexContainer.appendChild(divDexFlexInnerLeft);
        divDexFlexContainer.appendChild(divDexFlexInnerRight);
        divDexFlexContainer.appendChild(divDexFlexRightArrow);


        let modalCover = document.querySelector(".modal-cover");
        modalCover.style.display = "block";
        modalCover.appendChild(divDexFlexContainer);
        // document.body.appendChild(divDexFlexContainer);


        let DOMstoreElement = document.createElement("input");
        DOMstoreElement.setAttribute("type","hidden");
        DOMstoreElement.className="storedViews";

        // let DOMjson = [];

        let hiddenContent = [];


        for(let z=0;z<this.DOMobjects.length;z++)
        {
 
            hiddenContent.push( this.DOMobjects[z].outerHTML );
        }
    
        DOMstoreElement.value = hiddenContent.join("|||");

        document.body.appendChild(DOMstoreElement);

    }

}


// let bulbasaur = new Pokemon(545);

