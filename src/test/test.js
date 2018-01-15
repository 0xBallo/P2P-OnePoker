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
$drop1.addEventListener("mouseup", changeCard, false);
$drop2.addEventListener("mouseup", changeCard, false);
$drop3.addEventListener("mouseup", changeCard, false);
$drop4.addEventListener("mouseup", changeCard, false);

// Allow to flip it 
//card.enableFlipping();
