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

  if (destination !== current) {
    document.querySelector('.page-links .active').classList.toggle('active');
    destSrc.classList.toggle('active');
    currSrc.classList.toggle('active');
    currSrc.classList.toggle('d-none');
    destPage = document.querySelector('.page[data-page="' + destination + '"]');
    destPage.classList.toggle('active');
    destPage.classList.toggle('d-none');
  }
}

// Save nickname insert by user
function chooseUsername(event) {
  var name = document.getElementById('input-username').value;
  document.querySelector('.navbar .username').innerHTML = name;
  document.querySelector('.toast-success').classList.toggle('d-none');
  setTimeout(() => {
    document.querySelector('.toast-success').classList.add('d-none');
  }, 3000);
  document.querySelectorAll('.page-links a')
    .forEach((el) => el.removeAttribute('disabled'));
}

// Add event handler for theme to the components
function addHandlers() {
  document.querySelectorAll('.page-links .btn')
    .forEach((el) => el.addEventListener('click', changePage));

  document.getElementById('btn-username').addEventListener('click', chooseUsername);

  /* $drop1.addEventListener("mouseup", changeCard, false);
  $drop2.addEventListener("mouseup", changeCard, false);
  $drop3.addEventListener("mouseup", changeCard, false);
  $drop4.addEventListener("mouseup", changeCard, false); */
  $drop1.addEventListener("click", changeCard, false);
  $drop2.addEventListener("click", changeCard, false);
  $drop3.addEventListener("click", changeCard, false);
  $drop4.addEventListener("click", changeCard, false);

  $new.addEventListener("click", newGame, false);
  $next.addEventListener("click", next, false);
}


/*
  ================================== Game Funcs =============================================
*/

//get card from deck
function getCard($container, d) {
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
      //TODO: change alert to other!(Maybe animation!)
      alert('You won OnePoker!!');
    } else {
      $next.removeAttribute('disabled');
    }
  } else {
    c = d.cards.pop();
    c.mount($container);
    /* c.enableDragging(); */
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
  var c1, c2, c3, c4;
  //Dropzone 1
  c1 = d.cards.pop();
  c1.animateTo({
    delay: 0,
    duration: 500,
    ease: 'quartOut',
    x: $drop1.getBoundingClientRect().x - c1.$el.getBoundingClientRect().x,
    y: $drop1.getBoundingClientRect().y - c1.$el.getBoundingClientRect().y,
    onComplete: function () {
      c1.setSide('front');
    }
  });
  r1 = c1.rank;
  drops[0].push(deck2pokersolver(c1));
  //Dropzone 2
  c2 = d.cards.pop();
  c2.animateTo({
    delay: 500,
    duration: 500,
    ease: 'quartOut',
    x: $drop2.getBoundingClientRect().x - c2.$el.getBoundingClientRect().x,
    y: $drop2.getBoundingClientRect().y - c2.$el.getBoundingClientRect().y,
    onComplete: function () {
      c2.setSide('front');
    }
  });
  r2 = c2.rank;
  drops[1].push(deck2pokersolver(c2));
  //Dropzone 3
  c3 = d.cards.pop();
  c3.animateTo({
    delay: 1000,
    duration: 500,
    ease: 'quartOut',
    x: $drop3.getBoundingClientRect().x - c3.$el.getBoundingClientRect().x,
    y: $drop3.getBoundingClientRect().y - c3.$el.getBoundingClientRect().y,
    onComplete: function () {
      c3.setSide('front');
    }
  });
  r3 = c3.rank;
  drops[2].push(deck2pokersolver(c3));
  //Dropzone 4
  c4 = d.cards.pop();
  c4.animateTo({
    delay: 1500,
    duration: 500,
    ease: 'quartOut',
    x: $drop4.getBoundingClientRect().x - c4.$el.getBoundingClientRect().x,
    y: $drop4.getBoundingClientRect().y - c4.$el.getBoundingClientRect().y,
    onComplete: function () {
      c4.setSide('front');
    }
  });
  r4 = c4.rank;
  drops[3].push(deck2pokersolver(c4));
  //check instant win
  if (c1.rank === c2.rank && c2.rank === c3.rank && c3.rank === c4.rank) {
    instantWin = true;
    score = 502;
  }
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
        offsetY = drops[0].length;
      }
      break;
    case 'drop2':
      if (!dropsLock[1]) {
        drops[1].push(deck2pokersolver(card));
        dropsLock[1] = true;
        regular = true;
        offsetY = drops[1].length;
      }
      break;
    case 'drop3':
      if (!dropsLock[2]) {
        drops[2].push(deck2pokersolver(card));
        dropsLock[2] = true;
        regular = true;
        offsetY = drops[2].length;
      }
      break;
    case 'drop4':
      if (!dropsLock[3]) {
        drops[3].push(deck2pokersolver(card));
        dropsLock[3] = true;
        regular = true;
        offsetY = drops[3].length;
      }
      break;
    default:
      break;
  }

  /* card.disableDragging(); */
  if (regular) {
    offsetY = (offsetY - 1) * 30;
    card.animateTo({
      delay: 0,
      duration: 500,
      ease: 'quartOut',
      x: event.currentTarget.getBoundingClientRect().x - card.$el.getBoundingClientRect().x + 7.25 + card.x,
      y: event.currentTarget.getBoundingClientRect().y - card.$el.getBoundingClientRect().y + offsetY,
      onComplete: function () {
        //c3.setSide('front');
      }
    });
    card.$el.style.zIndex = 40;
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
    /* card.enableDragging(); */
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

  setTimeout(function () {
    first4Cards(deck);
  }, 1000);

  setTimeout(function () {
    // Select the first card
    card = getCard($card, deck);
  }, 1400);
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
  $next.setAttribute('disabled', true);
  start();
}

/*
  ======================== Main Program =================================
*/

var $card, $deck, $drop1, $drop2, $drop3, $drop4, $new, $next, $scores, $sum;
var drops, dropsLock;
var card, deck, removedCards;
var sum, score;
var instantWin = false;

window.onload = function () {
  $card = document.getElementById('deck');
  $deck = document.getElementById('deck');
  $drop1 = document.getElementById('drop1');
  $drop2 = document.getElementById('drop2');
  $drop3 = document.getElementById('drop3');
  $drop4 = document.getElementById('drop4');
  $new = document.getElementById('start');
  $next = document.getElementById('next');
  $scores = document.getElementById('scores');
  $sum = document.getElementById('sum');

  addHandlers();
};
