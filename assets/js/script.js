const apiLink = "https://api-preview.netrunnerdb.com/api/v3/public/"
const apiImagesLink = "https://card-images.netrunnerdb.com/v2/large/" 
const userSelectedID = false

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
async function populateCards(cards, side) {
    $("#allCards").empty(); //clear cards when called
    $("#allCards").show();
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
    console.log(card)
    populateStage( card, side );
    });
  });
};

//code for fetching images if a dev API key is obtained  
//  let cardImageID = cardData.attributes.latest_printing_id;
//  let cardImageUrl = apiImagesLink+cardImageID;
// async function fetchCardImage(cardID) {
// const response = await fetch(apiImagesLink+cardID);
// return response;
// }

//onClick logic for divs
function populateStage(cardData, side) {   

  let formattedFaction = cardData.attributes.faction_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/Nbn/g, 'NBN').replace(/Haas/g, 'Haas-');
  let formattedCardType = cardData.attributes.card_type_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  let cardHTML = "";
  if (side == "corp") {
    switch (cardData.attributes.card_type_id) {
      case 'agenda':
        cardHTML = `
        <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
          <h1 class="text-center">${cardData.attributes.title}</h1>
          <h2 class="text-center">${formattedFaction}</h2>
          <p class="col align-content-center ">
            <em>Agenda Points: </em>
            <img class="credit" src=
          "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_AGENDA.svg"> ${cardData.attributes.agenda_points} <span>&nbsp&nbsp|&nbsp&nbsp<em>Advancement Points: </em>${cardData.attributes.advancement_requirement}</em></p>
          <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em> </p></span><br><br>
          <p>${cardData.attributes.stripped_text}</p>
        </div>` 
        $("#main-stage").html(cardHTML)      
        break; 
      case "asset":
      case "operation":
      case "upgrade":
          cardHTML = `
          <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
            <h1 class="text-center">${cardData.attributes.title}</h1>
            <h2 class="text-center">${formattedFaction}</h2>
            <p class="col align-content-center ">
              <em>Cost: </em><img class="credit" src=
              "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_CREDIT.svg">${cardData.attributes.cost}<span>&nbsp&nbsp|&nbsp&nbsp<em>Trash: </em>
              <img class="credit" src=
              "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_TRASH_COSTbw.svg">${cardData.attributes.trash_cost}&nbsp&nbsp|&nbsp&nbsp<em>Influence: </em>
              ${cardData.attributes.influence_cost}
            </p>
            <span>
              <p>
                <Strong>${formattedCardType}</Strong>
                &nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em>
              </p>
            </span>
            <br><br>
            <p>${cardData.attributes.stripped_text}</p>
          </div>`
           $("#main-stage").html(cardHTML)
           break;
      case "ice":  
        cardHTML = `
          <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
            <h1 class="text-center">${cardData.attributes.title}</h1>
            <h2 class="text-center">${formattedFaction}</h2>
            <p class="col align-content-center "><em>Rez Cost: </em><img class="credit" src=
            "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_REZ_COST.svg"> ${cardData.attributes.cost}<span>&nbsp&nbsp|&nbsp&nbsp
            <em>Strength: </em>${cardData.attributes.strength}
            <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em></p></span><br>
            <p>${cardData.attributes.stripped_text}"</p>
          </div>`
          $("#main-stage").html(cardHTML)  
          break;
      case "corp_identity":
        cardHTML = `
        <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
          <h1 class="text-center">${cardData.attributes.title}</h1>
          <h2 class="text-center">${formattedFaction}</h2>
          <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em><br><br>
          <strong>Minimum Deck Size: </strong>${cardData.attributes.minimum_deck_size}<br>
          <strong>Influence: </strong>${cardData.attributes.influence_limit}</p></span> </p></span>
          <p>${cardData.attributes.stripped_text}</p>
          <div class="row">
            <div class="center-text">
              <button class="userID col" type="button">Build deck with this ID</button>
            </div>
          </div>
        </div>`
        $("#main-stage").html(cardHTML)  
        $(".userID").off().on("click", () => addToDeck(cardData));  
        break; 
        }
      }
    
  if (side == "runner"){
    switch (cardData.attributes.card_type_id) {
      case "hardware":
      case "resource":
      case "program":
      case "event":
          cardHTML = `
          <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
            <h1 class="text-center">${cardData.attributes.title}</h1>
            <h2 class="text-center">${formattedFaction}</h2>
            <p class="col align-content-center ">
              <em>Cost: </em>
              <img class="credit" src=
            "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_CREDIT.svg">${cardData.attributes.cost}<span>&nbsp&nbsp|&nbsp&nbsp<em>Influence: </em>${cardData.attributes.influence_cost}
              <span>&nbsp&nbsp|&nbsp&nbsp
              <em>Memory Cost: </em>
              <img class="credit" src=
              "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_Mu.svg">${cardData.attributes.memory_cost}
              <p><Strong>${formattedCardType}</Strong>
              &nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em></p></span>
            <p>${cardData.attributes.stripped_text}</p>
          </div>`
           $("#main-stage").html(cardHTML)
           break;
      case "runner_identity":
        cardHTML = 
        `<div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
          <h1 class="text-center">${cardData.attributes.title}</h1>
          <h2 class="text-center">${formattedFaction}</h2>
          <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em>
          <br><strong>Link: </strong>${cardData.attributes.base_link}<br>
          <strong>Minimum Deck Size: </strong>${cardData.attributes.minimum_deck_size}<br>
          <strong>Influence: </strong>${cardData.attributes.influence_limit}</p></span>
          <p>${cardData.attributes.stripped_text}</p>
          <div class="row ">
              <div class="center-text">
                <button class="userID col" type="button">Build deck with this ID</button>
              </div>
          </div>
        </div>`
        break;   
    }
  } 
  $("#main-stage").html(cardHTML)
  $(".userID").off().on("click", () => addToDeck(cardData));  
};


async function populateControls(side) {
  $("#filterCardsControls").empty();
  let cardTypes = await getCardTypes(side);
  
  for (let type of cardTypes) {
    let formattedCardType = type.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    let changeSideButtons = `
    <div class="row changeSideOption">
      <img class="sideRunner" src="assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_LINK.svg">
      <p>Runner</p>
    </div>
    <div class="row changeSideOption">
      <img class="sideCorp" src="assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_AGENDA.svg">
      <p>Corporation</p>
    </div>"`

    var newRadioButton = document.createElement('input');
    newRadioButton.type = 'radio';
    newRadioButton.id = type.id;
    newRadioButton.value = type.id;
    newRadioButton.name = "cardType"
    let newLabel = document.createElement('label');
    newLabel.htmlFor = type.id
    newLabel.textContent = formattedCardType;
    $("#changeSide").html = changeSideButtons
    $("#filterCardsControls").append(newRadioButton, newLabel);    
    
    newRadioButton.addEventListener('click', function() {
      (async () => {
          // Filter cards based on the selected card type
          let filteredCards = await filterCards("card_type_id", type.id, side);
          // Populate cards with filtered cards
          populateCards(filteredCards, side);}
          )();
        });
    }; 
  };

function addToDeck(card) {
  alert(card.attributes.title)
}

//Main function, use for calling other functions and hooking into user interface
async function main(side, startingPage) {
  let userCardTypes = await getCardTypes(side);
  let cardType = await userCardTypes[startingPage].id //see console.log for available choices filtered by side
  let filteredCards = await filterCards("card_type_id", cardType, side);
  populateCards(filteredCards, side);
  populateControls(side);  
}

$(document).ready(function(){
  $("#allCards").hide();
  $("#sideRunner").on("click", function() {
    main("runner", 4)
  });


  
  $("#sideCorp").on("click", function(){
    main("corp", 2)
  });
});
