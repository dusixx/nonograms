import { init as initGame } from './game/game.js';
import { header } from './layout/header.js';
import { main } from './layout/main.js';

document.body.append(header.ref, main.ref);

initGame();
