const apiLink = "https://api-preview.netrunnerdb.com/api/v3/public/"


async function fetchCards(link, filter, side) {
  const response = await fetch(`${apiLink}cards?filter[${filter}]=${side}`);
  const data = await response.json();
  return data.data;
  }

async function getAndLogCards() {
  let allCards = await fetchCards(apiLink, "side_id", "runner");
  return allCards
  }
  
//extract only IDs
async function extractIDs() {
  let allCards = await getAndLogCards();
  console.log(allCards)
  let ids =[];
  for (let card of allCards) {
    if (card.attributes.card_type_id === 'runner_identity') {
      ids.push(card);
      $("<div>").html("<h1>" + card.attributes.title + "</h1>").appendTo("#allCards");
      }
    } 
    
  }


extractIDs();






