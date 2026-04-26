import { Game } from '@components';
import { header, main } from '@components/ui/index.js';

document.body.append(header.ref, main.ref);

new Game();
