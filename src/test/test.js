function getCard($container, d) {
  var c = d.cards.pop();
  c.mount($container);
  c.enableDragging();
  c.setSide('front');
  return c;
}

function changeCard(event) {
  console.log(event);
  // prevent default action (open as link for some elements) 
  event.preventDefault();
  card.unmount();
  card.mount($drop);
  card.disableDragging();
  card = getCard($card, deck);
}

var $card = document.getElementById('card');
var $deck = document.getElementById('deck');
var $drop = document.getElementById('drop-zone');

var deck = Deck();
deck.mount($deck);

// Remove unused cards 
var removedCards = deck.cards.splice(40, 5);
removedCards.concat(deck.cards.splice(27, 5));
removedCards.concat(deck.cards.splice(14, 5));
removedCards.concat(deck.cards.splice(1, 5));
removedCards.forEach(function (removedCard) {
  removedCard.unmount();
});

deck.shuffle();

// Select the first card
var card = getCard($card, deck);
$drop.addEventListener("mouseup", changeCard, false);

// Allow to flip it 
//card.enableFlipping();
