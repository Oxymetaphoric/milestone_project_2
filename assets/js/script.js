const apiLink = "https://api-preview.netrunnerdb.com/api/v3/public/"


async function fetchCards(link, filter, param, page = 1) {
  const response = await fetch(`${link}cards?filter[${filter}]=${param}`);
  const data = await response.json();
  return data.data;
  }

async function getAllCards() {
  let allCards = await fetchCards(apiLink, "side_id", "runner");
  return allCards
  }
  
//filter returned cards
//TODO replace hardcoded values with passed values 
async function filterCards(cardProperty) {
  let allCards = await getAllCards();
  let filteredCards = allCards.filter(card => card.attributes[cardProperty] === 'runner_identity').map(card => {
   return $("<div>").html("<h1>" + card.attributes.title + "</h1>");("#allCards");
  }
);
      $("#allCards").append(filteredCards);
    }
    
  


filterCards("card_type_id");





