#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import { create, save } from './shared.js';

create('national');

const flagSrc = 'https://en.wikipedia.org/wiki/Gallery_of_sovereign_state_flags';

const flags = new JSDOM(await (await fetch(flagSrc)).text()).window.document
    .querySelectorAll('.gallerybox');

for (const flag of flags) {
    const link = flag.querySelector('.gallerytext > a');
    const name = link.innerHTML.replace(/^Flag of (the )?/, '').trim();

    await save({
        name,
        wiki: 'https://en.wikipedia.org/wiki/' + name.replaceAll(' ', '_'),
        flagWiki: 'https://en.wikipedia.org' + link.href,
        flagSrc,
        imgSrc: 'https://commons.wikimedia.org' + flag.querySelector('a').href,
    }, 'national');
}
