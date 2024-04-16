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

//populate #allCards div with card entries
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
      <div class="row cardEntry ${factionID}">
        <div class='col faction_icon'>
          <img class="faction_icon" src = ${factionIcon}>
        </div>
        <div>
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
    populateStage(card);
    });
  });
};

//code for fetching images if a dev API key is obtained
// async function fetchCardImage(cardID) {
// const response = await fetch(apiImagesLink+cardID);
// return response;
// }

//onClick logic for divs
function populateStage(cardData) {
  let cardId = cardData.attributes.latest_printing_id
  let formattedFaction = cardData.attributes.faction_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/Nbn/g, 'NBN').replace(/Haas/g, 'Haas-');
  let formattedCardType = cardData.attributes.card_type_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
//  let cardImageID = cardData.attributes.latest_printing_id;
//  let cardImageUrl = apiImagesLink+cardImageID;
//  code to allow fetching of card images from the private endpoint of the API. Not implementable under the public endpoint
console.log(cardData)
let stageHTML = `
  <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
    <h1>${cardData.attributes.title}</h1>
    <p>Faction: ${formattedFaction}</p>
    <p>Cost: </p>
    <p>Card Type: ${formattedCardType}</p>
    <p>Card Text: ${cardData.attributes.text}</p>
  </div>
`
  

  $("#main-stage").html(stageHTML)

}

//Main function, for calling other functions
async function main(side) {
side = "corp" //runner or corp
let userCardTypes = await getCardTypes(side);
cardType = userCardTypes[2].id //see console.log for available choices filtered by side
let filteredCards = await filterCards("card_type_id", cardType, side);
populateCards(filteredCards);
}

main(userSide);

