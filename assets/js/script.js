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
  let factionCSS = card.attributes.faction_id
  let formattedFaction = card.attributes.faction_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/Nbn/g, 'NBN').replace(/Haas/g, 'Haas-');          

    return $("<div>'").html(                                      
      "<h1 class='cardTitle'>" + card.attributes.title + "</h1><em><p class='cardFaction'>" + formattedFaction + "</p></em>").addClass("cardEntry").addClass(factionCSS);
    });

    filteredCards.sort((a, b) => {
      let factionA = $(a).find('.cardFaction').text();
      let factionB = $(b).find('.cardFaction').text();
      console.log(factionA, factionB);
      if (factionA < factionB) return -1;
      if (factionB > factionB) return 1;
      return 0;
    });
$("#allCards").sort().append(filteredCards);
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
side = "corp" //runner or corp
let userCardTypes = await getCardTypes(side);
cardType = userCardTypes[2].id //see console.log for available choices filtered by side
filterCards("card_type_id", cardType, side);
}


main(userSide);