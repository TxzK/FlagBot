#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import { create, save } from './shared.js';

create('micronation');
create('historical');

const flagSrc = 'https://en.wikipedia.org/wiki/Flags_of_micronations';

const flags = new JSDOM(await (await fetch(flagSrc)).text()).window.document
    .querySelectorAll('.gallerybox');

let historical = false;

for (const flag of flags) {
    const link = flag.querySelector('.gallerytext a');

    const name = link.innerHTML;

    let imgSrc = 'https://'
        + (name === 'Other World Kingdom' ? 'en.wikipedia' : 'commons.wikimedia')
        + '.org' + flag.querySelector('a').href;

    await save({
        name,
        micronation: true,
        wiki: 'https://en.wikipedia.org' + link.href,
        flagSrc,
        imgSrc,
    }, historical ? 'historical' : 'micronation',);

    if (name === 'Zaqistan') historical = true;
}
