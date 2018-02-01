/*
  ================================== Theme Funcs =============================================
*/

// Function to change page
function changePage(event) {
  var destSrc = event.currentTarget;
  var destination = destSrc.getAttribute('data-link');
  var currSrc = document.querySelector('.page.active');
  var current = currSrc.getAttribute('data-page');
  var destPage;

  event.preventDefault();

  //TODO: chek if game is start and ask what to do
  if (destination !== current) {
    document.querySelector('.page-links .active').classList.toggle('active');
    destSrc.classList.toggle('active');
    currSrc.classList.toggle('active');
    currSrc.classList.toggle('d-none');
    destPage = document.querySelector('.page[data-page="' + destination + '"]');
    destPage.classList.toggle('active');
    destPage.classList.toggle('d-none');
    getActiveUIElements();
  }
}

// Add event handler for theme to the components
function addHandlers() {
  document.querySelectorAll('.page-links .btn')
    .forEach((el) => el.addEventListener('click', changePage));
  document.querySelectorAll('.drop')
    .forEach((el) => el.addEventListener("click", dropCard, false));

  $new.addEventListener("click", newGame, false);
  $next.addEventListener("click", next, false);
  $joinMulti.addEventListener("click", joinMultiplayerGame, false);
  $startMulti.addEventListener("click", newMultiGame, false);
}

// Get active ui elements reference
function getActiveUIElements() {
  $scores = document.querySelector('.active .scores>ul');
  $sum = document.querySelector('.active .scoreboard>.sum');
  $deck = document.querySelector('.active .deck');
  $card = document.querySelector('.active .deck');
  $drop1 = document.querySelector('.active .drop[data-pile="1"]');
  $drop2 = document.querySelector('.active .drop[data-pile="2"]');
  $drop3 = document.querySelector('.active .drop[data-pile="3"]');
  $drop4 = document.querySelector('.active .drop[data-pile="4"]');
}

// Close Modal
function closeModal(id) {
  document.getElementById(id).classList.toggle('active');
}

//get XY position for card
function getPosition($elem, c, offsetY) {
  var res = {
    x: 0,
    y: 0
  };

  res.x = $elem.getBoundingClientRect().x - c.$el.getBoundingClientRect().x + 7.25 + c.x;
  res.y = $elem.getBoundingClientRect().y - c.$el.getBoundingClientRect().y + offsetY;

  return res;
}

/*
  ================================== Game Funcs =============================================
*/

//Prepare deck and table
function prepareDeck() {
  drops = [
    [],
    [],
    [],
    []
  ];
  dropsLock = [false, false, false, false];
  dropsCounter = 0;

  $deck.innerHTML = '';
  $card.innerHTML = '';
  $drop1.innerHTML = '';
  $drop2.innerHTML = '';
  $drop3.innerHTML = '';
  $drop4.innerHTML = '';

  deck = Deck();

  // Remove unused cards 
  removedCards = deck.cards.splice(40, 4);
  removedCards.concat(deck.cards.splice(27, 4));
  removedCards.concat(deck.cards.splice(14, 4));
  removedCards.concat(deck.cards.splice(1, 4));
  removedCards.forEach(function (removedCard) {
    removedCard.unmount();
  });

  deck.mount($deck);
  deck.shuffle();
}

// Save nickname insert by user
function chooseUsername(event) {
  user.name = document.getElementById('inputUsername').value;
  if (user.name.length > 0) {
    initConnection(user.name);
  }
}

// Join Multiplayer Game
function joinMultiplayerGame(event) {
  var playerName = prompt('Insert name of user to join:');;
  if (playerName.length > 0) {
    startPeerConnection(playerName);
  }
}

//pick card from deck
function pickCard($container, d) {
  var c;
  if ((drops[0].length === 5 &&
      drops[1].length === 5 &&
      drops[2].length === 5 &&
      drops[3].length === 5) || instantWin) {
    deck.flip();
    deck.fan();
    score = calcScore();
    var $li = document.createElement("li");
    if ($scores.childElementCount >= 5) {
      $scores.innerHTML = '';
      var li = document.createElement('li');
      li.innerHTML = sum;
      $scores.appendChild(li);
    }
    sum += score;
    $li.innerHTML = score;
    $scores.appendChild($li);
    $sum.innerHTML = sum;
    //check win
    if (sum >= 502) {
      document.getElementById('modal-won').classList.toggle('active');
    } else {
      theirUsername
      $next.removeAttribute('disabled');
    }
  } else {
    c = d.cards.pop();
    c.mount($container);
    c.setSide('front');
  }
  return c;
}

// convert deck-of-cards format to pokersolver
function deck2pokersolver(c) {
  let card = '';
  switch (c.rank) {
    case 10:
      card += 'T';
      break;
    case 11:
      card += 'J';
      break;
    case 12:
      card += 'Q';
      break;
    case 13:
      card += 'K';
      break;
    default:
      card += c.rank;
      break;
  }
  switch (c.suit) {
    case 0:
      card += 's';
      break;
    case 1:
      card += 'h';
      break;
    case 2:
      card += 'c';
      break;
    case 3:
      card += 'd';
      break;
    default:
      break;
  }
  return card;
}

//Calculate score using pokersolver
function calcScore() {
  let s = 0;
  for (let i = 0; i < drops.length; i++) {
    const ps_array = drops[i];
    var hand = Hand.solve(ps_array);

    switch (hand.rank) {
      case 2:
        //One Pair
        s += 1;
        break;
      case 3:
        //Two Pairs
        s += 4;
        break;
      case 4:
        //Three of a kind
        s += 10;
        break;
      case 5:
        //Straight
        s += 15;
        break;
      case 6:
        //Flush
        s += 30;
        break;
      case 7:
        //Full House
        s += 50;
        break;
      case 8:
        //Four of a Kind
        s += 100;
        break;
      case 9:
        //Royal Flush
        s += 200;
        break;

      default:
        break;
    }

  }

  return s;
}

//check if a row is complete
function rowComplete() {
  return dropsLock[0] && dropsLock[0] == dropsLock[1] && dropsLock[1] == dropsLock[2] && dropsLock[2] == dropsLock[3];
}

//Place first 4 cards in dropzones
function first4Cards(d) {
  var c1, c2, c3, c4, pos;
  //Dropzone 1
  c1 = d.cards.pop();
  pos = getPosition($drop1, c1, 0);
  c1.animateTo({
    delay: 0,
    duration: 500,
    ease: 'quartOut',
    x: pos.x,
    y: pos.y,
    onComplete: function () {
      c1.setSide('front');
    }
  });
  // card send for multiplayer game
  if (multi) {
    broadcastData({
      type: 'dropCard',
      pile: 1,
      card: {
        rank: c1.rank,
        suit: c1.suit
      }
    });
  }
  r1 = c1.rank;
  drops[0].push(deck2pokersolver(c1));
  //Dropzone 2
  c2 = d.cards.pop();
  pos = getPosition($drop2, c2, 0);
  c2.animateTo({
    delay: 500,
    duration: 500,
    ease: 'quartOut',
    x: pos.x,
    y: pos.y,
    onComplete: function () {
      c2.setSide('front');
    }
  });
  // card send for multiplayer game
  if (multi) {
    broadcastData({
      type: 'dropCard',
      pile: 2,
      card: {
        rank: c2.rank,
        suit: c2.suit
      }
    });
  }
  r2 = c2.rank;
  drops[1].push(deck2pokersolver(c2));
  //Dropzone 3
  c3 = d.cards.pop();
  pos = getPosition($drop3, c3, 0);
  c3.animateTo({
    delay: 1000,
    duration: 500,
    ease: 'quartOut',
    x: pos.x,
    y: pos.y,
    onComplete: function () {
      c3.setSide('front');
    }
  });
  // card send for multiplayer game
  if (multi) {
    broadcastData({
      type: 'dropCard',
      pile: 3,
      card: {
        rank: c3.rank,
        suit: c3.suit
      }
    });
  }
  r3 = c3.rank;
  drops[2].push(deck2pokersolver(c3));
  //Dropzone 4
  c4 = d.cards.pop();
  pos = getPosition($drop4, c4, 0);
  c4.animateTo({
    delay: 1500,
    duration: 500,
    ease: 'quartOut',
    x: pos.x,
    y: pos.y,
    onComplete: function () {
      c4.setSide('front');
    }
  });
  // card send for multiplayer game
  if (multi) {
    broadcastData({
      type: 'dropCard',
      pile: 4,
      card: {
        rank: c4.rank,
        suit: c4.suit
      }
    });
  }
  r4 = c4.rank;
  drops[3].push(deck2pokersolver(c4));
  //check instant win
  if (c1.rank === c2.rank && c2.rank === c3.rank && c3.rank === c4.rank) {
    instantWin = true;
    score = 502;
  }
}

//place card on dropzone and get new one
function dropCard(event) {
  var index, regular, offsetY, pos;

  // prevent default action (open as link for some elements) 
  event.preventDefault();
  // assume non regular moves
  regular = false;
  //update piles info
  index = parseInt(event.currentTarget.getAttribute('data-pile'));
  if (!dropsLock[index - 1]) {
    drops[index - 1].push(deck2pokersolver(card));
    dropsLock[index - 1] = true;
    regular = true;
    offsetY = drops[index - 1].length;
  }

  if (regular) {
    offsetY = (offsetY - 1) * 30;
    pos = getPosition(event.currentTarget, card, offsetY);
    card.animateTo({
      delay: 0,
      duration: 500,
      ease: 'quartOut',
      x: pos.x,
      y: pos.y,
      onComplete: function () {}
    });
    card.$el.style.zIndex = 40;
    if (rowComplete()) {
      dropsLock = [false, false, false, false];
    }
    //send broadcast to multiplayer
    if (multi) {
      broadcastData({
        type: 'dropCard',
        pile: index,
        card: {
          rank: card.rank,
          suit: card.suit
        }
      });
    }
    card = pickCard($card, deck);
  } else {
    card.animateTo({
      delay: 0,
      duration: 500,
      ease: 'quartOut',
      x: 0,
      y: 0
    });
  }
}

//Start match
function start() {
  score = 0;

  prepareDeck();

  setTimeout(function (m) {
    first4Cards(deck);
  }, 1000);

  setTimeout(function (m) {
    // Select the first card
    card = pickCard($card, deck);
  }, 1400);
}

//Start new game
function newGame() {
  $scores.innerHTML = '';
  $sum.innerHTML = '0';
  sum = 0;
  multi = false;
  start();
}

//Start new multiplayer game
function newMultiGame() {
  $scores.innerHTML = '';
  $sum.innerHTML = '0';
  sum = 0;
  $startMulti.setAttribute('disabled', 'true');
  multi = true;
  broadcastData({
    type: 'startGame',
    player: user.name
  });
  start();
}

//save score and start new game
function next() {
  $next.setAttribute('disabled', true);
  start();
}

/*
  ======================== Main Program =================================
*/

var $card, $deck, $drop1, $drop2, $drop3, $drop4, $new, $next, $scores, $sum, $players, $joinMulti, $startMulti, $blocker;
var user = {
  name: ''
};
var drops, dropsLock;
var card, deck, removedCards;
var sum, score, multi;
var instantWin = false;

window.onload = function () {
  $new = document.getElementById('singleStart');
  $next = document.getElementById('singleNext');
  $players = document.getElementById('players');
  $joinMulti = document.getElementById('multiJoin');
  $startMulti = document.getElementById('multiStart');
  $blocker = document.querySelector('.blocker');

  addHandlers();
};
