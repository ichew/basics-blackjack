var BANBAN = "ban-ban";
var BANLUCK = "ban-luck";
var GORLENG = "gor-leng";
var ACE = "ace";
// day1=6hrs

var makeDeck = function () {
  // Initialise an empty deck array
  var cardDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  var suits = ["hearts", "diamonds", "clubs", "spades"];

  // Loop over the suits array
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    // Store the current suit in a variable
    var currentSuit = suits[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    var rankCounter = 1;
    while (rankCounter <= 13) {
      // By default, the card name is the same as rankCounter
      var cardName = rankCounter;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName == 1) {
        cardName = ACE;
      } else if (cardName == 11) {
        cardName = "jack";
      } else if (cardName == 12) {
        cardName = "queen";
      } else if (cardName == 13) {
        cardName = "king";
      }

      // Create a new card with the current name, suit, and rank
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
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

var getCardSum = function (cardArray) {
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
    cardSum = 11 + cardArray[1].rank; //because ace is 11
  } else if (
    cardArray[1].name == ACE &&
    cardArray[0].rank >= 7 &&
    cardArray[0].rank < 10
  ) {
    cardSum = 11 + cardArray[0].rank; //because ace is 11
  } else {
    console.log("here");
    cardSum =
      return10IfCardIsJQK(cardArray[0].rank) +
      return10IfCardIsJQK(cardArray[1].rank);
  }

  return cardSum;
};

var shuffledDeck = shuffleCards(makeDeck());

var main = function (input) {
  var computerCardArray = []; // declare array to store cards
  var playerCardArray = [];
  var computerCardSum = 0;
  var computerCardSumTemp = 0;
  var playerCardSum = 0;
  var playerCardSumTemp = 0;
  var myOutputValue = "";
  var gameResult = "";
  var whileLoopIndex = 0; // initialise to 0 for use in while loop only
  var computerCardIndex = 2; // initialise to 3rd card for use in while loop only

  // for testing
  console.log("========== NEW GAME ==============");
  var test1 = {
    name: ACE,
    suit: "spade",
    rank: 1,
  };

  // Draw cards from the top of the deck

  computerCardArray.push(test1); // for testing
  // computerCardArray.push(shuffledDeck.pop());
  playerCardArray.push(shuffledDeck.pop());
  computerCardArray.push(shuffledDeck.pop());
  playerCardArray.push(shuffledDeck.pop());

  // Store the sum of cards
  computerCardSum = getCardSum(computerCardArray);
  playerCardSum = getCardSum(playerCardArray);

  console.log("comp - " + computerCardSum);
  console.log("player - " + playerCardSum);

  var ComputerOutputValue =
    "Computer is dealt " +
    computerCardArray[0].name +
    " of " +
    computerCardArray[0].suit +
    " and " +
    computerCardArray[1].name +
    " of " +
    computerCardArray[1].suit +
    ".<br>";

  var PlayerOutputValue =
    "Player is dealt " +
    playerCardArray[0].name +
    " of " +
    playerCardArray[0].suit +
    " and " +
    playerCardArray[1].name +
    " of " +
    playerCardArray[1].suit +
    ". <br><br>";

  /*
  // test computer card sum first
  while (computerCardSum <= 17) {
    if (computerCardArray.length == 2) {
      ComputerOutputValue =
        ComputerOutputValue + "This is your second card <br>";
    }
    if (computerCardArray.length == 3) {
      ComputerOutputValue = ComputerOutputValue + "This is your 3rd card <br>";
    }
    //when 4 cards and still need then gor-leng
    if (computerCardArray.length == 4) {
      ComputerOutputValue =
        ComputerOutputValue +
        "Computer Gor-Leng. Pay Double if Computer Wins. <br>";
    }

    computerCardArray.push(shuffledDeck.pop());

    computerCardSum =
      computerCardSum +
      return10IfCardIsJQK(computerCardArray[computerCardIndex].rank);

    ComputerOutputValue =
      ComputerOutputValue +
      "After Computer Hits, Computer had additional " +
      computerCardArray[computerCardIndex].name +
      " of " +
      computerCardArray[computerCardIndex].suit +
      ".<br>";

    computerCardIndex += 1;
    whileLoopIndex += 1;
  } //end while
*/
  console.log("while loop- " + whileLoopIndex);
  console.log("comp hits- " + computerCardSum);

  // add computer and player output strings to final output strings
  myOutputValue = ComputerOutputValue + "<br>" + PlayerOutputValue;

  // Compare computer and player cards by 21
  if (computerCardSum <= 21 && playerCardSum <= 21) {
    // then check if computer or player wins
    if (computerCardSum > playerCardSum) {
      myOutputValue = myOutputValue + "Computer wins.";
    } else if (computerCardSum < playerCardSum) {
      myOutputValue = myOutputValue + "Player wins!";
    } else {
      myOutputValue = myOutputValue + "It's a tie.";
    }
  } else if (computerCardSum <= 21 && playerCardSum > 21) {
    myOutputValue = myOutputValue + "Computer wins.";
  } else if (computerCardSum > 21 && playerCardSum <= 21) {
    myOutputValue = myOutputValue + "Player wins!";
  } else {
    myOutputValue = myOutputValue + "It's a tie.";
  }

  // Return the fully-constructed output string
  return myOutputValue;
};

/* 
    //when 3 cards, can choose if ace is 1 or 10
    if (computerCardArray.length == 3) {
      if (
        (computerCardArray[0].name == ACE ||
          computerCardArray[1].name == ACE ||
          computerCardArray[2].name == ACE) &&
        computerCardSum <= 11
      ) {

        console.log(
          "At least 1 of 3 cards is ace. Computer can decide if ace is 1 or 10."
        );

        //if 1,1,x then is banban, so wont be in this while loop
        //if 1,x,1 then any 1 ace is 10 and the other ace is 1
        if (computerCardArray[0].name == ACE) {
          computerCardSumTemp =
            10 + computerCardArray[1].rank + computerCardArray[2].rank;
        } else if (computerCardArray[1].name == ACE) {
          computerCardSumTemp =
            computerCardArray[0].rank + 10 + computerCardArray[2].rank;
        } else if (computerCardArray[2].name == ACE) {
          computerCardSumTemp =
            computerCardArray[0].rank + computerCardArray[1].rank + 10;
        }

        //if these 3 cards temp sum is greater than 17, set them as computerCardSum
        if (computerCardSumTemp > 17) {
          // ComputerOutputValue =
          //   ComputerOutputValue + "Computer decides to set 1 ace as 10.<br>";
          console.log("Computer decides to set 1 ace as 10.");
          computerCardSum = computerCardSumTemp;
          break;
        }

        computerCardIndex += 1;
        continue;
      }
    }// end if 
    */
