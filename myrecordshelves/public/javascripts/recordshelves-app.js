import '../sass/style.scss';

import { $, $$ } from './modules/bling';
// import covercomplete from './modules/covercomplete';

import typeAhead from './modules/typeAhead';

//TODO add cover image from LastFM API
// covercomplete( $('#artist'), $('#title') );

typeAhead( $('.search') );