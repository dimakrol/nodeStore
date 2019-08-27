import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocoplete from './modules/autocomplete';

autocoplete($('#address'), $('#lat'), $('#lng'));
