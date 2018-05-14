import React, { Component } from 'react';
import SideBar from '../Components/SideBar'
import GameHeading from '../Components/GameHeading'
import MessageInput from '../Components/MessageInput'
import GameMap from '../Components/GameMap'
import {
				 CREATE_GAME,GAME_OVER, SERVER_UPDATE,
				 PLAYER_INPUT, ACTIVE_GAME, CLIENT_ADDED,
				 UPDATE_LIST, WINNER, LOSER, LEAVE
			  } from '../../Events'

export default class GameContainer extends Component {
	constructor(props) {
	  super(props);

	  this.state = {
	  	games:[],
	  	activeGame:null
	  };
	}

	componentDidMount() {
		const { socket, user } = this.props

		socket.emit(UPDATE_LIST)

		socket.on(UPDATE_LIST, (data) =>{
			this.setState({games:data.games})
		})

		socket.on(SERVER_UPDATE, (data) => {
			this.setState({games:data.games})
			const { games, activeGame} = this.state
			if(activeGame !== null){
				games.map((game)=>{
					if(game.id === activeGame.id)
					this.setState({activeGame:game})
				})
			}
		})

		const winnerEvent = `${WINNER}-${user.id}`
		const leaveEvent = `${LEAVE}-${user.id}`
		const losingEvent = `${LOSER}-${user.id}`
		const clientEvent =`${CLIENT_ADDED}-${user.id}`

		socket.on(winnerEvent, (data) => {
			alert("Winner Winner Chicken Dinner");
			this.setState({activeGame:null})
			this.setState({game:data.games})
		})

		socket.on(losingEvent, (data) => {
			alert("Better luck next time");
			this.setState({activeGame:null})
			this.setState({game:data.games})
		})

		socket.on(clientEvent, (data) => {
			this.setActiveGame(data);
			this.setState({activeGame:data})
		})

		socket.on(leaveEvent, (data) => {
			alert("Other Player left game");
			this.setState({activeGame:null})
		})
	}

	/*
	*	Updates the GameState of game with id passed in.
	*	@param gameId {number}
	*/
	updateGameState = (gameId) =>{
		return ({gameState})=>{
			this.setState({gameMap:gameState})
		}
	}

	/*
	*	sends Input to the specified game
	*	@param gameId {number}  The id of the game to be added to.
	*	@param message {string} The message to be added to the game.
	*/
	sendInput = (gameId, message)=>{
		const { socket, user } = this.props
		socket.emit(PLAYER_INPUT, {gameId, message, user} )
	}


	/*
	*	sends createGame event to server
	*/
	createGame = ()=>{
		const { socket, user } = this.props
		socket.emit(CREATE_GAME, {gameName:"game one", user})
	}

	setActiveGame = (newActiveGame)=>{
		const { socket, user } = this.props
		const { activeGame } = this.state
		if(activeGame){
			socket.emit(ACTIVE_GAME, {gameId:newActiveGame.id, previousGame:activeGame.id, user})
		} else {
			socket.emit(ACTIVE_GAME, {gameId:newActiveGame.id, previousGame:null, user})
		}
		this.setState({activeGame:newActiveGame})
	}

	render() {
		const { user, logout } = this.props
		const { games, activeGame, createGame } = this.state
		return (
			<div className="container">
				<SideBar
					logout={logout}
					games={games}
					createGame={this.createGame}
					user={user}
					activeGame={activeGame}
					setActiveGame={this.setActiveGame}
					/>
				<div className="game-room-container">
					{
						activeGame !== null ? (
							<div className="game-room">
								<GameHeading name={activeGame.name} />
									<div>
										<GameMap
											games={games}
											activeGame={activeGame}
										/>
										{
											activeGame.gameStarted ? (
												<MessageInput
													user={user}
													turn={activeGame.turn}
													sendInput={
														(message)=>{
															this.sendInput(activeGame.id, message)
														}
													}
												/>
											):(
												null
											)
										}
									</div>
								</div>
						):(
							<div className="game-room choose">
								<h3>Choose a game!</h3>
							</div>
						)
					}
				</div>
			</div>
		);
	}

}
