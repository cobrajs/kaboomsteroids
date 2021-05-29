import k from './kaboom';
import Game from './scenes/Game';

/*
k.scene('main', () => {
  k.add([
    k.text('Hello', 16),
    k.pos(k.width() / 2, k.height() / 2),
    k.origin('center'),
  ]);
});
*/

scene('Game', Game);

k.start('Game');
