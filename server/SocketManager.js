const io = require('./index.js').io
const Game = require('./Game');
const { createGame, createUser} = require('../Factories')
const {
				VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED,
				LOGOUT, CREATE_GAME, GAME_OVER, SERVER_UPDATE,
				PLAYER_INPUT, ACTIVE_GAME, CLIENT_ADDED,
				UPDATE_LIST, WINNER, LOSER,LEAVE
			} = require('../Events')

let connectedUsers = { }
let counter = 0
let games = new Set()

module.exports = function(socket){

	console.log("Socket Id:" + socket.id);

	//Verify Username
	socket.on(VERIFY_USER, (nickname, callback)=>{
		if(isUser(connectedUsers, nickname)){
			callback({ isUser:true, user:null })
		}else{
			callback({ isUser:false, user:createUser({name:nickname})})
		}
	})

	//User Connects with username
	socket.on(USER_CONNECTED, (user)=>{
		connectedUsers = addUser(connectedUsers, user)
		socket.user = user
		io.emit(USER_CONNECTED, connectedUsers)
		console.log(connectedUsers);
	})

	socket.on(UPDATE_LIST, ()=>{
		socket.emit(UPDATE_LIST, getUpdatedList())
	})

	//User disconnects
	socket.on('disconnect', ()=>{
		if("user" in socket){
			connectedUsers = removeUser(connectedUsers, socket.user.name)
			io.emit(USER_DISCONNECTED, connectedUsers)
			console.log("Disconnect", connectedUsers);
		}
	})

	//User logsout
	socket.on(LOGOUT, ({user})=>{
		for (const game of games) {
			if(game.isUserInGame(user)){
				game.addPlayer(user)
				if(game.isStarted()){
					let id = game.getOpponent(user.id)
					io.emit(`${LEAVE}-${id}`, getUpdatedList())
				}
				games.delete(game);
			}
		}
		connectedUsers = removeUser(connectedUsers, socket.user.name)
		io.emit(USER_DISCONNECTED, connectedUsers)
		io.emit(SERVER_UPDATE, getUpdatedList())
		console.log("Disconnect", connectedUsers);
	})

	socket.on(ACTIVE_GAME, ({gameId, previousGame, user})=>{
		for (const game of games) {
			if(game.getId()===gameId){
				game.addPlayer(user)
			} else if (game.getId()===previousGame) {
					if(game.isStarted()){
						let id = game.getOpponent(user.id)
						io.emit(`${LEAVE}-${id}`, getUpdatedList())
					}
				games.delete(game);
			}
		}
		io.emit(SERVER_UPDATE, getUpdatedList())
	})

	socket.on(PLAYER_INPUT, ({gameId, message, user})=>{
		for (const game of games) {
			if(game.getId()===gameId){
				if(game.processInput(message, user)){
					io.emit(SERVER_UPDATE, getUpdatedList())
					io.emit(`${WINNER}-${user.id}`, getUpdatedList())
					let id = game.getOpponent(user.id)
					io.emit(`${LOSER}-${id}`, getUpdatedList())
					games.delete(game);
				}
				io.emit(SERVER_UPDATE, getUpdatedList())
			}
		}
	})

	socket.on(CREATE_GAME, ({gameName, user})=>{
		counter++
		let game = Game.create({counter})
		game.addPlayer(user)
		socket.emit(`${CLIENT_ADDED}-${user.id}`, {
			id: game.getId(),
			name: game.getName(),
			gameStarted: game.isStarted(),
			turn: game.getTurn(),
			users: game.getUsersToJSON(),
			gameState: game.getCurrentStateToJSON()
		})
		games.add(game)
		io.emit(SERVER_UPDATE, getUpdatedList())
	})
}

/*
* Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to added to the list.
* @return userList {Object} Object with key value pairs of Users
*/
function addUser(userList, user){
	let newList = Object.assign({}, userList)
	newList[user.name] = user
	return newList
}

/*
* Removes user from the list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {string} name of user to be removed
* @return userList {Object} Object with key value pairs of Users
*/
function removeUser(userList, username){
	let newList = Object.assign({}, userList)
	delete newList[username]
	return newList
}

/*
* Creates a json object that contains the state of all current
* games
*/
function getUpdatedList() {
	return {
		games: Array.from(games).map(game => {
				return {
					id: game.getId(),
					name: game.getName(),
					gameStarted: game.isStarted(),
					turn: game.getTurn(),
					users: game.getUsersToJSON(),
					gameState: game.getCurrentStateToJSON()
				}
		})
	}
}

/*
* Checks if the user is in list passed in.
* @param userList {Object} Object with key value pairs of Users
* @param username {String}
* @return userList {Object} Object with key value pairs of Users
*/
function isUser(userList, username){
  	return username in userList
}
