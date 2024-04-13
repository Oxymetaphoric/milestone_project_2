const apiLink = "https://api-preview.netrunnerdb.com/api/v3/public/"



//connect to netrunnerdb and fetch cards with a url crafted from arguments
async function fetchCards(apiLink, filter, param) {
  const response = await fetch(`${apiLink}cards?filter[${filter}]=${param}`);
  const data = await response.json();
  
  let next = data.links.next;
  let prev = data.links.prev;
//call function recursively, while data.links.next has a truthy value, i.e until there are no more pages
  if (next) {
    const nextData = await fetchCards(next);
    data.data = [...data.data, ...nextData];
  }
//return an concatenated array of card objects
  return data.data;
  }

//filter returned cards
//TODO replace hardcoded values with passed values 
async function filterCards(cardProperty, cardFilter) {
  let allCards = await fetchCards(apiLink, "side_id","runner");
  let attributeFilter = cardFilter;

  let filteredCards = allCards.filter(card => card.attributes[cardProperty] === attributeFilter).map(card => {
   return $("<div>").html("<h1>" + card.attributes.title + "</h1>");("#allCards");
  }
);
      $("#allCards").append(filteredCards);
    }
    
  


filterCards("card_type_id", "runner_identity");





