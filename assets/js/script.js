const apiLink = "https://api-preview.netrunnerdb.com/api/v3/public/"


async function fetchCards(link, filter, param) {
  const response = await fetch(`${link}cards?filter[${filter}]=${param}`);
  const data = await response.json();
  let next = data.links.next;
  let prev = data.links.prev;
//call function recursively until there are no more pages
  if (next) {
    const nextData = await fetchCards(next, "side_id", "runner");
    data.data = [...data.data, ...nextData];
  }

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





