import React, { Component } from 'react';
import FACrosshairs from 'react-icons/lib/fa/crosshairs'
import MdEject from 'react-icons/lib/md/eject'

export default class SideBar extends Component{

	render(){
		const { games, activeGame, user, setActiveGame, logout, createGame} = this.props
		return (
			<div id="side-bar">
					<div className="current-user">
						<div className="app-name">Create Game</div>
						<div className="menu">
						<div onClick={()=>{createGame()}} title="createGame" className="logout">
						<FACrosshairs/>
						</div>
						</div>
					</div>
					<div
						className="users"
						ref='users'
						onClick={(e)=>{ (e.target === this.refs.user) && setActiveGame(null) }}>

						{
							games.map((game)=>{
								if(game.name && (!game.gameStarted || activeGame && activeGame.id === game.id)){
									const classNames = (activeGame && activeGame.id === game.id) ? 'active' : ''
									return(
										<div
											key={game.id}
											className={`user ${classNames}`}
											onClick={ ()=>{ setActiveGame(game) } }
											>
											{game.name}
										</div>
									)
								}
								return null
							})
						}
					</div>
					<div className="current-user">
						<span>{user.name}</span>
						<div onClick={()=>{logout()}} title="Logout" className="logout">
							<MdEject/>
						</div>
					</div>
			</div>
		);
	}
}
