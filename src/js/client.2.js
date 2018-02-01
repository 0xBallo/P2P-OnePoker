/* 
  ================================== Multiplayer Funcs =======================================
 */

//dichiarazione delle variabili
var peer, peersConnections = [],
  players = [];
var dropsCounter;

//---------------------------- P2P Handlers -----------------------------------------

//Start game function
function onStartGame(player) {
  multi = true;
  // set active player
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    if (p.name === player) {
      players[i].active = true;
    }
  }
  updatePlayerList();
  $startMulti.setAttribute('disabled', 'true');

  //add blocker on screen
  var $dropzone = document.querySelector('.active .dropzone');
  $blocker.style.top = $players.getBoundingClientRect().y + 'px';
  $blocker.style.left = $players.getBoundingClientRect().x + 'px';
  $blocker.style.width = $dropzone.getBoundingClientRect().width + 'px';
  $blocker.style.height = $dropzone.getBoundingClientRect().height + 'px';
  //set deck on table
  prepareDeck();
}

//Drop card function
function onDropCard(pile, cardData) {
  //animate to dropzone
  var pos;
  var c = pickCard($card, deck);
  c.setRankSuit(cardData.rank, cardData.suit);
  switch (pile) {
    case 1:
      pos = getPosition($drop1, c, parseInt(dropsCounter / 4) * 30);
      break;
    case 2:
      pos = getPosition($drop2, c, parseInt(dropsCounter / 4) * 30);
      break;
    case 3:
      pos = getPosition($drop3, c, parseInt(dropsCounter / 4) * 30);
      break;
    case 4:
      pos = getPosition($drop4, c, parseInt(dropsCounter / 4) * 30);
      break;

    default:
      break;
  }
  c.animateTo({
    delay: 0,
    duration: 500,
    ease: 'quartOut',
    x: pos.x,
    y: pos.y,
    onComplete: function () {}
  });
  c.$el.style.zIndex = 40;
  dropsCounter++;
}

//End player turn
function onEndTurn(player, score, next) {
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    if (p.name === player) {
      players[i].score += score;
      players[i].played = true;
    }
  }
  updatePlayerList();
  //TODO: check if next is me and if yes prepare start turn
}

// End game with winner
function onEndGame() {
  //TODO: implement method
}

// new peer connect to network
function onNewPeer(id) {
  var valid = true;
  players.forEach(p => {
    if (p.name === id) {
      valid = false;
    }
  });
  if (valid) {
    startPeerConnection(id);
  }
}

//Error handlers with server
function onError(err) {
  switch (err.type) {
    case 'unavailable-id':
      //error toast
      document.querySelector('.active .toast-error').classList.toggle('d-none');
      setTimeout(() => {
        document.querySelector('.active .toast-error').classList.add('d-none');
      }, 2000);
      break;

    default:
      console.error(err.type, err);
      break;
  }
}

//Login function to server
function onLogin(id) {
  console.info('My peer ID is: ' + id);
  // activate games functions
  document.querySelector('.navbar .username').innerHTML = user.name;
  document.querySelector('.active .toast-success').classList.toggle('d-none');
  setTimeout(() => {
    document.querySelector('.active .toast-success').classList.add('d-none');
  }, 2000);
  document.querySelectorAll('.page-links a')
    .forEach((el) => el.removeAttribute('disabled'));
}

//Connection function to a peer
function onPeerConnection(conn) {
  conn.on('open', function () {
    console.info('Connection established with ' + conn.peer);
  })

  conn.on('error', function (err) {
    console.error(err);
  })

  conn.on('data', function (data) {
    switch (data.type) {
      case 'startGame':
        onStartGame(data.player);
        break;
      case 'dropCard':
        onDropCard(data.pile, data.card);
        break;
      case 'endTurn':
        onEndTurn(data.player, data.score, data.next);
        break;
      case 'endGame':
        //TODO: implement method
        break;
      case 'newPeer':
        onNewPeer(data.id);
        break;

      default:
        console.warn('Unrecognized message type!', data);
        break;
    }
  });

  broadcastData({
    type: 'newPeer',
    id: conn.peer
  });

  peersConnections.push(conn);
  players.push({
    name: conn.peer,
    score: 0,
    active: false,
    played: false
  });

  updatePlayerList();

  $startMulti.removeAttribute('disabled');
  $joinMulti.setAttribute('disabled', 'true');
}

//create a peer connection
function startPeerConnection(id) {
  onPeerConnection(peer.connect(id));
  /* 
    conn.on('open', function () {
      console.info('Connection established with ' + conn.peer);
    });

    conn.on('error', function (err) {
      console.error(err);
    })

    conn.on('data', function (data) {

      switch (data.type) {
        case 'startGame':
          onStartGame(data.player);
          break;
        case 'dropCard':
          onDropCard(data.pile, data.card);
          break;
        case 'endTurn':
          //TODO: implement method
          break;
        case 'endGame':
          //TODO: implement method
          break;
        case 'newPeer':
          //TODO: implement method
          break;

        default:
          console.warn('Unrecognized message type!', data);
          break;
      }
    });

    peersConnections.push(conn);
    players.push({
      name: conn.peer,
      score: 0,
      active: false
    });

    updatePlayerList();

    $startMulti.removeAttribute('disabled');
    $joinMulti.setAttribute('disabled', 'true'); */
}


//---------------------------- P2P utils -------------------------------------------

//broadcast data to all peers
function broadcastData(data) {
  peersConnections.forEach(conn => conn.send(data));
}

//update player list on page
function updatePlayerList() {
  $players.innerHTML = "<h3>Players</h3>";
  players.forEach(p => {
    //add user to userlist
    var playerTemplate = document.getElementById('player-template');
    playerTemplate.content.querySelector(".tile-title").innerHTML = p.name;
    playerTemplate.content.querySelector(".tile-subtitle b").innerHTML = p.score;
    if (p.active) {
      playerTemplate.content.querySelector(".avatar .avatar-presence").classList.add('online');
    } else {
      playerTemplate.content.querySelector(".avatar .avatar-presence").classList.remove('online');
    }
    var clone = document.importNode(playerTemplate.content, true);
    $players.appendChild(clone);
  });
}

//handlers for peer object
function peerjsHandlers() {
  //connection to peerjs server
  peer.on('open', onLogin);

  //connection with other peer
  peer.on('connection', onPeerConnection);

  //errors
  peer.on('error', onError);
}



//-------------------------- P2P Main ----------------------------------------------

//init connection instance
function initConnection(name) {
  peer = new Peer(name, {
    key: 'onepoker',
    host: 'localhost',
    port: 8888
  });

  peerjsHandlers();
}
