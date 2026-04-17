import { Game } from '../game/game.js';
import { header, main } from '../layout/index.js';
import { showHintOnce } from './app.utils.js';

document.body.append(header.ref, main.ref);

showHintOnce();

new Game();
