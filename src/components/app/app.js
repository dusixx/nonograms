import { Game } from '../game/game.js';
import { header, main } from '../ui/index.js';
import { showHintOnce } from './app.utils.js';

document.body.append(header.ref, main.ref);

showHintOnce();

new Game();
