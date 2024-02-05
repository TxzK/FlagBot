#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import { save } from '../shared.js';

const flagSrc = 'https://en.wikipedia.org/wiki/Flags_of_the_U.S._states_and_territories';

const flags = new JSDOM(await (await fetch(flagSrc)).text()).window.document
    .querySelectorAll('.gallery')[1].querySelectorAll('.gallerybox');

let oregon_obverse = true;

for (const flag of flags) {
    const link = flag.querySelector('.gallerytext a');
    const name = link.innerHTML.replace('Flag of ', '');

    let wiki = 'https://en.wikipedia.org/wiki/' + name.replaceAll(' ', '_');
    let variant;

    if (name === 'Oregon') {
        if (oregon_obverse) {
            variant = 'obverse';
            oregon_obverse = false;
        } else {
            variant = 'reverse';
        }
    } else if (name === 'Georgia') {
        wiki += '_(U.S._state)';
    } else if (name === 'Washington') {
        wiki += '_(state)';
    }

    await save({
        name,
        variant,
        subdivisionOf: 'United States',
        wiki,
        flagWiki: 'https://en.wikipedia.org' + link.href,
        flagSrc,
        imgSrc: 'https://commons.wikimedia.org' + flag.querySelector('a').href,
    }, 'subdivision');
}

await save({
    name: 'Washington, D.C.',
    subdivisionOf: 'United States',
    wiki: 'https://en.wikipedia.org/wiki/Washington,_D.C.',
    flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Washington,_D.C.',
    flagSrc,
    imgSrc: 'https://commons.wikimedia.org/wiki/File:Flag_of_the_District_of_Columbia.svg',
}, 'subdivision');
