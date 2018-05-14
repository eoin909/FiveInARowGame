'use strict';

const drawPlayer = require('./player');
const drawBullets = require('./bullets');
const drawPlanets = require('./planet');

function Renderer (ctx, game, options = {}) {
    function draw () {
        ctx.clearRect(0, 0, 1200, 1200);

        for (const player of game.getPlayers()) {
            drawPlayer(ctx, player, {
                color: '#c58242',
                infoColor: '#cc8822',
                stateText: player.getName() + ' (local_pos)'
            });

            const ghosts = game.getGhosts(player.getId());

            if (options.showDestinationPosition && !options.naiveApproach && player !== game.getLocalPlayer()) {
                drawPlayer(ctx, ghosts.local, {
                    stateText: 'dest_pos'
                });
            }

            if (options.showServerPosition && !options.naiveApproach) {
                const ghostOptions = {
                    stateText: 'server_pos',
                    infoColor: 'rgba(255,255,255,0.2)'
                };

                drawPlayer(ctx, ghosts.server, ghostOptions);
            }
        }

        drawBullets(ctx, game.getRenderBullets());
        drawPlanets(ctx, game.getPlanets());

    }

    return Object.freeze({
        draw
    });
}

module.exports = { create: Renderer };
