//get card from deck
function getCard($container, d) {
  var c = d.cards.pop();
  c.mount($container);
  c.enableDragging();
  c.setSide('front');
  return c;
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
  console.log(event);
  // prevent default action (open as link for some elements) 
  event.preventDefault();
  card.unmount();
  card.mount(event.currentTarget);
  card.disableDragging();
  var offsetY = 55 + ((event.currentTarget.childElementCount - 1) * 30);
  card.$el.style.transform = 'translate(125%, ' + offsetY + 'px)';
  card = getCard($card, deck);
}

var $card = document.getElementById('card');
var $deck = document.getElementById('deck');
var $drop1 = document.getElementById('drop1');
var $drop2 = document.getElementById('drop2');
var $drop3 = document.getElementById('drop3');
var $drop4 = document.getElementById('drop4');

var card, deck, removedCards;

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
$drop1.addEventListener("mouseup", changeCard, false);
$drop2.addEventListener("mouseup", changeCard, false);
$drop3.addEventListener("mouseup", changeCard, false);
$drop4.addEventListener("mouseup", changeCard, false);

// Allow to flip it 
//card.enableFlipping();
