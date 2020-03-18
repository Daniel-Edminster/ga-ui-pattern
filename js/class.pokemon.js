class Pokemon {
    constructor(dexNum)
    {
        this.baseURL = "https://pokeapi.co/api/v2/";
        this.dexNum = dexNum;
        this.fetchURL = `${this.baseURL}pokemon/${this.dexNum}/`;
        this.response = "";

    }

    getAllDetails()
    {
        console.log(this.fetchURL);
        fetch(this.fetchURL)
        .then(response => response.json())
        .then(details => {
            console.log(details);

        });
    }

    getFlavorText()
    {
        
        this.fetchURL = `${this.baseURL}pokemon-species/${this.dexNum}`;
        // console.log("flavortext method called", this.fetchURL);
        fetch(this.fetchURL)
        .then(response => 
            response.json())
        .then(response => {
            
            // console.log(details);
            // console.log(response);
            // return response.flavor_text_entries[1].flavor_text;
            this.response = response.flavor_text_entries[1].flavor_text;    
            // console.log(response.flavor_text_entries[1].flavor_text);    
           
        });

        // this.response;

        // console.log(response);
    }

}


let bulbasaur = new Pokemon(3);
bulbasaur.getFlavorText();

// bulbasaur.getFlavorText()
// .then(console.log(bulbasaur.response));

// console.log(t);

// bulbasaur.getAllDetails();
setTimeout(() => {
    console.log(bulbasaur.response);
}, 5000);
// console.log(bulbasaur.getFlavorText());
