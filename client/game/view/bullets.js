'use strict';

function draw (ctx, bullets) {
    for (const bullet of bullets.values()) {
        const { x, y } = bullet.getPosition();
        let radius = bullet.getCellCount()*0.05 + 2;
        ctx.fillStyle = bullet.getColor();
        ctx.beginPath();
        ctx.arc(x,y, radius,0,2*Math.PI);
        ctx.fill();
    }
}

module.exports = draw;
