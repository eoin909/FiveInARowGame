'use strict';

var clicked	= false;
const localPlayerId = [];
const planetSelected = new Map();

function Mouse (game) {

  const canvas =  null;
  let inputs = [];
  const planetSelected = new Map();
  let localPlayer = null;

  function click (event) {
    let mouse = getMousePos(event)
    console.log("x: " + mouse.x + " y: " + mouse.y);
    clicked=true;
  }

    function unclick (event) {

      if(planetSelected.size > 1){
        processInputs(planetSelected);
      }

      for (const planet of planetSelected.values()){
        planet.setSelectedBy(null);
      }
      planetSelected.clear();
      clicked=false;
    }

    function moveFunction (event) {

      if(clicked){
        var planets =  game.getPlanets();

        for (const planet of planets) {
          const { x, y } = planet.getPosition();
          const radius = planet.getRenderingRadius();
          const id = localPlayer;

          let mouse = getMousePos(event)

          if (Math.abs( x - mouse.x ) <= radius){
            if (Math.abs( y - ( mouse.y )) <= radius){
              if ( planetSelected.has('target') ){
                if (planetSelected.get('target').getControlledBy() === id){
                  planetSelected.get("target").setSelectedBy('draw');
                } else {
                  planetSelected.get("target").setSelectedBy(null);
                }
              }

              if (planet.getControlledBy() === id){
                planetSelected.set(planet.getId(), planet);
                planetSelected.set("target", planet);
                planet.setSelectedBy('target');
              } else {
                planetSelected.set("target", planet);
                planet.setSelectedBy("target");
              }
            }
          }
        }
      }
    }

    function processInputs(input) {
      let data = '';
      data += "begin,"

      input.forEach(function (item, key, mapObj) {
                data += key + "_" + item.getId() + "," ; })

      data += "end,"
      inputs.push(data);
    }

    function getMousePos(evt){
      let can = game.getCanvas();
      const rect = can.getBoundingClientRect();
      return {
        y: evt.clientY - rect.top,
        x: evt.clientX - rect.left
      }
    }

    function getInputs() {
      let tempInput = inputs;
      inputs = [];
      return tempInput;
    }

    function setLocalPlayer(id) {
      localPlayer = id;
    }
    function stopListening () {
      document.addEventListener('mousedown', click, false);
      document.addEventListener('mouseup', unclick, false);
      document.addEventListener('mousemove', moveFunction, false);
    }
    document.addEventListener('mousedown', click, false);
    document.addEventListener('mouseup', unclick, false);
    document.addEventListener('mousemove', moveFunction, false);

    return Object.freeze({
        getInputs,
        stopListening,
        setLocalPlayer
    });
}


module.exports = { create: Mouse };
