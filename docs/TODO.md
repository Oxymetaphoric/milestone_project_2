# TODO

## Javascript

- ~~skeleton out required functions for manipulating cards~~
- ~~write function to connect to API and grab data~~
- ~~write  function to parse data to JSON~~
- ~~generalise the filterToId function~~
- ~~add interactivity to divs~~
- ~~display card information on stage~~
- ~~function that attaches a css class based on the card.attributes.faction_id string~~
- ~~separate out filtering and populating logic in allCards~~
- ~~build out controls section logic~~
- ~~build out adding cards to your deck logic~~
  - ~~define card object parameters~~
  - ~~track and cap out of faction cards in users deck via 'Influence' card property (card.attributes.influence(?))~~
- ~~build out deck-building restriction logic:~~
  - ~~max 3 copies of any card~~
  - ~~only 1 copy of unique cards~~
  - ~~modify populateCards function to accept a target parameter to determine which div to populate and with what~~
  - only show one copy of each card object in deck (use a set? or use filtered array produced when count is run?)
  - ~~add loading gif, preload in html~~

## HTML

- ~~import and link bootstrap, jQuery, and fontAwesome~~
- ~~sketch out basic areas for js to interact with~~
- ~~build out controls area~~
- ~~build out stage area~~
- faction filter controls
- ~~404 page~~

## CSS - ~~import fonts and set up initial styling~~
- ~~style cardEntry w/ background image etc.~~
- ~~layout and styling for all elements~~
- ~~style controls~~
- ~~UI/UX overhaul:~~
  - ~~deck and card list styled better, no horizontal scroll etc.~~
  - ~~feedback on buttons (:onHover etc.)~~
  - ~~'loading' text/anims~~
  - ~~deck entry UI to include a trash button to remove the card~~
  - deck entry UI to include a count of how many copies of a card are in the deck X
- media queries

## Other

- ~~Do I need an API key to access the images on netrunner db?~~
  - yes. Devs contacted, yet to hear back
- ~~modal instructions on main page~~ //no use initial html on the stage area for intro and instructions
- ~~background image~~
- Testing
- ~~More instruction text throughout app~~

## README

- Extend project rationale (audience needs met etc.)
- Testing
- expand UX documentation
- expand deployment section
- ~~spellcheck readme~~
