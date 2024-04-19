# Milestone Project :two:

[LIVE SITE](https://Oxymetaphoric.github.io/milestone_project_2/index.html)

---

## :world_map: Strategy

---

### Project Goals

This is my milestone two project for the [Code Institute's](http://www.codeinstitute.net/) *'Level 5 Diploma in Web Application Development'*. The goal of this project is to *Design, develop and implement a dynamic Front end web application using HTML, CSS and JavaScript*. To this end I am building a website that will connect to the [Netrunner Database](http://www.netrunnerdb.com) API, download, manipulate, and display card data in the JSON format, and allow users to build a deck of cards for the card game [Netrunner](http://www.nullsignalgames.com/about/netrunner/), exporting completed decks as a printable pdf or uploading to netrunnerdb. The app  will be aimed at people already familiar with the game and ruleset.

#### User Goals

- browse the database of Netrunner cards
- filter the cards displayed by various properties
- add and remove cards from their current deck
- upload completed decks to netrunnerdb to share them with other players
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

- easy and sensicle navigation
- accessible for users with additional needs
- all presented functionality works as intended
- quick and easy to navigate the card pool, filter down etc.
- clear and legible text and layout

#### User Stories

##### - First Time User

1. As a first-time user I may want more details on the game
2. As a first-time user I would want the UX/UI to be clear and unambiguous, and also intutive
3. As a first time user I would like to leave the site with more information that I arrived with
4. As a first time user I want to be able to quickly and easily start building decks

##### - Returning User

1. As a returning user I want to be able to start deckbuilding immedietely
2. As a returning user I want to be able to contact the site if I see antthing that needs correcting

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
- Colour palletes will be assessed for color-blind friendliness, and adjusted if necessary.
- the structure of the page should allow for keyboard navigation and be screen-reader friendly

---

## :bricks: Structure

---

The site will designed in such a way as to consist of a single page, with interactive elements powered by javaScript. Opening the page for the first time will present the user with a explanatory text.

Users will then decide which of the two possible roles in the game that they would like to build a deck for, either the Corporation or the Runner.

Based on this choice the nav element containing the list of cards populates with the relevent sides cards.

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

### Functional testing



### User Stories Testing

#### - First Time User Testing

#### - Returning User Testing

#### - Site Owner Testing

### HTML/CSS Validators

### WAVE

### Lighthouse

### Desktop

---

### Mobile Testing

### Devices

### Bug fixes

## :loudspeaker: Deployment

Deployment will be using gitHub pages and similarly to my previous project can be simply deployed yourself by first cloning the repository: 

> git clone <http://www.github.com/Oxymetaphoric/milestone_project_2>



---

---

## :heart: Credits and Acknowledgments

---

Background image by [Jr Korpa](https://unsplash.com/@jrkorpa?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/pink-and-black-wallpaper-9XngoIpxcEo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

card data and all game related information and imagery - [null signal games](https://nullsignal.games/)


  