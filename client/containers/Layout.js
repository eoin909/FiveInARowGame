import React  from 'react';
import io from 'socket.io-client'
import LoginForm from '../Components/LoginForm'
import GameContainer from './GameContainer'
import { USER_CONNECTED, LOGOUT, CREATE_GAME } from '../../Events'

const socketUrl = "http://localhost:3231"
class Layout extends React.Component {

	constructor(props) {
	  super(props);

	  this.state = {
	  	socket:null,
	  	user:null
	  };
	}

	componentWillMount() {
		this.initSocket()
	}

	/*
	*	Connect to and initializes the socket.
	*/
	initSocket = ()=>{
		const socket = io(socketUrl)

		socket.on('connect', ()=>{
			console.log("Connected");
		})

		this.setState({socket})
	}

	/*
	* 	Sets the user property in state
	*	@param user {id:number, name:string}
	*/
	setUser = (user)=>{
		const { socket } = this.state
		socket.emit(USER_CONNECTED, user);
		this.setState({user})
	}

	/*
	*	Sets the user property in state to null.
	*/
	logout = ()=>{
		const { socket, user } = this.state
		socket.emit(LOGOUT, {user})
		this.setState({user:null})
	}

	render() {
		const { title } = this.props
		const { socket, user } = this.state
		return (
      <div className="container">
      				{
      					!user ?
      					<LoginForm socket={socket} setUser={this.setUser} />
      					:
      					<GameContainer socket={socket} user={user} logout={this.logout} />
      				}
      			</div>
		);
	}
}
module.exports = Layout;
