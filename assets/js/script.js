const apiLink = "https://api-preview.netrunnerdb.com/api/v3/public/"
const apiImagesLink = "https://card-images.netrunnerdb.com/v2/large/" 
let userSide = ""
let filteredCardsGlobal = []



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

  //fetch the different types of cards filtered by selected side
async function getCardTypes(side) {
  let fetchTypes =  await fetch("https://api-preview.netrunnerdb.com//api/v3/public/card_types")
  let cardTypesJSON = await fetchTypes.json();
  let cardTypes = cardTypesJSON.data;
  let availableTypes = cardTypes.filter(type => type.attributes.side_id === side)
  console.log(availableTypes)
  return availableTypes
  }  


//filter requested cards
async function filterCards(cardProperty = "", cardFilter = "", side = "") {

  let allCards = await fetchCards(apiLink, "cards", "side_id", side);
  let filteredCards = allCards.filter(card => card.attributes[cardProperty] === cardFilter);
  filteredCards.sort((a, b) => {
    let factionA = a.attributes.faction_id
    let factionB = b.attributes.faction_id
 
    return factionA.localeCompare(factionB)
    });
    return filteredCards
  }

//populate #allCards with card entries
  function populateCards(cards) {
    $("#allCards").empty(); //clear cards when called
    
    cards.forEach(card => {
      let factionID = card.attributes.faction_id
      let factionIcon = `/assets/images/NSG-Visual-Assets/SVG/FactionGlyphs/NSG_${factionID}.svg`
      //horrible regex to format factions nicely
      let formattedFaction = card.attributes.faction_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/Nbn/g, 'NBN').replace(/Haas/g, 'Haas-');
      let formattedCardType = card.attributes.card_type_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      
      //html for allCards entries
      let cardHTML = `
      <div class="cardEntry ${factionID}">
        <div class='row faction_icon'>
          <img src = ${factionIcon}>
        </div>
        <div class=col>
          <h2 class='cardTitle'>
            ${card.attributes.title}
          </h2>
          <p class='cardFaction'><b>Faction:</b>&nbsp${formattedFaction}</p>
          <p class='cardFaction'>${formattedCardType}</p>
        </div>
      </div>`

    $('#allCards').append(cardHTML);
//attach eventListners to cardEntries
$(".cardEntry").last().click(() => {
  handleCardClick(card);
});
  });


};

//onClick logic for divs
function handleCardClick(cardData) {
  let cardId = cardData.attributes.latest_printing_id
  console.log(cardId)
  
 $("#stage-card-display").html(`
    <h1>${cardData.id}</h1>
    <p>Faction: ${cardData.attributes.faction_id}</p>
    <p>Card Type: ${cardData.attributes.card_type_id}</p>
    <p>Card Text: ${cardData.attributes.text}</p>
    `)
 
}



//Main function, for calling other functions
async function main(side) {
side = "corp" //runner or corp
let userCardTypes = await getCardTypes(side);
cardType = userCardTypes[4].id //see console.log for available choices filtered by side
let filteredCards = await filterCards("card_type_id", cardType, side);
populateCards(filteredCards);
}

main(userSide);

