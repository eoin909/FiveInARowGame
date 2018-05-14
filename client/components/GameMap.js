import React, { Component } from 'react';

export default class Map extends Component {
	constructor(props) {
	  super(props);
	}

	getDisplay ({col}){
		let empty = "[ ]"
		if(col === "b"){
			return (empty)
		} else {
			return (col)
		}
	}

	render() {
		const { games, activeGame } = this.props
		const gameState = JSON.parse(activeGame.gameState)

		return (
			<span>
			{
				activeGame.gameStarted ? (
					gameState.map((row)=>{
						return(
							<td> {
								row.map((col)=>{
									return (
										<tr><h3>{this.getDisplay({col})}</h3></tr>
									)
								})
							}
							</td>
						)
					})
				):(
				<div className="game-room choose">
					<h3>Waiting for player to join!</h3>
				</div>
				)
			}
			</span>
		);

	}
}
