#!/usr/bin/env node

import { save } from '../shared.js';

const flags = [
    // Bosnia and Herzegovina
    {
        name: 'Republika Srpska',
        subdivisionOf: 'Bosnia and Herzegovina',
        wiki: 'https://en.wikipedia.org/wiki/Republika_Srpska',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Republika_Srpska',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Republika_Srpska',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:Flag_of_the_Republika_Srpska.svg',
    },
    // United Kingdom
    {
        name: 'England',
        subdivisionOf: 'United Kingdom',
        wiki: 'https://en.wikipedia.org/wiki/England',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_England',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_England',
        imgSrc: 'https://en.wikipedia.org/wiki/File:Flag_of_England.svg',
    },
    {
        name: 'Scotland',
        subdivisionOf: 'United Kingdom',
        wiki: 'https://en.wikipedia.org/wiki/Scotland',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Scotland',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Scotland',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:Flag_of_Scotland.svg',
    },
    {
        name: 'Wales',
        subdivisionOf: 'United Kingdom',
        wiki: 'https://en.wikipedia.org/wiki/Wales',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Wales',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Wales',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:Flag_of_Wales.svg',
    },
];

for (const flag of flags) {
    await save(flag, 'subdivision');
}
