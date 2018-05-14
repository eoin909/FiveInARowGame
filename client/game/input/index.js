'use strict';

const Keyboard = require('./utils/keyboard');
const Mouse = require('./utils/mouse');

function inputHandler (game) {
    const localId = null;
    const keyboard = Keyboard.create();
    const mouse = Mouse.create(game);

    function getInput () {
      const input =  mouse.getInputs();
      let inputs = "";
      for(let i =0; i<input.length;i++){
        inputs += input[i];
      }
      return inputs;
    }

    function setLocalPlayer(id) {
      let localId = id;
      mouse.setLocalPlayer(id);
      //console.log("local id " + id);

    }

    function getMouseEvents(planets) {
    //   console.log("planets NO" + planets.length);
    // console.log(planets);
    }

    function setPos(value) {
      mouse.setPos(value);
    }
    return {
        getInput,
        getMouseEvents,
        setLocalPlayer,
        setPos
    };
}

module.exports = inputHandler;
