const apiLink = "https://api-preview.netrunnerdb.com/api/v3/public/"
const userSelectedID = false

let userDeck = {
  title: null,
  side: null,
  faction: null,
  deck_id: {},
  id_title: "",
  id_subtype: "",
  min_deck_size: null,
  avail_influence: null,
  base_link: null,
  cards: [],
}

//connect to netrunnerdb and fetch cards with a url crafted from arguments passed to the function
async function fetchCards(apiLink, filter = "", param = "", side) {
  const response = await fetch(`${apiLink}${filter}?filter[${param}]=${side}`);
  const data = await response.json();
//fetch links for next and prev pages of data
  let next = data.links.next;
  let prev = data.links.prev;
//call function recursively, while data.links.next has a truthy value, i.e until there are no more pages
  if (next) {
    const nextData = await fetchCards(next);
//spread returned data to array
    data.data = [...data.data, ...nextData];
  }
//return an array of all card objects in database 
return data.data;
  }

  //fetch the different types of cards filtered by selected side
async function getCardTypes(side) {
  let fetchTypes =  await fetch("https://api-preview.netrunnerdb.com//api/v3/public/card_types")
  //call fetchTypes and convert to json
  let cardTypesJSON = await fetchTypes.json();
  let availableTypes = cardTypesJSON.data.filter(type => type.attributes.side_id === side)
  //return an array of strings, containing the different card types of a specified side
  return availableTypes
  }  

//filter requested cards by subtype, could extend to filter by any property in theory
async function filterCards(cardProperty = "", cardFilter = "", side = "") {
//uses hardcoded values currently but this could be amended in the future
  let allCards = await fetchCards(apiLink, "cards", "side_id", side); 
//this nasty little arrow function assigns an array of all the card objects whose property matches the cardFilter argument
  let filteredCards = allCards.filter(card => card.attributes[cardProperty] === cardFilter);
//cards are then sorted. For now simply by alphebetising the faction_id property, but this could be modified to accept different criteria
  filteredCards.sort((a, b) => {
    let factionA = a.attributes.faction_id
    let factionB = b.attributes.faction_id
 
    return factionA.localeCompare(factionB)
    });
//function returns an ordered, filtered array of card objects
    return filteredCards
  }

//generate divs and html then populate #allCards div
async function populateCards(cards, side) {
    $("#allCards").empty(); //clear cards when called
    $("#allCards").show();
    cards.forEach(card => {
      let factionID = card.attributes.faction_id
      let factionIcon = `/assets/images/NSG-Visual-Assets/SVG/FactionGlyphs/NSG_${factionID}.svg`
      //horrible regex to format factions nicely, this could be refactored into it's own function, as it is used in a few places 
      let formattedFaction = card.attributes.faction_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/Nbn/g, 'NBN').replace(/Haas/g, 'Haas-');
      let formattedCardType = card.attributes.card_type_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      //html for allCards entries
      //define HTML for cards in the card navigation section
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
//append each card to the card navigation section
    $('#allCards').append(cardHTML);
  //attach eventListners to cardEntries to send clicked card information and user side to main Stage
  $(".cardEntry").last().click(() => {
    populateStage( card, side );
    });
  });
};

//code for fetching images if a dev API key is obtained: 
//
//  const apiImagesLink = "https://card-images.netrunnerdb.com/v2/large/" 
//  let cardImageID = cardData.attributes.latest_printing_id;
//  let cardImageUrl = apiImagesLink+cardImageID;
//
//  async function fetchCardImage(cardID) {
//  const response = await fetch(apiImagesLink+cardID);
//  return response;
//  }

//onClick logic for divs
function populateStage(cardData, side) {   
//here's that annoying string of regex again! 
  let formattedFaction = cardData.attributes.faction_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/Nbn/g, 'NBN').replace(/Haas/g, 'Haas-');
  let formattedCardType = cardData.attributes.card_type_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  let cardHTML = "";
//blank cardHTML and then detect user side and apply correct card html. I think this could almost certainly be refactored but it works for now 
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
        break; 
      case "asset":
      case "operation":
      case "upgrade":
          cardHTML = `
          <div class="${cardData.attributes.faction_id} cardDisplay rounded-3">
            <h1 class="text-center">${cardData.attributes.title}</h1>
            <h2 class="text-center">${formattedFaction}</h2>
            <p class="col align-content-center ">
              <em>Cost: </em>
              <img class="credit" src=
              "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_CREDIT.svg">${cardData.attributes.cost}
              <span id="trashCost">&nbsp&nbsp|&nbsp&nbsp<em>Trash: </em>
              <img class="credit" src=
              "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_TRASH_COSTbw.svg">${cardData.attributes.trash_cost}&nbsp&nbsp|</span>
              <span>
                &nbsp&nbsp
                <em>Influence: </em>
                ${cardData.attributes.influence_cost}
              </span>
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
        break; 
        }
      }
//same code as above but for the runner player
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
           
            <span id="memoryCost">&nbsp&nbsp|&nbsp&nbsp
              <em>Memory Cost: </em>
              <img class="credit" src=
              "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_Mu.svg">${cardData.attributes.memory_cost ? cardData.attributes.memory_cost : ""}
            </span>
              <span>
                <p>
                  <Strong>${formattedCardType}</Strong>
                  &nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em>
                </p>
              </span>
            <p>${cardData.attributes.stripped_text}</p>
          </div>`
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
//populate stage with required html
  $("#main-stage").html(cardHTML) 
//conditional formatting for cards 
  cardData.attributes.memory_cost == null ? $("#memoryCost").hide() : $("#memoryCost").show();
  cardData.attributes.trash_cost == null ?  $("#trashCost").hide() :  $("#trashCost").show();
//add event listeners to each card entry
  $(".userID").off().on("click", () => addToDeck(cardData, side));  
};

// populate the options section 
async function populateControls(side) {
//empty controls div each time function is called to prevent stacking  
  $("#filterCardsControls").empty();
//fetch card types waiting for response
  let cardTypes = await getCardTypes(side);
//iterate over the different types of cards
  for (let type of cardTypes) {
//apply conditional formatting, anything that exactly matches between /   / will be replaced \b \w/g takes the first character of each word
// then sends it to the uppercase fuinction and returns it uppercase
    let formattedCardType = type.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
//create new radio buttons based on the number of types of cards in cardTypes then assign it 
// various properties 
    var newRadioButton = document.createElement('input');
    newRadioButton.type = 'radio';
    newRadioButton.id = type.id;
    newRadioButton.value = type.id;
    newRadioButton.name = "cardType"
    let newLabel = document.createElement('label');
    newLabel.htmlFor = type.id
    newLabel.textContent = formattedCardType;
    
    $("#filterCardsControls").append(newRadioButton, newLabel);   
     
//give each radio button an event listener that runs the filterCard function based on the label of the radio button and then populates the filtered cards 
// to the card navigation section
    newRadioButton.addEventListener('click', function() {
      (async () => {
          // Filter cards based on the selected card type
          let filteredCards = await filterCards("card_type_id", type.id, side);
          // Populate cards with filtered cards
          populateCards(filteredCards, side);}
          )();
        });
    }; 
  $("#changeSide").HTML(changeSideButtons);
  };


//function called when user wishes to add a card to their deck 
function addToDeck(card, side) {
  console.log(card)
  console.log(userDeck)
  let userDeck = {
    title: null,
    side: null,
    faction: null,
    deck_id: {},
    id_title: "",
    id_subtype: "",
    min_deck_size: null,
    avail_influence: null,
    base_link: null,
    cards: [],
  }

if (card.attributes.card_type_id === /[a-z]_/+"identity"){
    console.log("this is an ID!")
}

}

//Main function, use for calling other functions and hooking into user interface
async function main(side, startingPage) {
  let userCardTypes = await getCardTypes(side);
  let cardType = await userCardTypes[startingPage].id;
  let filteredCards = await filterCards("card_type_id", cardType, side);
  populateCards(filteredCards, side);
  populateControls(side);
  $("#userControls").hide() 
}
//function runs on page load and initialises the app. Hiding unwanted empty elements, and running main
$(document).ready(function(){
  $("#allCards").hide();
  $("#sideRunner").on("click", function() {
    main("runner", 4);
  });
  $("#sideCorp").on("click", function(){
    main("corp", 2);
  });
  $("#runnerSwitch").on("click", function() {
    $("#main-stage").empty();
    main("runner", 4);
  });
  $("#corpSwitch").on("click", function(){
    $("#main-stage").empty(); 
    main("corp", 2);
  });
});
