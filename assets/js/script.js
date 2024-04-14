const apiLink = "https://api-preview.netrunnerdb.com/api/v3/public/"
let userSide = ""


//connect to netrunnerdb and fetch cards with a url crafted from arguments
async function fetchCards(apiLink, filter = "", param = "", side) {
  const response = await fetch(`${apiLink}${filter}?filter[${param}]=${side}`);
  const data = await response.json();
  let next = data.links.next;
  let prev = data.links.prev;
//call function recursively, while data.links.next has a truthy value, i.e until there are no more pages
  if (next) {
    const nextData = await fetchCards(next);
    data.data = [...data.data, ...nextData];
  }
//return an array of card objects 
return data.data;
  }

//filter requested cards
//TODO replace hardcoded values with passed values 
async function filterCards(cardProperty = "", cardFilter = "", side = "") {
  let allCards = await fetchCards(apiLink, "cards", "side_id", side);
  let filteredCards = allCards.filter(card => card.attributes[cardProperty] === cardFilter).map(card => {
    return $("<div>").html("<h1>" + card.attributes.title + "</h1>");("#allCards");
    }
  );
  $("#allCards").append(filteredCards);
}


//fetch the different types of cards filtered by selected side
async function getCardTypes(side) {
    let fetchTypes =  await fetch("https://api-preview.netrunnerdb.com//api/v3/public/card_types")
    let cardTypesJSON = await fetchTypes.json();
    let cardTypes = cardTypesJSON.data;
    let availableTypes = cardTypes.filter(type => type.attributes.side_id === side)
    console.log(availableTypes)
    return availableTypes
    }  


//Main function, for calling other functions
async function main(side) {
side = "runner" //runner or corp
let userCardTypes = await getCardTypes(side);
cardType = userCardTypes[4].id //see console.log for available choices filtered by side
filterCards("card_type_id", cardType, side);
}

main(userSide);

//let cardTypes = userCardTypes.filter(type => type.attributes.side_id === type)
