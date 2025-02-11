var SHUFFLEDDECK = [];
var PLAYERCARDARRAY = [];
var COMPUTERCARDARRAY = [];
var COMPUTERPLAYER = "";
var PLAYERCARDSUM = 0;
var COMPUTERCARDSUM = 0;
var PLAYERJOURNEYSTORY = "";
var COMPUTERJOURNEYSTORY = "";

var GAMEMODE = "CHOOSE_COMPUTER_PLAYER"; //game start at CHOOSE_COMPUTER_PLAYER
var COMPUTERWINTEXT = " wins! <br><br>Play again? Click Restart to play again.";
var PLAYERWINTEXT =
  "Player, you won! <br><br>Play again? Click Restart to play again.";
var NOBODYWINEXT =
  "Nobody win. It is a tie. <br><br>Play again? Click Restart to play again.";
var HITSTANDTOCONTINUE = `<br><br>Please key-enter "Hit" or "Stand" to continue.<br><br>`;
var ACE = "ace";
var BANBAN = "ban-ban";
var BANLUCK = "ban-luck";
var GORLENG = "gor-leng";

var makeDeck = function () {
  // Initialise an empty deck array
  var cardDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  var suits = ["H", "D", "C", "S"];
  var suitsFullName = ["hearts", "diamonds", "clubs", "spades"];
  //Initialise variable to store the img
  var imgName = "";

  // Loop over the suits array
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    // Store the current suit in a variable
    var currentSuit = suits[suitIndex];
    var currentSuitFullName = suitsFullName[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    var rankCounter = 1;
    while (rankCounter <= 13) {
      // By default, the card name is the same as rankCounter
      var cardName = rankCounter;

      imgName = cardName + currentSuit + ".svg";
      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName == 1) {
        cardName = ACE;
        imgName = "A" + currentSuit + ".svg";
      } else if (cardName == 11) {
        cardName = "jack";
        imgName = "J" + currentSuit + ".svg";
      } else if (cardName == 12) {
        cardName = "queen";
        imgName = "Q" + currentSuit + ".svg";
      } else if (cardName == 13) {
        cardName = "king";
        imgName = "K" + currentSuit + ".svg";
      }

      // Create a new card with the current name, suit, and rank
      // added imgName to show the images
      var card = {
        name: cardName,
        suit: currentSuitFullName,
        rank: rankCounter,
        img: imgName,
      };

      // Add the new card to the deck
      cardDeck.push(card);

      // Increment rankCounter to iterate over the next rank
      rankCounter += 1;
    }

    // Increment the suit index to iterate over the next suit
    suitIndex += 1;
  }

  // Return the completed card deck
  return cardDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

// Shuffle the elements in the cardDeck array
var shuffleCards = function (cardDeck) {
  // Loop over the card deck array once
  var currentIndex = 0;
  while (currentIndex < cardDeck.length) {
    // Select a random index in the deck
    var randomIndex = getRandomIndex(cardDeck.length);
    // Select the card that corresponds to randomIndex
    var randomCard = cardDeck[randomIndex];
    // Select the card that corresponds to currentIndex
    var currentCard = cardDeck[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cardDeck[currentIndex] = randomCard;
    cardDeck[randomIndex] = currentCard;
    // Increment currentIndex
    currentIndex = currentIndex + 1;
  }
  // Return the shuffled deck
  return cardDeck;
};

// check if card has J,Q,K then return 10 for summation
var return10IfCardIsJQK = function (cardRank) {
  if ([11, 12, 13].includes(cardRank)) {
    return 10;
  } else return cardRank;
};

//
var sumInitialTwoCards = function (cardArray) {
  var cardSum = 0;

  if (cardArray[0].name == ACE && cardArray[1].name == ACE) {
    //gameResult = BANBAN;
    cardSum = 21;
  } else if (
    (cardArray[0].name == ACE && cardArray[1].rank >= 10) ||
    (cardArray[1].name == ACE && cardArray[0].rank >= 10)
  ) {
    //gameResult = BANLUCK;
    cardSum = 21;
  } else if (
    cardArray[0].name == ACE &&
    cardArray[1].rank >= 7 &&
    cardArray[1].rank < 10
  ) {
    cardSum = 11 + cardArray[1].rank; //because ace is 11 when only 2 cards
  } else if (
    cardArray[1].name == ACE &&
    cardArray[0].rank >= 7 &&
    cardArray[0].rank < 10
  ) {
    cardSum = 11 + cardArray[0].rank; //because ace is 11 when only 2 cards
  } else {
    cardSum =
      return10IfCardIsJQK(cardArray[0].rank) +
      return10IfCardIsJQK(cardArray[1].rank);
  }

  return cardSum;
};

var givePlayerOneMoreCard = function () {
  console.log("givePlayerOneMoreCard");
  //give player 1 more card
  PLAYERCARDARRAY.push(SHUFFLEDDECK.pop());

  var playerLastCardIndex = PLAYERCARDARRAY.length - 1;

  PLAYERCARDSUM =
    PLAYERCARDSUM +
    return10IfCardIsJQK(PLAYERCARDARRAY[playerLastCardIndex].rank);

  console.log("givePlayerOneMoreCard ends with sum =" + PLAYERCARDSUM);

  //Build player cards image as <img src="./cards/4C.svg">

  let cardImg = document.createElement("img");
  cardImg.src = "./cards/" + PLAYERCARDARRAY[playerLastCardIndex].img;
  document.getElementById("player-cards").append(cardImg);

  PLAYERJOURNEYSTORY =
    PLAYERJOURNEYSTORY +
    "<br>After Player Hits, Player had additional " +
    PLAYERCARDARRAY[playerLastCardIndex].name +
    " of " +
    PLAYERCARDARRAY[playerLastCardIndex].suit +
    ".<br>The sum value is " +
    PLAYERCARDSUM +
    ".";
};

var computerTurn = function () {
  // the check for banban and banluck happens during sumInitialTwoCards
  // this computerTurn starts checking after player decides to Hit or Stand

  while (COMPUTERCARDSUM <= 17) {
    //give computer 1 more card when sum <= 17
    COMPUTERCARDARRAY.push(SHUFFLEDDECK.pop());

    var computerLastCardIndex = COMPUTERCARDARRAY.length - 1;
    var tempSum = 0;

    // when computer have 3 cards, test to see if ace is 1 or 10
    if (COMPUTERCARDARRAY.length == 3) {
      // sum the 3 cards first then re-calc if 1 of the 3 cards is an ace
      COMPUTERCARDSUM =
        return10IfCardIsJQK(COMPUTERCARDARRAY[0].rank) +
        return10IfCardIsJQK(COMPUTERCARDARRAY[1].rank) +
        return10IfCardIsJQK(COMPUTERCARDARRAY[2].rank);

      //add a newline for formating
      COMPUTERJOURNEYSTORY = COMPUTERJOURNEYSTORY + "<br>";

      if (
        (COMPUTERCARDARRAY[0].name == ACE ||
          COMPUTERCARDARRAY[1].name == ACE ||
          COMPUTERCARDARRAY[2].name == ACE) &&
        COMPUTERCARDSUM <= 12 // only when sum of 3 cards are <= 12 (ace + 9 +2 = 12), then need to have ace = 10
      ) {
        console.log(
          "At least 1 of 3 cards is ace. Computer can decide if ace is 1 or 10."
        );

        //if 1,1,x
        //   then is banban,
        //   so wont be in this while <17 loop because will be taken care when it was 2 cards.
        //if 1,x,1
        //   then any 1 ace is 10 and the other ace can be 1.
        if (COMPUTERCARDARRAY[0].name == ACE) {
          tempSum = 10 + COMPUTERCARDARRAY[1].rank + COMPUTERCARDARRAY[2].rank;
        } else if (COMPUTERCARDARRAY[1].name == ACE) {
          tempSum = COMPUTERCARDARRAY[0].rank + 10 + COMPUTERCARDARRAY[2].rank;
        } else if (COMPUTERCARDARRAY[2].name == ACE) {
          tempSum = COMPUTERCARDARRAY[0].rank + COMPUTERCARDARRAY[1].rank + 10;
        }

        // if after setting ace=10, computer ji-ba-bom, then switch to sum using ace=1
        // eg ace+6+10 will be tempSum = 26 but shld be 1+6+10=17, and will go to while >=17 loop
        if (tempSum > 21) {
          COMPUTERCARDSUM =
            COMPUTERCARDSUM +
            return10IfCardIsJQK(COMPUTERCARDARRAY[computerLastCardIndex].rank);
        } else {
          COMPUTERCARDSUM = tempSum;
        }
      } // end if to check if any 3 cards are ace and sum <=12
    } else if (COMPUTERCARDARRAY.length == 4) {
      // when computer have 4 cards, ace must be 1, so just recalculate sum again
      COMPUTERCARDSUM =
        return10IfCardIsJQK(COMPUTERCARDARRAY[0].rank) +
        return10IfCardIsJQK(COMPUTERCARDARRAY[1].rank) +
        return10IfCardIsJQK(COMPUTERCARDARRAY[2].rank) +
        return10IfCardIsJQK(COMPUTERCARDARRAY[3].rank);
    } // end if 4 cards
    else {
      COMPUTERCARDSUM =
        COMPUTERCARDSUM +
        return10IfCardIsJQK(COMPUTERCARDARRAY[computerLastCardIndex].rank);
    }

    console.log("computerTurn ends with sum =" + COMPUTERCARDSUM);

    COMPUTERJOURNEYSTORY =
      COMPUTERJOURNEYSTORY +
      "After Computer Hits, Computer had additional " +
      COMPUTERCARDARRAY[computerLastCardIndex].name +
      " of " +
      COMPUTERCARDARRAY[computerLastCardIndex].suit +
      ".<br>The sum value is " +
      COMPUTERCARDSUM +
      ".<br>";
  } // end while(COMPUTERCARDSUM <= 17)

  showComputerCards();
};

var checkWhoWins = function () {
  // Compare computer and player cards by 21
  if (COMPUTERCARDSUM <= 21 && PLAYERCARDSUM <= 21) {
    // then check if computer or player wins
    if (COMPUTERCARDSUM > PLAYERCARDSUM) {
      return COMPUTERPLAYER + COMPUTERWINTEXT;
    } else if (COMPUTERCARDSUM < PLAYERCARDSUM) {
      return PLAYERWINTEXT;
    } else {
      return NOBODYWINEXT;
    }
  } else if (COMPUTERCARDSUM <= 21 && PLAYERCARDSUM > 21) {
    return COMPUTERPLAYER + COMPUTERWINTEXT;
  } else if (COMPUTERCARDSUM > 21 && PLAYERCARDSUM <= 21) {
    return PLAYERWINTEXT;
  } else {
    return NOBODYWINEXT;
  }
};

var resetAllGlobalVariables = function () {
  //document.getElementById("player-cards").innerHTML = "";

  SHUFFLEDDECK = [];
  PLAYERCARDARRAY = [];
  COMPUTERCARDARRAY = [];
  PLAYERCARDSUM = 0;
  COMPUTERCARDSUM = 0;
  PLAYERJOURNEYSTORY = "";
  COMPUTERJOURNEYSTORY = "";
  GAMEMODE = "CHOOSE_COMPUTER_PLAYER";
  COMPUTERPLAYER = "";
};

var showComputerCards = function () {
  //remove the 2 face down cards first then show the face up cards
  document.getElementById("computer-cards").innerHTML = "";

  for (i = 0; i < COMPUTERCARDARRAY.length; i++) {
    let cardImg = document.createElement("img");
    cardImg.src = "./cards/" + COMPUTERCARDARRAY[i].img;
    document.getElementById("computer-cards").append(cardImg);
  }
};

var main = function (input) {
  console.log("1main");

  var myOutputValue = "";
  var myOutputValue2 = "";
  var whoWinsText = "";
  var reset = 0;

  switch (GAMEMODE) {
    case "CHOOSE_COMPUTER_PLAYER":
      GAMEMODE = "DEAL"; //update gamemode to next stage

      // initialise <h2>Computer: </h2>
      var hTwo = document.createElement("h2");
      hTwo.innerText = "Computer: ";

      if (input == 1) {
        COMPUTERPLAYER = "赌神 - God of Gambler";

        let cardImg = document.createElement("img");
        cardImg.src = "./img/chowyunfatt3.jpg";
        hTwo.appendChild(cardImg); //put img inside H2 so that they can be on same one line
        document.getElementById("computer-img").append(hTwo);

        myOutputValue =
          "You chose to battle 赌神 - God of Gambler. <br>Click Submit to start!";
      } else if (input == 2) {
        COMPUTERPLAYER = "赌侠 - Knight of Gambler";

        let cardImg = document.createElement("img");
        cardImg.src = "./img/andylau.png";
        hTwo.appendChild(cardImg); //put img inside H2 so that they can be on same one line
        document.getElementById("computer-img").append(hTwo);

        myOutputValue =
          "You chose to battle 赌侠 - Knight of Gambler. <br>Click Submit to start!";
      } else if (input == 3) {
        COMPUTERPLAYER = "赌圣 - Saint of Gambler";

        let cardImg = document.createElement("img");
        cardImg.src = "./img/chowstephen2.jpg";
        hTwo.appendChild(cardImg); //put img inside H2 so that they can be on same one line
        document.getElementById("computer-img").append(hTwo);

        myOutputValue =
          "You chose to battle 赌圣 - Saint of Gambler. <br>Click Submit to start!";
      } else {
        GAMEMODE = "CHOOSE_COMPUTER_PLAYER";
        myOutputValue = `Who do you want to play with?<br>
          Key-enter 1 to play with 赌神 - God of Gambler.<br>
          Key-enter 2 to play with 赌侠 - Knight of Gambler.<br>
          Key-enter 3 to play with 赌圣 - Saint of Gambler.<br>
         `;
      }
      break;

    case "DEAL": // beginning of play, each player is dealt 2 cards each
      GAMEMODE = "3CARDS"; //update gamemode to next stage

      // shuffle a new deck at the start of each game
      SHUFFLEDDECK = shuffleCards(makeDeck());

      /* for testing
      console.log("========== NEW GAME ==============");
      var test1 = {
        name: ACE,
        suit: "spade",
        rank: 1,
        img: "AS.svg",
      };
      COMPUTERCARDARRAY.push(test1);
      */
      //end for testing

      // Draw cards from the top of the deck
      COMPUTERCARDARRAY.push(SHUFFLEDDECK.pop());
      PLAYERCARDARRAY.push(SHUFFLEDDECK.pop());
      COMPUTERCARDARRAY.push(SHUFFLEDDECK.pop());
      PLAYERCARDARRAY.push(SHUFFLEDDECK.pop());

      // Store the sum of cards
      COMPUTERCARDSUM = sumInitialTwoCards(COMPUTERCARDARRAY);
      PLAYERCARDSUM = sumInitialTwoCards(PLAYERCARDARRAY);

      //Build computer cards image as <img src="./cards/4C.svg">
      for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        cardImg.src = "./cards/RED_BACK.svg";
        document.getElementById("computer-cards").append(cardImg);
      }

      // initialise and display <h2>Player: </h2>
      var hTwoPlayer = document.createElement("h2");
      hTwoPlayer.innerText = "Player: ";
      document.getElementById("player-cards").append(hTwoPlayer);

      //Build player cards image as <img src="./cards/4C.svg">
      for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        cardImg.src = "./cards/" + PLAYERCARDARRAY[i].img;
        document.getElementById("player-cards").append(cardImg);
      }

      COMPUTERJOURNEYSTORY =
        COMPUTERPLAYER +
        " is dealt " +
        COMPUTERCARDARRAY[0].name +
        " of " +
        COMPUTERCARDARRAY[0].suit +
        " and " +
        COMPUTERCARDARRAY[1].name +
        " of " +
        COMPUTERCARDARRAY[1].suit +
        ".<br>The sum value is " +
        COMPUTERCARDSUM +
        ".";

      PLAYERJOURNEYSTORY =
        "You are dealt " +
        PLAYERCARDARRAY[0].name +
        " of " +
        PLAYERCARDARRAY[0].suit +
        " and " +
        PLAYERCARDARRAY[1].name +
        " of " +
        PLAYERCARDARRAY[1].suit +
        ".<br>The sum value is " +
        PLAYERCARDSUM +
        ".";

      // in this case 0, only 2 cards are dealt, so must be banban or ban-luck
      if (COMPUTERCARDSUM == 21) {
        GAMEMODE = "CHOOSE_COMPUTER_PLAYER";
        whoWinsText = COMPUTERPLAYER + COMPUTERWINTEXT;
        reset = 1; //reset all global variables since have a winner
      } else if (PLAYERCARDSUM == 21) {
        GAMEMODE = "CHOOSE_COMPUTER_PLAYER";
        whoWinsText = PLAYERWINTEXT;
        reset = 1; //reset all global variables since have a winner
      } else if (PLAYERCARDSUM == 21 && COMPUTERCARDSUM == 21) {
        GAMEMODE = "CHOOSE_COMPUTER_PLAYER";
        whoWinsText = NOBODYWINEXT;
        reset = 1; //reset all global variables since have a winner
      } else {
        // 2 cards no winner so ask player to hit or continue
        whoWinsText = HITSTANDTOCONTINUE;
      }
      break;

    case "3CARDS": // round where player Hit and is dealt a 3rd card, or Stand and see who wins with 2 cards each
      GAMEMODE = "4CARDS"; //update gamemode to next stage

      if (input == "Hit") {
        givePlayerOneMoreCard();
        whoWinsText = HITSTANDTOCONTINUE;
      } else if (input == "Stand") {
        computerTurn();
        whoWinsText = checkWhoWins();
        reset = 1; //reset since checking who wins
      } else {
        GAMEMODE = "3CARDS"; //do not reset as player never Hit or Stand
        myOutputValue = HITSTANDTOCONTINUE;
      }

      break;

    case "4CARDS": // round where player Hit is dealt a 4th card, or Stand and see who wins with player having 3 cards
      GAMEMODE = "5CARDS";
      if (input == "Hit") {
        givePlayerOneMoreCard();

        //outputValue2 to store the 5th card gor-leng warning
        myOutputValue2 =
          "Player, you now have " +
          PLAYERCARDARRAY.length +
          " cards.<br>" +
          "You will win or lose double if you play the 5th card.<br>" +
          HITSTANDTOCONTINUE;
      } else if (input == "Stand") {
        computerTurn();
        whoWinsText = checkWhoWins();
        reset = 1; //reset since checking who wins
      } else {
        GAMEMODE = "4CARDS"; //do not reset as player never Hit or Stand
        myOutputValue = HITSTANDTOCONTINUE;
      }
      break;

    case "5CARDS": // round where player is dealt a 5th card
      GAMEMODE = "CHOOSE_COMPUTER_PLAYER"; //reset

      if (input == "Hit") {
        givePlayerOneMoreCard();

        myOutputValue2 =
          "Player, you now have " +
          PLAYERCARDARRAY.length +
          " cards.<br>" +
          "Your final sum value is " +
          PLAYERCARDSUM +
          "<br><br> Play again? Click Restart button";
        reset = 1;
      } else if (input == "Stand") {
        computerTurn();
        whoWinsText = checkWhoWins();
        reset = 1;
      } else {
        GAMEMODE = "5CARDS"; //do not reset as player never Hit or Stand
        myOutputValue = HITSTANDTOCONTINUE;
      }
      break;
  } // end switch GAMEMODE

  myOutputValue =
    myOutputValue +
    COMPUTERJOURNEYSTORY +
    "<br><br>" +
    PLAYERJOURNEYSTORY +
    "<br>" +
    myOutputValue2 +
    "<br>" +
    whoWinsText;

  // reset here so that above JOURNEYSTORIES var are not reset
  if (reset == 1) {
    showComputerCards();
    resetAllGlobalVariables();

    //hide this id = "submit-button" so that only Restart btn is shown
    console.log("x here");
    var submitBtn = document.querySelector("#submit-button");
    submitBtn.style.display = "none";
  }
  return myOutputValue;
};
