const apiLink = "https://api-preview.netrunnerdb.com/api/v3/public/";
const allCardsDiv = "#allCards";
const myDeckDiv = "#myDeck";
const count = (deck, attribute, card) => deck.cards.filter(item => item.attributes[attribute] === card.attributes[attribute]).length;
//initialise the userDeck object with null values 
let userSelectedID = false;
//refactor into function
let userDeck = {};

function initializeUserDeck(){
  return {
  title: null,
  side: null,
  faction: null,
  deck_id: {},
  id_title: "",
  id_subtype: "",
  min_deck_size: null,
  current_deck_size: null,
  total_influence: null,
  current_influence: null,
  base_link: null,
  description: null,                 
  cards: [],
  userSelectedID: false
  };
}

function nullDeck() {
  $(myDeckDiv).empty();
  $(myDeckDiv).hide();
  userDeck = initializeUserDeck();

}
nullDeck()

//connect to netrunnerdb and fetch cards with a url crafted from arguments passed to the function
async function fetchCards(apiLink, filter = "", param = "", side) {
  const response = await fetch(`${apiLink}${filter}?filter[${param}]=${side}`);
  const data = await response.json();

//call function recursively, while data.links.next has a truthy value, i.e until there are no more pages
  if (data.links.next) {
    const nextData = await fetchCards(data.links.next);
//spread returned data to array
    data.data = [...data.data, ...nextData];
  }
//return an array of all card objects in database 
return data.data;
  }

  //fetch the different types of cards filtered by selected side
async function getCardTypes(side) {
  let fetchTypes =  await fetch(`${apiLink}card_types`)
  //call fetchTypes and convert to json
  let cardTypesJSON = await fetchTypes.json();
  return cardTypesJSON.data.filter(type => type.attributes.side_id === side)
  //return an array of strings, containing the different card types of a specified side

  }  

//filter requested cards by subtype, could extend to filter by any property in theory
async function filterCards(cardProperty = "", cardFilter = "", side = "") {
//uses hardcoded values currently but this could be amended in the future
  let allCards = await fetchCards(apiLink, "cards", "side_id", side); 
//this nasty little arrow function assigns an array of all the card objects whose property matches the cardFilter argument
  let filteredCards = allCards.filter(card => card.attributes[cardProperty] === cardFilter);
//cards are then sorted. For now simply by alphabetizing the faction_id property, but this could be modified to accept different criteria
  filteredCards.sort((a, b) => {
    let factionA = a.attributes.faction_id
    let factionB = b.attributes.faction_id
 
    return factionA.localeCompare(factionB)
    });
//function returns an ordered, filtered array of card objects
    return filteredCards
  }

//generate divs and html then populate #allCards div
async function populateCards(cards, side, targetDiv) {
    $(targetDiv).empty(); //clear cards when called 
    $(targetDiv).show();
    cards.forEach(card => {
      let factionID = card.attributes.faction_id
      let factionIcon = `assets/images/NSG-Visual-Assets/SVG/FactionGlyphs/NSG_${factionID}.svg`
      //horrible regex to format factions nicely, this could be refactored into it's own function, as it is used in a few places 
      let formattedFaction = card.attributes.faction_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/Nbn/g, 'NBN').replace(/Haas/g, 'Haas-');
      let formattedCardType = card.attributes.card_type_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      //html for allCards entries
      //define HTML for cards in the card navigation section
      let cardHTML = `
      <div class="col row cardEntry ${factionID}">  
        <img class="row faction_icon" src = ${factionIcon}>
        <div class="col">
          <h2 class='card-title'>
            ${card.attributes.title}
          </h2>
          <p class='cardFaction'>${formattedFaction}</p>
          <p class='cardFaction'><strong>${formattedCardType}</strong>  ${card.attributes.display_subtypes ? "| "+card.attributes.display_subtypes : ""}</p>
        </div>
      </div>`
//append each card to the card navigation section
    $(targetDiv).append(cardHTML);
    });

    // Attach event listener to the parent container using event delegation
    $(targetDiv).off('click', '.cardEntry').on('click', '.cardEntry', async function() {
        let cardIndex = $(this).index();
        let card = cards[cardIndex];
        await populateStage(card, side);
    });
}

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
async function populateStage(cardData, side) {   
//here's that annoying string of regex again! 
  let formattedFaction = cardData.attributes.faction_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/Nbn/g, 'NBN').replace(/Haas/g, 'Haas-');
  let formattedCardType = cardData.attributes.card_type_id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  let cardHTML = "";
//blank cardHTML and then detect user side and apply correct card html. I think this could almost certainly be refactored but it works for now 
  if (side == "corp") {
    switch (cardData.attributes.card_type_id) {
      case 'agenda':
        cardHTML = `
        <div class="${cardData.attributes.faction_id} flex container-fluid cardDisplay rounded-3">
          <h1 class="text-center">${cardData.attributes.title}</h1>
          <h2 class="text-center">${formattedFaction}</h2>
          <p class="col align-content-center ">
            <em>Agenda Points: </em>
            <img class="credit" src=
          "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_AGENDA.svg"> ${cardData.attributes.agenda_points} 
          <span>&nbsp&nbsp|&nbsp&nbsp<em>Advancement Points: </em>${cardData.attributes.advancement_requirement}</em></p>
          <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : " " }</em> </p></span>
          <br><br>
          <p>${cardData.attributes.stripped_text}</p>
          ${userSelectedID && userDeck.faction === cardData.attributes.faction_id ? `<button class="addToDeckButton col" type="button">Add Card to Deck</button>` : ""}
            ${userSelectedID && userDeck.faction === cardData.attributes.faction_id ? `<button class="removeFromDeckButton col" type="button">Remove Card from Deck</button>` : ""}
        </div>`     
        break; 
      case "asset":
      case "operation":
      case "upgrade":
          cardHTML = `
          <div class="${cardData.attributes.faction_id} flex container-fluid cardDisplay rounded-3">
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
            ${userSelectedID ? `<button class="addToDeckButton col" type="button">Add Card to Deck</button>` : ""}
            ${userSelectedID ? `<button class="removeFromDeckButton col" type="button">Remove Card from Deck</button>` : ""}
          </div>`
           break;
      case "ice":  
        cardHTML = `
          <div class="${cardData.attributes.faction_id} flex container-fluid cardDisplay rounded-3">
            <h1 class="text-center">${cardData.attributes.title}</h1>
            <h2 class="text-center">${formattedFaction}</h2>
            <p class="col align-content-center "><em>Rez Cost: </em><img class="credit" src=
            "assets/images/NSG-Visual-Assets/SVG/GameSymbols/NSG_REZ_COST.svg"> ${cardData.attributes.cost}<span>&nbsp&nbsp|&nbsp&nbsp
            <em>Strength: </em>${cardData.attributes.strength}
            <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em></p></span><br>
            <p>${cardData.attributes.stripped_text}"</p>
            ${userSelectedID ? `<button class="addToDeckButton col" type="button">Add Card to Deck</button>` : ""}
            ${userSelectedID ? `<button class="removeFromDeckButton col" type="button">Remove Card from Deck</button>` : ""}
          </div>`
          break;
      case "corp_identity":
        cardHTML = `
        <div class="${cardData.attributes.faction_id} flex container-fluid cardDisplay rounded-3">
          <h1 class="text-center">${cardData.attributes.title}</h1>
          <h2 class="text-center">${formattedFaction}</h2>
          <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em><br><br>
          <strong>Minimum Deck Size: </strong>${cardData.attributes.minimum_deck_size}<br>
          <strong>Influence: </strong>${cardData.attributes.influence_limit}</p></span> </p></span>
          <p>${cardData.attributes.stripped_text}</p>
          ${!userSelectedID ? '<button class="userID col" type="button">Build deck with this ID</button>' : '<button class="userID col" type="button">Change IDs?</button>' } 
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
          <div class="${cardData.attributes.faction_id} flex container-fluid cardDisplay rounded-3">
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
                  <em>${cardData.attributes.display_subtypes == null ? "" : "&nbsp&nbsp|&nbsp&nbsp"+cardData.attributes.display_subtypes }</em>
                </p>
              </span>
            <p>${cardData.attributes.stripped_text}</p>
            ${userSelectedID ? `<button class="addToDeckButton col" type="button">Add Card to Deck</button>` : ""}
            ${userSelectedID ? `<button class="removeFromDeckButton col" type="button">Remove Card from Deck</button>` : ""}
          </div>`
           break;
      case "runner_identity":
        cardHTML = 
        `<div class="${cardData.attributes.faction_id} flex container-fluid cardDisplay rounded-3">
          <h1 class="text-center">${cardData.attributes.title}</h1>
          <h2 class="text-center">${formattedFaction}</h2>
          <span><p><Strong>${formattedCardType}</Strong>&nbsp&nbsp|&nbsp&nbsp<em>${cardData.attributes.display_subtypes ? cardData.attributes.display_subtypes : ""}</em>
          <br><strong>Link: </strong>${cardData.attributes.base_link}<br>
          <strong>Minimum Deck Size: </strong>${cardData.attributes.minimum_deck_size}<br>
          <strong>Influence: </strong>${cardData.attributes.influence_limit}</p></span>
          <p>${cardData.attributes.stripped_text}</p>
          ${!userSelectedID ? '<button class="userID col" type="button">Build deck with this ID</button>' : '<button class="userID col" type="button">Change IDs?</button>' } 
        </div>`
        break;   
    }
  } 
//populate stage with required html 
  $("#main-stage-display").html(cardHTML) 
//conditional formatting for cards 
  cardData.attributes.memory_cost == null ? $("#memoryCost").hide() : $("#memoryCost").show();
  cardData.attributes.trash_cost == null ?  $("#trashCost").hide() :  $("#trashCost").show();
//add event listeners to each card entry
  $(".userID").off().click( async () => { 
    $('#deckInfo').removeClass()
    $("#deckInfo").addClass(cardData.attributes.faction_id)
    await addToDeck(cardData, side);
  });  
  $(".addToDeckButton").off().click(async() => { 
    await addToDeck(cardData, side);
  });
$(".removeFromDeckButton").off().click(() => removeCard(cardData));
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
// then sends it to the uppercase function and returns it uppercase
    let formattedCardType = type.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
//create new radio buttons based on the number of types of cards in cardTypes then assign it 
// various properties 
    var newRadioButton = document.createElement('input');
    newRadioButton.type = 'radio';
    newRadioButton.id = type.id;
    newRadioButton.value = type.id;
    newRadioButton.name = "cardType"
    let newLabel = document.createElement('label');
    newLabel.htmlFor = type.id;
    newLabel.textContent = formattedCardType;
    $("#filterCardsControls").append(newRadioButton, newLabel);   
//give each radio button an event listener that runs the filterCard function based on the label of the radio button and then populates the filtered cards 
// to the card navigation section
 newRadioButton.addEventListener('click', async () => {
    // Filter the cards based on the card type ID, type ID, and side
    let filteredCards = await filterCards("card_type_id", type.id, side);
    await populateCards(filteredCards, side, allCardsDiv);
    updateDeckInfo();
    });
  }  
}

// Function called when user wishes to add a card to their deck 
async function addToDeck(card, side) {
    // Function to count cards in the deck by a specific attribute
    const count = (deck, attribute, card) => deck.cards.filter(item => item.attributes[attribute] === card.attributes[attribute]).length;

    if (card.attributes.card_type_id.includes("identity")) {
        nullDeck();
        Object.assign(userDeck, {
            title: card.attributes.title,
            side: side,
            faction: card.attributes.faction_id,
            deck_id: card,
            id_title: card.attributes.title,
            id_subtype: card.attributes.display_subtypes,
            min_deck_size: card.attributes.minimum_deck_size,
            current_influence: 0,
            total_influence: card.attributes.influence_limit,
            description: card.attributes.stripped_text,
            base_link: card.attributes.base_link,
        });
        userSelectedID = true;
         $(myDeckDiv).empty();
    } else if (userSelectedID) {
        // Count the current number of this card in the deck
        let currentCardCount = count(userDeck, 'title', card);
        // Check if the card can be added to the deck
        let canAddCard = (currentCardCount < card.attributes.deck_limit) && 
                         (userDeck.current_influence + card.attributes.influence_cost <= userDeck.total_influence || card.attributes.faction_id === userDeck.faction);
        if (canAddCard) {
            userDeck.cards.push(card);
            userDeck.current_deck_size = userDeck.cards.length;
            if (userDeck.faction != card.attributes.faction_id){
              userDeck.current_influence += card.attributes.influence_cost;
            }
            await populateCards(userDeck.cards, side, myDeckDiv);
        } else { 
            if (currentCardCount >= card.attributes.deck_limit) {
              alert("Unable to add to deck. Too many copies")
              } 
            else if (userDeck.current_influence += card.attributes.influence_cost > userDeck.total_influence){
              alert("not enough influence")
            }
          }
      }
    updateDeckInfo();
}

function removeCard(card) {
    const count = (deck, attribute, card) => deck.cards.filter(item => item.attributes[attribute] === card.attributes[attribute]).length;
    cardCount = count(userDeck, 'title', card);
    userDeck.cards = userDeck.cards.filter(item => item !== card);
    userDeck.current_deck_size = userDeck.cards.length;
    if (card.attributes.faction_id != userDeck.faction){
      userDeck.current_influence > 0 ? userDeck.current_influence -= card.attributes.influence_cost * cardCount : userDeck.current_influence = userDeck.current_influence;
    }
    $(`#${card.id}`).remove();

    if (card.attributes.card_type_id.includes("identity")) {
      nullDeck();
      $('#deckInfo').removeClass();
    }

    updateDeckInfo();
    populateCards(userDeck.cards, userDeck.side, myDeckDiv);
}

function updateDeckInfo() {
    let deckInfoHTML = `
    <div class="row">
        <p class="instructionText text-center">${userSelectedID ? "" : "Please select an ID from the list on the left"}</p>
        <div class="col">
            <p class="col deckIDtitle"><strong>${userDeck.title || " "}</strong><br/><em>${userDeck.side || " "}</em></p>
            <p>${userDeck.description || " "}</p>  
            <div class="col">
                <p class="deckSize"><strong>Deck Size: </strong>${userDeck.current_deck_size || "0"} / ${userDeck.min_deck_size || " "}</p>
                <p class="deckInfluence"><strong>Influence: </strong>${userDeck.current_influence || "0"} / ${userDeck.total_influence || " "}</p>
                <p class="deckLink"><strong>Base Link: </strong>${userDeck.base_link || "0"}</p>
            </div>
        </div>
    </div>`;
    // Update the deck info section with the new HTML
    $("#deckInfo").html(deckInfoHTML);
}

//Main function, use for calling other functions and hooking into user interface
async function main(side, startingPage) {
  let userCardTypes = await getCardTypes(side);
  let cardType = await userCardTypes[startingPage].id;
  let filteredCards = await filterCards("card_type_id", cardType, side);
  await populateCards(filteredCards, side, allCardsDiv);
  await populateControls(side);
  $(".overlay").hide();
  $(".cardEntry").last().click(async () => {
    await populateStage(card, side);
  });
}
//function runs on page load and initialises the app. Hiding unwanted empty elements, and running main
$(document).ready(async function(){  
  $(deckInfo).hide();
  $(allCardsDiv).hide();
  $(myDeckDiv).hide();
  $(".overlay").hide();
  $("#sideRunner").click(async() => {
    $(".overlay").show();
    $("#main-stage-display").empty();
    $("#deckInfo").show();
    userSelectedID=false; 
    updateDeckInfo();
    await main("runner", 4);
  });
  $("#sideCorp").click(async() => {
    $(".overlay").show();
    $("#main-stage-display").empty();
    $("deckInfo").show();
    userSelectedID=false;
    updateDeckInfo();
    await main("corp", 2);
  });
  $("#switchRunner").click(async() => {
    $(".overlay").show();
    $("#main-stage-display").empty();
    nullDeck();
    $("#deckInfo").removeClass();
    userSelectedID=false;
    updateDeckInfo();
    await main("runner", 4);
  });
  $("#switchCorp").click(async() => {
    $(".overlay").show();
    $("#main-stage-display").empty(); 
    nullDeck();
    $("#deckInfo").removeClass();
    userSelectedID=false;
    updateDeckInfo();
    await main("corp", 2);
  });
  }
)
