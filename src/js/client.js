//dichiaro la connessione
var connection = new WebSocket('ws://localhost:8888'),
	name = "";

connection.onopen = function () {
	console.log("Connected");
};
connection.onerror = function (err) {
	console.log("Got error", err);
}

//implementazione della funzione send per inviare il messaggio (prima e al server e poi) all'altro peer
function send(message){
	if(connectedUser) {
		message.name = connectedUser;
	}
	connection.send(JSON.stringify(message));
}

//dichiarazione delle variabili
//elementi html
var loginSection = document.querySelector('#loginSection'), //login
	usernameInput = document.querySelector('#username'),
	loginButton = document.querySelector('#login'),
	joinGameSection = document.querySelector("#joinGameSection"), //joinGame
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
	yourConnection, connectedUser, cardPicked, position ;

var theirUsername = [];
var score = 10;
var isFinished = true;

//eventi onClick sui bottoni
//login
loginButton.addEventListener("click",function (event) {
	name = usernameInput.value;
	if(name.length > 0){
		send({
			type: "login",
			name: name
		});
	}
});
//joinGame
joinGameButton.addEventListener("click", function () {
	var theirUsernameValue = theirUsernameInput.value;
	if(theirUsernameValue.length > 0) {
		theirUsername.push(theirUsernameValue);
		startPeerConnection(theirUsername);
	}
});
//cardPicked
cardPickedButton.addEventListener("click", function() {
	console.log("theirUsername", theirUsername);
	cardPicked = cardPickedInput.value;
	if(cardPicked.length > 0) {
		cardPickedFunction(cardPicked, theirUsername);
	}
});
//cardDrop
cardDropButton.addEventListener("click", function() {
	position = cardDropInput.value;
	if(position.length > 0) {
		cardDropFunction(position, cardPicked, theirUsername);
	}

});
//endTurn
endTurnButton.addEventListener("click", function() {
	//TODO: metodo per calcolare il punteggio
	score = 10;
	//TODO: metodo per determinare se la partita è finita o no
	isFinished = true;
	endTurnFunction(score, isFinished, theirUsername);
});

//implementazioni delle funzioni handler
//onLogin
function onLogin(success){
	console.log("login");
	if(success === false){
		alert("Login unsuccessful, please try a different name.");
	}else{
		startConnection();
		//TODO: Qui tutto quello che succederà dopo il login!!!
	}
}
//onJoinGame
function onJoinGame(joinGame, user) {
	connectedUser = user;
	//Do something...

	//Se vuoi restare in attesa di una rerisposta obblifatoira:
	/*yourConnection.createAnswer(function (answer) {
		yourConnection.setLocalDescription(answer);
		send({
			type: "answer",
			answer: answer
		});
	}, function (error) {
		alert("An error has occurred");
	});*/
};
//onAnswer
/*function onAnswer(answer) {
	yourConnection.setRemoteDescription(new RTCSessionDescription(answer));
};*/
//onCandidate
function onCandidate(candidate) {
	yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
};
//onCardPicked
function onCardPicked(card, user){
	//Do something...
}
//onCardDrop
function onCardDrop(card, position, user){
	//Do something...
}
//onEndTurn
function onEndTurn(score, isFinished, user, otherUser){
	//Do something...
	//aggiorno la lista degli altri utenti aggiungendo il giocatore del turno precedente e togliendo l'attuale giocatore
	theirUsername = otherUser;
	theirUsername.push(user);
	theirUsername.shift();

}
//onLeave
function onLeave() {
	connectedUser = null;
	theirVideo.src = null;
	yourConnection.close();
	yourConnection.onicecandidate = null;
	yourConnection.onaddstream = null;
	setupPeerConnection(stream);
};

//implementazioni di altre funzioni
//avvio la connessione
function startConnection(){
	var configuration = { "iceServers": [{ "url": "stun:127.0.0.1:9876" }] };
	yourConnection = new RTCPeerConnection(configuration);

	//setup ice handling
	yourConnection.onicecandidate = function (event) {
		if(event.candidate) {
			send({ type: "candidate", candidate:event.candidate });
		}
	};
}
//inivito l'altro peer a giocaro
function startPeerConnection(user) {
	connectedUser = user;
	yourConnection.createOffer(function (name) {
		send({
			type: "joinGame",
			joinGame: name
		});
		yourConnection.setLocalDescription(name);
	}, function (error) {
		alert("An error has occurred.");
	});
};
//invio all'altro peer la carta che ho preso
function cardPickedFunction(cardPicked, user){
	connectedUser = user;
	yourConnection.createOffer(function (name) {
		send({
			type: "cardPicked",
			cardPicked: cardPicked,
			name: name,
			otherName: theirUsername
		});
		//yourConnection.setLocalDescription(name);
	}, function (error) {
		alert("An error has occurred.");
	});
}
//invio all'altro peer la poszione in cui ho messo la carta
function cardDropFunction(position, cardPicked, user) {
	connectedUser = user;
	yourConnection.createOffer(function (name) {
		send({
			type: "cardDrop",
			cardPicked: cardPicked,
			position: position,
			name: name,
			otherName: theirUsername
		});
	}, function (error) {
		alert("An error has occurred");
	});
}
//termino il mio turno
function endTurnFunction(score, isFinished, user) {
	connectedUser = user;
	yourConnection.createOffer(function(name) {
		send({
			type: "endTurn",
			score: score,
			isFinished: isFinished,
			name: name,
			otherName: theirUsername
		});
	}, function (error) {
		alert("An error has occurred");
	});
}

//dichiaro le varie funzionalità
connection.onmessage = function (message) {
	console.log("Got message", message.data);
	var data = JSON.parse(message.data);

	switch(data.type){
		case "login":
			onLogin(data.success);
			break;
		case "joinGame":
			onJoinGame(data.joinGame, data.name);
			break;
		case "answer":
			onAnswer(data.answer);
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