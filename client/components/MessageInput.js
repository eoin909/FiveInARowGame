import React, { Component } from 'react';

export default class MessageInput extends Component {
	constructor(props) {
	  super(props);

	  this.state = {
	  	message:""
		  };
	}

	handleSubmit = (e)=>{
		e.preventDefault()
		this.sendInput()
		this.setState({message:""})
	}

	sendInput = ()=>{
		if(this.state.message.length === 1){
			let input = Number(this.state.message)
			if( input < 10 && input > 0 ){
				input--
				this.props.sendInput(input)
				this.setState({error:null})
			} else {
				this.setError("Invalid Selection, Please pick a Number Between 1 and 9")
			}
		} else {
			this.setError("Invalid Selection, Please pick a Number Between 1 and 9")
		}
	}

	setError = (error)=>{
		this.setState({error})
	}

	render() {
		const { message, error } = this.state
		const { turn, user } = this.props
		let placeholderString = (turn === user.id) ? "It's your turn "+ user.name + ", please enter column (1-9)" : "waiting for opponent to make their move"
		return (
			<div className="message-input">
				<form
					onSubmit={ this.handleSubmit }
					className="message-form">

					<input
						id = "message"
						ref = {"messageinput"}
						type = "text"
						className = "form-control"
						value = { message }
						autoComplete = {'off'}
						placeholder = { placeholderString }
						onKeyUp = { e => { e.keyCode !== 13  } }
						onChange = {
							({target})=>{
								this.setState({message:target.value})
							}
						}
						/>
					<button
						disabled = { message.length < 1 || turn !== user.id}
						type = "submit"
						className = "send"

					> Send </button>
				</form>
				<div className="error">{error ? error:null}</div>
			</div>
		);
	}
}
