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
        <img class="row faction_icon" src = ${factionIcon}>
        <div class="col">
          <h2 class='card-title'>
            ${card.attributes.title}
          </h2>
          <p class='cardFaction'>${formattedFaction}</p>
          <p class='cardFaction'><strong>${formattedCardType}</strong> | ${card.attributes.display_subtypes}</p>
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

  let agendaHTML = `
  <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
    <h1 class="text-center">${cardData.attributes.title}</h1>
    <p class="col align-content-center "><em>Agenda Points: </em><img class="credit" src=
    "assets/images/NSG-Visual-Assets/SVG/Game Symbols/NSG_AGENDA.svg"> ${cardData.attributes.agenda_points} <span>&nbsp&nbsp|&nbsp&nbsp<em>Advancement Points: </em>${cardData.attributes.advancement_requirement}</em></p>
    <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em> </p></span>
    <p>${cardData.attributes.stripped_text}</p>
  </div>
  `
  let assetHTML = `
    <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
      <h1 class="text-center">${cardData.attributes.title}</h1>
      <p class="col align-content-center "><em>Cost: </em><img class="credit" src=
      "assets/images/NSG-Visual-Assets/SVG/Game Symbols/NSG_CREDIT.svg">${cardData.attributes.cost}<span>&nbsp&nbsp|&nbsp&nbsp<em>Trash: </em><img class="credit" src=
      "assets/images/NSG-Visual-Assets/SVG/Game Symbols/NSG_TRASH_COSTbw.svg">${cardData.attributes.trash_cost}&nbsp&nbsp|&nbsp&nbsp<em>Influence: </em>${cardData.attributes.influence_cost}</p>
      <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em> </p></span>
      <p>${cardData.attributes.text}</p>
    </div>
  `  
  let iceHTML = `
    <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
      <h1 class="text-center">${cardData.attributes.title}</h1>
      <p class="col align-content-center "><em>Rez Cost: </em><img class="credit" src=
      "assets/images/NSG-Visual-Assets/SVG/Game Symbols/NSG_REZ_COST.svg"> ${cardData.attributes.cost}<span>&nbsp&nbsp|&nbsp&nbsp
      <em>Strength: </em>${cardData.attributes.strength}
      <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em> </p></span>
      <p>${cardData.attributes.stripped_text}"</p>
    </div>
  `

  let identityHTML = `
  <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
    <h1 class="text-center">${cardData.attributes.title}</h1>
    <p class="col align-content-center "><em>Cost: </em><img class="credit" src=
    "assets/images/NSG-Visual-Assets/SVG/Game Symbols/NSG_CREDIT.svg">${cardData.attributes.cost}<span>&nbsp&nbsp|&nbsp&nbsp<em>Trash: </em><img class="credit" src=
    "assets/images/NSG-Visual-Assets/SVG/Game Symbols/NSG_TRASH_COSTbw.svg">${cardData.attributes.trash_cost}&nbsp&nbsp|&nbsp&nbsp<em>Influence: </em>${cardData.attributes.influence_cost}</p>
    <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em> </p></span>
    <p>${cardData.attributes.stripped_text}</p>
  </div>
`


let operationHTML = `
<div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
  <h1 class="text-center">${cardData.attributes.title}</h1>
  <p class="col align-content-center "><em>Cost: </em><img class="credit" src=
  "assets/images/NSG-Visual-Assets/SVG/Game Symbols/NSG_CREDIT.svg">${cardData.attributes.cost}<span>&nbsp&nbsp|&nbsp&nbsp<em>Trash: </em><img class="credit" src=
  "assets/images/NSG-Visual-Assets/SVG/Game Symbols/NSG_TRASH_COSTbw.svg">${cardData.attributes.trash_cost}&nbsp&nbsp|&nbsp&nbsp<em>Influence: </em>${cardData.attributes.influence_cost}</p>
  <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em> </p></span>
  <p>${cardData.attributes.stripped_text}</p>
</div>
`

let upgradeHTML = `
<div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
  <h1 class="text-center">${cardData.attributes.title}</h1>
  <p class="col align-content-center "><em>Cost: </em><img class="credit" src=
  "assets/images/NSG-Visual-Assets/SVG/Game Symbols/NSG_CREDIT.svg">${cardData.attributes.cost}<span>&nbsp&nbsp|&nbsp&nbsp<em>Trash: </em><img class="credit" src=
  "assets/images/NSG-Visual-Assets/SVG/Game Symbols/NSG_TRASH_COSTbw.svg">${cardData.attributes.trash_cost}&nbsp&nbsp|&nbsp&nbsp<em>Influence: </em>${cardData.attributes.influence_cost}</p>
  <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em> </p></span>
  <p>${cardData.attributes.stripped_text}</p>
</div>
`
  
  $("#main-stage").html(iceHTML)
}

//Main function, use for calling other functions and hooking into user interface
async function main(side) {
side = "runner" //runner or corp
let userCardTypes = await getCardTypes(side);
cardType = userCardTypes[3].id //see console.log for available choices filtered by side
let filteredCards = await filterCards("card_type_id", cardType, side);
populateCards(filteredCards);
}

main(userSide);

