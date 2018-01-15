//get card from deck
function getCard($container, d) {
  var c;
  if (dropsCount[0] === 5 &&
    dropsCount[0] === dropsCount[1] &&
    dropsCount[1] === dropsCount[2] &&
    dropsCount[2] === dropsCount[3]) {
    deck.flip();
    deck.fan();
  } else {
    c = d.cards.pop();
    c.mount($container);
    c.enableDragging();
    c.setSide('front');
  }
  return c;
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
  //Dropzone 2
  c = d.cards.pop();
  c.mount($drop2);
  c.setSide('front');
  //Dropzone 3
  c = d.cards.pop();
  c.mount($drop3);
  c.setSide('front');
  //Dropzone 4
  c = d.cards.pop();
  c.mount($drop4);
  c.setSide('front');
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
        dropsCount[0]++;
        dropsLock[0] = true;
        regular = true;
      }
      break;
    case 'drop2':
      if (!dropsLock[1]) {
        dropsCount[1]++;
        dropsLock[1] = true;
        regular = true;
      }
      break;
    case 'drop3':
      if (!dropsLock[2]) {
        dropsCount[2]++;
        dropsLock[2] = true;
        regular = true;
      }
      break;
    case 'drop4':
      if (!dropsLock[3]) {
        dropsCount[3]++;
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
  dropsCount = [1, 1, 1, 1];
  dropsLock = [false, false, false, false];
  score = 0;

  $deck.innerHTML = '';
  $card.innerHTML = '';
  $drop1.innerHTML = '';
  $drop2.innerHTML = '';
  $drop3.innerHTML = '';
  $drop4.innerHTML = '';

  deck = Deck();
  deck.mount($deck);

  // Remove unused cards 
  removedCards = deck.cards.splice(40, 5);
  removedCards.concat(deck.cards.splice(27, 5));
  removedCards.concat(deck.cards.splice(14, 5));
  removedCards.concat(deck.cards.splice(1, 5));
  removedCards.forEach(function (removedCard) {
    removedCard.unmount();
  });

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
  var score = document.createElement("li");
  score.innerHTML = "20";
  $scores.appendChild(score);
  start();
}


var $card = document.getElementById('card');
var $deck = document.getElementById('deck');
var $drop1 = document.getElementById('drop1');
var $drop2 = document.getElementById('drop2');
var $drop3 = document.getElementById('drop3');
var $drop4 = document.getElementById('drop4');
var $new = document.getElementById('start');
var $next = document.getElementById('next');
var $scores = document.getElementById('scores');
var $sum = document.getElementById('sum');
var dropsCount, dropsLock;
var card, deck, removedCards;
var sum, score;

$drop1.addEventListener("mouseup", changeCard, false);
$drop2.addEventListener("mouseup", changeCard, false);
$drop3.addEventListener("mouseup", changeCard, false);
$drop4.addEventListener("mouseup", changeCard, false);

$new.addEventListener("click", newGame, false);
$next.addEventListener("click", next, false);