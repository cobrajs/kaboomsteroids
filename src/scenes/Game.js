const BULLET_LIFE = 100;
const BULLET_SPEED = 80;
const ASTEROID_SPEED = 20;

import k from '../kaboom';

loadSprite('ship', 'ship.png');

export default function scene() {

  layers([
    'bg',
    'player',
    'obj',
    'fg',
    'ui'
  ], 'obj');

  // Player Ship
  var player = add([
    sprite('ship'),
    pos(width() / 2, height() / 2),
    rotate(0),
    origin('center'),
    layer('player'),
    mover(vec2(0, 0)),
    wraps(),
    'player'
  ])

  keyPress('space', () => {
    addBullet();
  })

  let getPlayerThrust = (angleAdd = 0) => vec2(
      -Math.sin(player.angle + angleAdd),
      -Math.cos(player.angle + angleAdd));
    
  keyDown('up', () => {
    player.dir = player.dir.add(getPlayerThrust())
  });
  keyDown('down', () => {
    player.dir = player.dir.sub(getPlayerThrust())
  });
  keyDown('left', () => player.angle += 0.1);
  keyDown('right', () => player.angle -= 0.1);

  keyPress('c', () => {
    destroyAll('asteroid');
  })

  keyPress('v', () => {
    createAsteroids();
  })

  // Bullets
  let side = 0;
  function addBullet() {
    let tempPos = player.pos;
    if (side == 0) {
      side = 1;
      tempPos = tempPos.add(getPlayerThrust(Math.PI / 2).scale(5));
    } else {
      side = 0;
      tempPos = tempPos.add(getPlayerThrust(-Math.PI / 2).scale(7));
    }
    add([
      rect(2, 2),
      color(rgba(1, 1, 1, 0.5)),
      pos(tempPos),
      rotate(player.angle),
      mover(getPlayerThrust().scale(BULLET_SPEED)),
      wraps(),
      'bullet',
      'good',
      {
        life: BULLET_LIFE
      }
    ]);
  }

  function addAsteroid(size) {
    let points = [],
        pointCount = Math.floor(Math.random() * 6) + size * 4;
    for (let i = 0, angle; i < pointCount; i++) {
      //angle = i / pointCount * Math.PI * 2;
      //points.push(vec2(Math.cos(angle), Math.sin(angle)).scale(rand(size * 6, size * 10)));
      points.push(rand(size * 6, size * 10));
    }
    // Determine a position far from the player
    let angle = rand(0, Math.PI * 2),
        ratio = width() / height(),
        distance = rand(Math.min(width(), height()) / 4, Math.min(width(), height()) / 2),
        pos = pos(player.pos.x + Math.cos(angle) * distance, player.pos.y + Math.sin(angle) * distance / ratio);
    add([
      pos(pos),
      //pos(Math.random() * width(), Math.random() * height()),
      
      rotate(0),
      //mover(vec2(Math.random(), Math.random()).scale(ASTEROID_SPEED)),
      mover(vec2(0, 0)),
      wraps(),
      'asteroid',
      {
        size: size,
        points
      }
    ])
  }

  action(() => {
    every('bullet', (bullet) => {
      bullet.life--;
      if (bullet.life <= 0) {
        destroy(bullet);
      }
      bullet.color = rgba(1, 1, 1, bullet.life / BULLET_LIFE);
    });

    every('asteroid', (asteroid) => {
      asteroid.angle += 0.01;
    });
  })

  render('asteroid', (asteroid) => {
    //points.push(vec2(Math.cos(angle), Math.sin(angle)).scale(rand(size * 6, size * 10)));
    let pointsCount = asteroid.points.length,
        points = asteroid.points.map((point, i) => {
      let angle = i / pointsCount * Math.PI * 2;
      return vec2(Math.cos(angle + asteroid.angle), Math.sin(angle + asteroid.angle)).scale(point);
    });
    drawLine(
      asteroid.pos.add(points[pointsCount - 1]),
      asteroid.pos.add(points[0]));
    for (let i = 0; i < pointsCount - 1; i++) {
      let color = points[i].len() > points[i + 1].len() ?
        rgb(0.8, 0.8, 0.8) : rgb(1, 1, 1);
      drawLine(
        asteroid.pos.add(points[i]), 
        asteroid.pos.add(points[i + 1]), {
          color
        });
    }
  });


  function createAsteroids() {
    for (let i = 100; i > 0; i--) {
      addAsteroid(1);
    }
  }

  createAsteroids();
}

function mover(dir) {
  return {
    update() {
      this.move(this.dir);
    },
    dir
  }
}

function wraps() {
  return {
    update() {
      if (this.pos.x < 0) {
        this.pos.x = width() - this.pos.x
      } else if (this.pos.x > width()) {
        this.pos.x = this.pos.x - width();
      }
      if (this.pos.y < 0) {
        this.pos.y = height() - this.pos.y
      } else if (this.pos.y > height()) {
        this.pos.y = this.pos.y - height();
      }
    }
  }
}

