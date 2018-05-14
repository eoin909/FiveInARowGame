'use strict';

const Planet = require('./Planet');

function Network ({ game, socket, pingTimeout }) {
    let previousPing = 0;
    let netPing = 0;
    let netLatency = 0;

    function onPlayerJoined (playerData) {
        const planet = Planet.create({
            id: playerData.id,
            controlledBy: playerData.controlledBy,
            x: playerData.x,
            y: playerData.y,
            cellCount: playerData.cellCount
        });
        game.addPlanet(planet);
    }

    function onPlayerLeft (playerId) {
        game.removePlayer(playerId);
    }

    function onDisconnect () {
        for (const player of game.getPlayers()) {
            if (player !== game.getLocalPlayer()) {
                game.removePlayer(player.getId());
            }
        }

        game.stop();
    }

    function onStartGame (data) {

        console.log("start game");
        const serverTime = data.serverTime;

        game.setTime(serverTime + netLatency);

        console.log('server time is about ' + game.getServerTime());

      //  game.clearPlayers();

        console.log(data);
        console.log(JSON.stringify(data));
        for (const playerData of data.planets) {
            onPlayerJoined(playerData);
        }

        game.setLocalPlayer(data.localClientId);
    }

    function getNetLatency () {
        return netLatency;
    }

    function getNetPing () {
        return netPing;
    }

    function send (data) {
     // console.log("data network.js client")
        socket.send(data);
    }

    /**
     * Ping the server.
     */
    const pingInterval = setInterval(() => {
        previousPing = new Date().getTime();
        socket.emit('clientPing', previousPing);
    }, pingTimeout);

    socket.on('disconnect', () => {
        clearInterval(pingInterval);
    });

    socket.on('serverPing', (data) => {
        netPing = new Date().getTime() - data;
        netLatency = netPing / 2;
    });

    socket.on('playerJoined', onPlayerJoined);
    socket.on('playerLeft', onPlayerLeft);
    socket.on('onLeftRoom', onDisconnect);
    socket.on('onServerUpdate', game.onServerUpdate);

    socket.on('startGame', onStartGame);
    socket.on('error', onDisconnect);

    return Object.freeze({
        getNetLatency,
        getNetPing,
        send
    });
}

module.exports = { create: Network };
