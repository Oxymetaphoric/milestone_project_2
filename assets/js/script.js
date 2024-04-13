const apiLink = "https://api-preview.netrunnerdb.com/api/v3/public/"
let userSide = "corp"


//connect to netrunnerdb and fetch cards with a url crafted from arguments
async function fetchCards(apiLink, filter = "", param = "") {
  const response = await fetch(`${apiLink}${filter}${param}`);
  const data = await response.json();
  let next = data.links.next;
  let prev = data.links.prev;

//call function recursively, while data.links.next has a truthy value, i.e until there are no more pages
  if (next) {
    const nextData = await fetchCards(next);
    data.data = [...data.data, ...nextData];
  }
//return a concatenated array of card objects 

return data.data;
  }

//filter requested cards
//TODO replace hardcoded values with passed values 
async function filterCards(cardProperty = "", cardFilter = "", side = "") {
  let allCards = await fetchCards(apiLink, "cards?filter[side_id]=", side);
  let filteredCards = allCards.filter(card => card.attributes[cardProperty] === cardFilter).map(card => {
    return $("<div>").html("<h1>" + card.attributes.title + "</h1>");("#allCards");
    }
  );
  $("#allCards").append(filteredCards);
}
    
async function getCardTypes(userSide) {
    let fetchTypes =  await fetch("https://api-preview.netrunnerdb.com//api/v3/public/card_types")
    let cardTypesJSON = await fetchTypes.json();
    let cardTypes = await cardTypesJSON.data;
    return cardTypes
}


getCardTypes().then(cardTypes => {
  let availableTypes = []
  for (let type of cardTypes){
      if (type.attributes.side_id === userSide) {
      availableTypes.push(type);
    }
  }
  console.log(availableTypes) 
  return availableTypes
})

filterCards("card_type_id", "asset", userSide);





