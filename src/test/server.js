var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: 8888 });

users = {};

function sendTo(conn, message){
	conn.send(JSON.stringify(message));
}

wss.on('connection', function (connection) {
	console.log("User connected");
	
	connection.on('message', function (message) {
		//handle message
		//console.log("Got message:", message);
		var data;

		try {
			data = JSON.parse(message);
		}catch (e){
			console.log("Error parsing JSON");
			data = {};
		}

		switch (data.type) {
			case "login":
				console.log("User logged in as", data.name);
				if (users[data.name]) {
					sendTo(connection, {
						type: "login",
						success: false
					});
				} else {
					users[data.name] = connection;
					connection.name = data.name;
					sendTo(connection, {
						type: "login",
						success: true
					});
				}
			break;
			case "joinGame":
				console.log("User invited at the game", data.name);
				for (i = 0; i < data.name.length; i ++){
					var conn = users[data.name[i]];
					if(conn != null){
						connection.otherName = data.name;
						sendTo(conn, {
							type: "joinGame",
							name: connection.name
						});
					}
				}
			break;
			case "answer":
				console.log("Sending answer to", data.name);
				var conn = users[data.name];
				if(conn != null){
					connection.otherName = data.name;
					sendTo(conn, {
						type: "answer",
						answer: data.answer
					});
				}
			break;
			case "candidate":
				console.log("Sending candidate to", data.name);
				var conn = users[data.name];
				if(conn != null){
					sendTo(conn, {
						type: "candidate",
						candidate: data.candidate
					});
				}
			break;
			case "cardPicked":
				console.log("a card was taken from", connection.name);
				for (i = 0; i < data.name.length; i ++){
					var conn = users[data.name[i]];
					if(conn != null){
						connection.otherName = data.name;
						sendTo(conn, {
							type: "cardPicked",
							cardPicked: data.cardPicked,
							name: connection.name,
							otherName: data.otherName
						});
					}
				}
			break;
			case "cardDrop":
				console.log("a card was dropped by", connection.name);
				for (i = 0; i < data.name.length; i ++){
					var conn = users[data.name[i]];
					if(conn != null){
						connection.otherName = data.name;
						sendTo(conn, {
							type: "cardDrop",
							card: data.cardPicked,
							position: data.position,
							name: connection.name,
							otherName: data.otherName
						});
					}
				}
			break;
			case "endTurn":
				console.log("turn over, now it s the turn of", data.name);
				for (i = 0; i < data.name.length; i ++){
					var conn = users[data.name[i]];
					if(conn != null){
						connection.otherName = data.name;
						sendTo(conn, {
							type: "endTurn",
							score: data.score,
							isFinished: data.isFinished,
							name: connection.name,
							otherName: data.otherName
						});
					}
				}
			break;
			case "leave":
				console.log("Disconnecting user from", data.name);
				var conn = users[data.name];
				conn.otherName = null; //rimozione dell'utente dall'elenco
				if (conn != null){
					sendTo(conn, {
						type: "leave"
					});
				}
			break;
			default:
				sendTo(connection, {
					type: "error",
					message: "Unrecognized command: " + data.type
				});
				break;
			}

	});
	//connection.send('Hello World');

	connection.on('close', function () {
		//handle disconnessions
		if (connection.name){
			delete users[connection.name];
			if(connection.otherName){
				console.log("Disconnecting user from", connection.otherName);
				var conn = users[connection.otherName];
				conn.otherName = null;
				if(conn != null){
					sendTo(conn, {
						type: "leave"
					});
				}
			}
		}
	});



});