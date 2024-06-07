# Milestone Project :two:

[LIVE SITE](https://Oxymetaphoric.github.io/milestone_project_2/index.html)

---

## :world_map: Strategy

---

### Project Goals

This is my milestone two project for the [Code Institute's](http://www.codeinstitute.net/) *'Level 5 Diploma in Web Application Development'*. The goal of this project is to *Design, develop and implement a dynamic Front end web application using HTML, CSS and JavaScript*. To this end I am building a website that will connect to the [Netrunner Database](http://www.netrunnerdb.com) API, and download, manipulate, and display card data in the JSON format, and allow users to build a deck of cards for the card game [Netrunner](http://www.nullsignalgames.com/about/netrunner/), exporting completed decks as a printable pdf or uploading to netrunnerdb. The app  will be aimed at people already familiar with the game and ruleset.Players are required to build decks from a vast selection of cards, and this app aims to make it easier to browse the selection of cards and streamline the process of building a deck for the user. I decided to take this project on as I am familiar with the game and ruleset, and identified a need for a webapp that allowed users to browse through the currently legal selection of cards and to build decks, without the overhead of having to browse and organise a collection of physical cards.   

#### User Goals

- browse the database of Netrunner cards
- filter the cards displayed by various properties
- add and remove cards from their current deck
- upload completed decks to netrunnerdb to share them with other players - this proved untenable as I was unable to obtain a developer api key which would be required to implement this feature. 
- remove all cards and start again

#### Site Operator Goals

- provide a robust and easily accessible tool for deckbuilding
- promote the game of Netrunner

#### Developer Goals

- develop on knowledge of manipulating JSON and array methods
- Develop a site that satisfies the Goals of the Users and Operator as determined by the User Stories and Goals
- create a visually interesting and well-optimised experience
- Build a performant and efficient site, benchmarked using tools such as lighthouse, that is workable on all modern browsers and devices

---

## :earth_africa: Scope

---

### User Experience

#### Target Audience

- people who play the game of netrunner

#### User Requirements and Expectations

- easy and intuitive navigation
- accessible for users with additional needs
- all presented functionality works as intended
- quick and easy to navigate the card pool, filter down etc.
- clear and legible text and layout

#### User Stories

##### - First Time User

1. As a first-time user I may want more details on the game
2. As a first-time user I would want the UX/UI to be clear and unambiguous, and also intuitive
3. As a first time user I would like to leave the site with more information that I arrived with
4. As a first time user I want to be able to quickly and easily start building decks

##### - Returning User

1. As a returning user I want to be able to start deckbuilding immediately
2. As a returning user I want to be able to contact the site if I see anything that needs correcting

##### - Site Owner

1. As the site owner, I want integration with netrunnerdb
2. As the site owner I want to be notified when I am contacted via the website
3. As the site owner I want to promote the game of Netrunner
4. As the site owner I want to create a useful tool for the community

#### Identified tasks/needs the website should fulfill

| Task/Need                                   |      Importance (1 -5) |
|----------------------------------------------|-------------------|
| browsing the card collection at netrunnerdb|      5   |
| filtering the card collection at netrunnerdb and only displaying requested types|  4   |
| adding and removing cards to a personalised deck|  5   |
| browsing the cards in users personalised deck|   5  |
| exporting the personalised deck as a list to aid in building it|   3  |
| easy navigation|  4  |

#### Accessibility

- don't rely on images to convey key information, even if that means redundancy (for e.g. displaying a picture of a card, along side html containing the effects, costs for screenreader access etc.)
- Colour palettes will be assessed for color-blind friendliness, and adjusted if necessary.
- the structure of the page should allow for keyboard navigation and be screen-reader friendly

---

## :bricks: Structure

---

The site will designed in such a way as to consist of a single page, with interactive elements powered by javaScript. Opening the page for the first time will present the user with a explanatory text.

Users will then decide which of the two possible roles in the game that they would like to build a deck for, either the Corporation or the Runner.

Based on this choice the nav element containing the list of cards populates with the relevant sides cards.

Users will then select an 'ID', which is a specific character within the corporation/runner faction to play as.

Users may then click on any of the card titles to display an image and description of the card and add that card to their deck.

The left hand side of the page will consist of a nav element allowing users to browse either their current deck or the full collection of cards.

There will be a display area that will display a large image of any card, as well as the card information. Users will be able to add the card to their deck following the rules of the game.

There will be a section below the display area that will contain the controls for filtering the cards being listed in the nav element.

Page should be responsive and designed for mobile, tablet, and desktop.

---

## :skull_and_crossbones: Skeleton

---

### Wireframes

#### Desktop Wireframes

![wireframe - desktop](/docs/wireframes/landing_page_desktop.png)
![wireframe - desktop](/docs/wireframes/landing_page_1_desktop.png)

#### Mobile Wireframes

![wireframe - mobile](/docs/wireframes/mobile-landing.png)
![wireframe - mobile](/docs/wireframes/mobile-browse-cards.png)
![wireframe - mobile](/docs/wireframes/mobile-filter.png)
![wireframe - mobile](/docs/wireframes/mobile-browse-deck.png)

### Features

- query netrunnerdb API and parse returned data
- display cards for users, parsing the API data based on filtering options provided on the page
- allow users to add and remove cards to a custom deck list

---

## :art: Surface

---

### Design

#### Typography

Typography will need to emphasise the futuristic nature of the games setting, while maintaining legibility. In order to maintain a level of consistency with the game product I have elected to use the fonts that are used on the publishers [website](http://www.nullsignal.games).

for headers:

[header](https://fonts.google.com/specimen/Play?query=play)

for body text:

[body](https://fonts.google.com/?query=public+sans)

#### Colour Palettes

I elected to use a cyberpunk/vaporwave image as the background for this app, which is suitable thematically. I elected to use the in-game faction colours to denote the faction of the various cards, these colours were pulled from the cards. 

### Technologies and Tools used

#### Languages

- **CSS3**
- **HTML5**
- **javaScript**
- **Markdown**
- **Regex**

#### Tools

- **[Tilix](https://gnunn1.github.io/tilix-web/)**
- **[Google Chrome](https://www.chrome.com/)**
- **[Firefox](https://www.firefox.com)**
- **[git](https://git-scm.com/)**
- **[VSCode for linux](https://code.visualstudio.com/)**
- **[Bootstrap 5.3.2](https://getbootstrap.com/)**
- **[jQuery](https://jquery.com/)**
- **[GitHub](https://www.github.com)**
- **[Pencil](https://pencil.evolus.vn/)**
- **[Coolors](https://coolors.co/)**
- **[Google Fonts](https://fonts.google.com/)**
- **[Photopea](https://www.photopea.com/)**
- **[hextorgba](https://rgbacolorpicker.com/hex-to-rgba)**
- **[amiresponsive](https://ui.dev/amiresponsive)**

---

## :microscope: Testing

---

In the course of developing this project, I elected to use manual testing exclusively. Despite the reasonably large codebase, the logic is still straightforward enough that I believe it was on the bound of needing to use automated testing. While automated testing has many advantages, such as consistency and comprehensive coverage, the initial time investment and setup would have expanded the project, which was already overscoped, even further. 

While manual testing, making use of console.log() and alert(), is slower and less efficient compared ot automated testing, it provides significant flexiblity and allowed me to follow the thread of logic as the program ran, providing immediate and comprehensible feedback. 

### Testing Procedure

Du



### Functional testing

| test                                           | verified |
| ---------------------------------------------- | -------- |
| on load page - initial HTML should be visible    | yes      |
| side clicked should load cards of that side and clear stage     | yes      |
| clicking a cardEntry should display card info on main stage     | yes      |
| hitting the 'Build Deck with this ID' button should add that information to the deck information section         | yes      |
| hitting the 'add card' button on the stage on a card should add that card to myDeck and display the card in the second column       | yes      |
| adding card to deck should update deckInfo section appropriately      | yes      |
| radio Buttons should clear cards display and load appropriate cards in   | yes      |
| small 'side' icons in controls should change side, clear the stage and update radio buttons appropriately                   | yes      |
| 


### User Stories Testing

#### - First Time User Testing

- As a first-time user I may want more details on the game

The introductory text explains the game and provides a link to the publishers website for more information.

- As a first-time user I would want the UX/UI to be clear and unambiguous, and also intuitive

The UI could definitely do with styling further, it is currently functional but a bit ugly. However I believe that the flow of information is clear and reasonably intuitive.

- As a first time user I would like to leave the site with more information that I arrived with

Users can visit the publishers website for more information as well as examine individual cards and IDs to get a better idea of what the game is about.

- As a first time user I want to be able to quickly and easily start building decks

I believe this app achieves the goal, users are immediately presented with the ability to build with no pre-amble

#### - Returning User Testing

- As a returning user I want to be able to start deckbuilding immediately

this has been achieved

- As a returning user I want to be able to contact the site if I see anything that needs correcting

No contact details have been provided thus far, though determined users could contact me through the sites github.

#### - Site Owner Testing

- As the site owner, I want integration with netrunnerdb

Achieved

- As the site owner I want to be notified when I am contacted via the website

not achieved

- As the site owner I want to promote the game of Netrunner

Achieved

- As the site owner I want to create a useful tool for the community

Achieved

### Desktop

### HTML/CSS Validators

### WAVE

![WAVE validation](docs/images/wave1.png)![]
![WAVE validation](docs/images/wave2.png)

### Lighthouse

![lighthouse validation](docs/images/lighthouse.png)

---

### Mobile Testing

Unfortunately this site has not been developed for mobile. The javascript required to complete the project was so complex that I found I had run out of time before I could address implementing media queries.

### Devices

### Bug fixes

## :loudspeaker: Deployment

Deployment will be using gitHub pages and similarly to my previous project can be simply deployed yourself by first cloning the repository:

> git clone <http://www.github.com/Oxymetaphoric/milestone_project_2>

placing the cloned files in the root of your web server, should be sufficient for deployment.

---

---

## :heart: Credits and Acknowledgments

---

My wonderful family!

background image: <a href="https://www.vecteezy.com/free-vector/blue">Blue Vectors by Vecteezy</a>

card data and all game related information and imagery - [null signal games](https://nullsignal.games/)
