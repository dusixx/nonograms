import { Game } from '../components/game/game.js';
import { header, main } from '../components/ui/index.js';
import { showHintOnce } from './app.utils.js';

document.body.append(header.ref, main.ref);

showHintOnce();

new Game();
