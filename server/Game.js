const uuidv4 = require('uuid/v4')

function Game ({counter}) {
    const id = uuidv4();
    let name = "Game " + counter
    let gameUsers = []
    let winner = false;
    let gameState = getMapDefault()
    let it = makeIterator(['X', 'O']);
    let turn = null;
    let gameStarted = false
    let rowZeros = [0, 0, 0, 0, 0]
    let rowPos = [0, -1, -2, -3, -4]
    let rowNeg = [0, 1, 2, 3, 4]

    let winningPos = [
        {x:rowZeros, y:rowPos},
        {x:rowPos, y:rowPos},
        {x:rowPos, y:rowZeros},
        {x:rowPos, y:rowNeg},
        {x:rowZeros, y:rowNeg},
        {x:rowNeg, y:rowNeg},
        {x:rowNeg, y:rowZeros},
        {x:rowNeg, y:rowPos},
    ]
    function getName () {
        return name;
    }

    function getId () {
        return id;
    }

    function getUsers() {

      return {
        users: Array.from(gameUsers).map(user => {
            return {
              id: user.getId(),
              name: user.getName()
            }
        })
      }
    }
    function getMapDefault(){
    	let x = new Array(9)
    	for (var j = 0; j < x.length; j++) {
    		x[j] = new Array(9);
    	}
    	for (var i = 0; i < x.length; i++) {
    		for (var y = 0; y < x[i].length; y++) {
    			x[i][y] = "b"
    		}
    	}
    	return x
    }

    function processInput(data, user) {
      let icon = null
      let x = null
      let y = null

      for (var i = 0; i < gameUsers.length; i++) {
        if(gameUsers[i].id===user.id){
          icon = gameUsers[i].icon
        } else {
          turn = gameUsers[i].id
        }
      }
      for (var i = 8; i >= 0; i--) {
        if(gameState[data][i] === "b"){
          gameState[data][i] = icon
          x=data
          y=i
          break;
        }
      }
      return checkForWinner(x,y)
    }

    function addPlayer(user) {
      let alreadyMember = false
      for (var i = 0; i < gameUsers.length; i++) {
        if(gameUsers[i].id===user.id){
          alreadyMember=true
        }
      }
      if(!alreadyMember){
        user.icon = it.next().value;
        gameUsers.push(user)
        if(gameUsers.length === 2){
          startGame()
        }
      }
    }

    function getCurrentState() {
      return gameState
    }

    function getOpponent(id) {
      for (var i = 0; i < gameUsers.length; i++) {
        if(gameUsers[i].id!==id){
          return gameUsers[i].id
        }
      }
    }

    function getCurrentStateToJSON() {
      return JSON.stringify(gameState)
    }

    function getUsersToJSON() {
      return JSON.stringify(gameUsers)
    }

    function startGame() {
      gameStarted = true
      turn = gameUsers[0].id
    }

    function isStarted() {
      return gameStarted
    }

    function toJSON () {
        return {
            id,
            name,
            gameUsers
        };
    }

    function isUserInGame(user) {
      for (var i = 0; i < gameUsers.length; i++) {
        if(gameUsers[i].id ===user.id){
          return true
        }
      }
      return false
    }

    function getTurn() {
      return turn
    }

    function checkForWinner(x,y) {
      let startIcon = gameState[x][y]
      for(var i=0; i<winningPos.length; i++){
        let xPosIt = makeIterator(winningPos[i].x)
        let yPosIt = makeIterator(winningPos[i].y)
        let winningPosition = true
        let counter = 0
        while(xPosIt.hasNext().value && xPosIt.hasNext().value
        && winningPosition){
          let xIt = xPosIt.next().value
          let yIt = yPosIt.next().value
          let xPos = x + xIt
          let yPos = y + yIt
          if( xPos>=0 && xPos<9 && yPos>=0 && yPos<9 ){
            let currentIcon = gameState[xPos][yPos]
              if(startIcon === currentIcon ){
                counter++
              } else {
                winningPosition = false
              }
          } else {
            winningPosition = false
          }
        }
        if(winningPosition && counter===5){
          console.log("winner winner chicken dinner")
          return true
        }
      }
      return false
    }

  function makeIterator(array) {
    var nextIndex = 0;

    return {
       next: function() {
           return nextIndex < array.length ?
               {value: array[nextIndex++], done: false} :
               {done: true};
       },
                hasNext: function() {
           return nextIndex < array.length ?
               {value: true} :
               {value: false};
       }
    };
  }

    return Object.freeze({
        getId,
        getName,
        getUsers,
        addPlayer,
        getCurrentState,
        processInput,
        getCurrentStateToJSON,
        getUsersToJSON,
        getTurn,
        getOpponent,
        isStarted,
        isUserInGame,
        toJSON
    });
}

module.exports = { create: Game };
