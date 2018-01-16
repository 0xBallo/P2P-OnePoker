//get card from deck
function getCard($container, d) {
  var c;
  if (drops[0].length === 5 &&
    drops[0].length === drops[1].length &&
    drops[1].length === drops[2].length &&
    drops[2].length === drops[3].length) {
    deck.flip();
    deck.fan();
    score = calcScore();
    sum += score;
    var $li = document.createElement("li");
    $li.innerHTML = score;
    $scores.appendChild($li);
    $sum.innerHTML = sum;
  } else {
    c = d.cards.pop();
    c.mount($container);
    c.enableDragging();
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
        s += 2;
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
        s += 150;
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
  var c;
  //Dropzone 1
  c = d.cards.pop();
  c.mount($drop1);
  c.setSide('front');
  drops[0].push(deck2pokersolver(c));
  //Dropzone 2
  c = d.cards.pop();
  c.mount($drop2);
  c.setSide('front');
  drops[1].push(deck2pokersolver(c));
  //Dropzone 3
  c = d.cards.pop();
  c.mount($drop3);
  c.setSide('front');
  drops[2].push(deck2pokersolver(c));
  //Dropzone 4
  c = d.cards.pop();
  c.mount($drop4);
  c.setSide('front');
  drops[3].push(deck2pokersolver(c));
}

//place card on dropzone and get new one
function changeCard(event) {
  var regular, offsetY;

  // prevent default action (open as link for some elements) 
  event.preventDefault();
  // assume non regular moves
  regular = false;
  //update piles info
  switch (event.currentTarget.id) {
    case 'drop1':
      if (!dropsLock[0]) {
        drops[0].push(deck2pokersolver(card));
        dropsLock[0] = true;
        regular = true;
      }
      break;
    case 'drop2':
      if (!dropsLock[1]) {
        drops[1].push(deck2pokersolver(card));
        dropsLock[1] = true;
        regular = true;
      }
      break;
    case 'drop3':
      if (!dropsLock[2]) {
        drops[2].push(deck2pokersolver(card));
        dropsLock[2] = true;
        regular = true;
      }
      break;
    case 'drop4':
      if (!dropsLock[3]) {
        drops[3].push(deck2pokersolver(card));
        dropsLock[3] = true;
        regular = true;
      }
      break;
    default:
      break;
  }

  card.disableDragging();
  if (regular) {
    card.unmount();
    card.mount(event.currentTarget);

    offsetY = 55 + ((event.currentTarget.childElementCount - 1) * 30);
    card.$el.style.transform = 'translate(125%, ' + offsetY + 'px)';
    if (rowComplete()) {
      dropsLock = [false, false, false, false];
    }
    card = getCard($card, deck);
  } else {
    card.animateTo({
      delay: 0,
      duration: 500,
      ease: 'quartOut',
      x: 0,
      y: 0
    });
    card.enableDragging();
  }

}

//Start match
function start() {
  drops = [
    [],
    [],
    [],
    []
  ];
  dropsLock = [false, false, false, false];
  score = 0;

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
  first4Cards(deck);

  // Select the first card
  card = getCard($card, deck);

}

//Start new game
function newGame() {
  $scores.innerHTML = '';
  $sum.innerHTML = '0';
  sum = 0;
  start();
}

//save score and start new game
function next() {
  start();
}


var $card = document.getElementById('deck');

var $deck = document.getElementById('deck');
var $drop1 = document.getElementById('drop1');
var $drop2 = document.getElementById('drop2');
var $drop3 = document.getElementById('drop3');
var $drop4 = document.getElementById('drop4');
var $new = document.getElementById('start');
var $next = document.getElementById('next');
var $scores = document.getElementById('scores');
var $sum = document.getElementById('sum');
var drops, dropsLock;
var card, deck, removedCards;
var sum, score;

$drop1.addEventListener("mouseup", changeCard, false);
$drop2.addEventListener("mouseup", changeCard, false);
$drop3.addEventListener("mouseup", changeCard, false);
$drop4.addEventListener("mouseup", changeCard, false);

$new.addEventListener("click", newGame, false);
$next.addEventListener("click", next, false);
