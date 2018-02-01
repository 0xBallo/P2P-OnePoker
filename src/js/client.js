/* 
  ================================== Multiplayer Funcs =======================================
 */


//dichiarazione delle variabili
var connection;
//elementi html
var joinGameSection = document.querySelector("#joinGameSection"), //joinGame
  theirUsernameInput = document.querySelector('#theirusername'),
  joinGameButton = document.querySelector("#joinGameButton"),
  cardPickedSection = document.querySelector("#cardPickedSection"), //cardPicked
  cardPickedInput = document.querySelector("#cardPickedInput"),
  carPickedButton = document.querySelector("#cardPickedButton"),
  cardDropSection = document.querySelector("#cardDropSection"), //cardDrop
  cardDropInput = document.querySelector("#cardDropInput"),
  cardDropButton = document.querySelector("#cardDropButton"),
  endTurnSection = document.querySelector("#endTurnSection"), //endTurn
  endTurnButton = document.querySelector("#endTurnButton"),
  myConnection, connectedPlayer, cardPicked, position;

var playersConnected = [];
var score = 10;
var isFinished = true;

//---------------------------- P2P utils -----------------------------------------

//implementazione della funzione send per inviare il messaggio (prima e al server e poi) all'altro peer
function send(message) {
  if (connectedPlayer) {
    message.name = connectedPlayer;
  }
  connection.send(JSON.stringify(message));
}

//implementazioni di altre funzioni
//avvio la connessione
function startConnection() {
  var configuration = {
    "iceServers": [{
      "url": "stun:127.0.0.1:9876"
    }]
  };
  myConnection = new RTCPeerConnection(configuration);

  //setup ice handling
  myConnection.onicecandidate = function (event) {
    if (event.candidate) {
      send({
        type: "candidate",
        candidate: event.candidate
      });
    }
  };
}

//inivito l'altro peer a giocaro
function startPeerConnection(user) {
  connectedPlayer = user;
  myConnection.createOffer(function (name) {
    send({
      type: "joinGame",
      joinGame: name
    });
    myConnection.setLocalDescription(name);
  }, function (error) {
    console.error("An error has occurred during Peer connection.");
  });
};

//invio all'altro peer la carta che ho preso
function cardPickedFunction(cardPicked, user) {
  connectedPlayer = user;
  myConnection.createOffer(function (name) {
    send({
      type: "cardPicked",
      cardPicked: cardPicked,
      name: name,
      otherName: playersConnected
    });
    //yourConnection.setLocalDescription(name);
  }, function (error) {
    console.error("An error has occurred during Peer connection.");
  });
}

function onRoomPlayers(players) {
  //DEBUG: update player's list
  players.forEach(p => {
    console.log(p);
  });
};
//send player's list to new player
function sendPlayersList() {
  myConnection.createOffer(function (name) {
    send({
      type: "roomPlayers",
      players: playersConnected
    });
  }, function (error) {
    console.error("An error has occurred during Peer connection");
  });
}

//invio all'altro peer la poszione in cui ho messo la carta
function cardDropFunction(position, cardPicked, user) {
  connectedPlayer = user;
  myConnection.createOffer(function (name) {
    send({
      type: "cardDrop",
      cardPicked: cardPicked,
      position: position,
      name: name,
      otherName: playersConnected
    });
  }, function (error) {
    console.error("An error has occurred during Peer connection");
  });
}
//termino il mio turno
function endTurnFunction(score, isFinished, user) {
  connectedPlayer = user;
  myConnection.createOffer(function (name) {
    send({
      type: "endTurn",
      score: score,
      isFinished: isFinished,
      name: name,
      otherName: playersConnected
    });
  }, function (error) {
    console.error("An error has occurred during Peer connection");
  });
}

//---------------------------- P2P Handlers -------------------------------------------

//implementazioni delle funzioni handler
//onLogin
function onLogin(success) {
  console.log("login");
  if (success === false) {
    //error toast
    document.querySelector('.active .toast-error').classList.toggle('d-none');
    setTimeout(() => {
      document.querySelector('.active .toast-error').classList.add('d-none');
    }, 3000);
  } else {
    startConnection();
    // activate games functions
    document.querySelector('.navbar .username').innerHTML = user.name;
    document.querySelector('.active .toast-success').classList.toggle('d-none');
    setTimeout(() => {
      document.querySelector('.active .toast-success').classList.add('d-none');
    }, 3000);
    document.querySelectorAll('.page-links a')
      .forEach((el) => el.removeAttribute('disabled'));
  }
}
//onJoinGame
function onJoinGame(joinGame, user) {
  connectedPlayer = user;

  //add user to userlist
  var playerTemplate = document.getElementById('player-template');
  playerTemplate.content.querySelector(".tile-title").innerHTML = user;
  var clone = document.importNode(playerTemplate.content, true);
  $players.appendChild(clone);

  $startMulti.removeAttribute('disabled');
  $joinMulti.setAttribute('disabled', 'true');

  //sendPlayersList();
};
//onRoomPlayers
function onRoomPlayers(players) {
  //DEBUG: update player's list
  players.forEach(p => {
    console.log(p);
  });
};
//onCandidate
function onCandidate(candidate) {
  myConnection.addIceCandidate(new RTCIceCandidate(candidate));
};
//onCardPicked
function onCardPicked(card, user) {
  //Do something...
}
//onCardDrop
function onCardDrop(card, position, user, users) {
  //DEBUG: test
  console.log(card, position, user, users);
}
//onEndTurn
function onEndTurn(score, isFinished, user, otherUser) {
  //Do something...
  //aggiorno la lista degli altri utenti aggiungendo il giocatore del turno precedente e togliendo l'attuale giocatore
  playersConnected = otherUser;
  playersConnected.push(user);
  playersConnected.shift();
}
//onLeave
function onLeave() {
  connectedPlayer = null;
  theirVideo.src = null;
  myConnection.close();
  myConnection.onicecandidate = null;
  myConnection.onaddstream = null;
  setupPeerConnection(stream);
};

//joinGame
/* joinGameButton.addEventListener("click", function () {
  var theirUsernameValue = theirUsernameInput.value;
  if (theirUsernameValue.length > 0) {
    theirUsername.push(theirUsernameValue);
    startPeerConnection(theirUsername);
  }
});
//cardPicked
cardPickedButton.addEventListener("click", function () {
  console.log("theirUsername", theirUsername);
  cardPicked = cardPickedInput.value;
  if (cardPicked.length > 0) {
    cardPickedFunction(cardPicked, theirUsername);
  }
});
//cardDrop
cardDropButton.addEventListener("click", function () {
  position = cardDropInput.value;
  if (position.length > 0) {
    cardDropFunction(position, cardPicked, theirUsername);
  }

});
//endTurn
endTurnButton.addEventListener("click", function () {
  //TODO: metodo per calcolare il punteggio
  score = 10;
  //TODO: metodo per determinare se la partita è finita o no
  isFinished = true;
  endTurnFunction(score, isFinished, theirUsername);
}); */

//-------------------------- P2P Main ----------------------------------------------

//init connection instance
function initConnection() {
  //dichiaro la connessione
  connection = new WebSocket('ws://localhost:8888');

  connection.onopen = function () {
    console.info("Connection established!");
  };
  connection.onerror = function (err) {
    console.error("Error during connection!!", err);
  }
  //dichiaro le varie funzionalità
  connection.onmessage = function (message) {
    console.info("Message received", message.data);
    var data = JSON.parse(message.data);

    switch (data.type) {
      case "login":
        onLogin(data.success);
        break;
      case "joinGame":
        onJoinGame(data.joinGame, data.name);
        break;
      case "roomPlayers":
        onRoomPlayers(data.players);
        break;
      case "candidate":
        onCandidate(data.candidate);
        break;
      case "cardPicked":
        onCardPicked(data.card, data.name, data.otherName);
        break;
      case "cardDrop":
        onCardDrop(data.card, data.position, data.name, data.otherName);
        break;
      case "endTurn":
        onEndTurn(data.score, data.isFinished, data.name, data.otherName);
        break;
      case "leave":
        onLeave();
        break;
      case "default":
        break;
    }
  };
}
