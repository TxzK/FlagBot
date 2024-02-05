#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import { save } from '../shared.js';

const flagSrc = 'https://en.m.wikipedia.org/wiki/List_of_country_subdivision_flags';

const doc = new JSDOM(await (await fetch(flagSrc)).text()).window.document;
const countries = [...doc.querySelectorAll('.collapsible-block')];

countries.pop();
countries.pop();
countries.pop();

// Vojvodina has two flags
let vojvodina_traditional = false;

for (const [i, country] of countries.entries()) {
    let subdivisionOf = doc
        .querySelectorAll('.section-heading .mw-headline')[i]?.innerHTML;

    // Duplicates
    if (subdivisionOf === 'Denmark') continue;

    else if (subdivisionOf === 'Flags of Moroccan provinces claimed by Western Sahara') {
        subdivisionOf = 'Morocco';
    }

    const flags = country.querySelectorAll('li');

    if (flags.length === 0) {
        console.log(`No flags found inside ${subdivisionOf}`);
        continue;
    }

    for (const flag of flags) {
        const text = flag.querySelector('.gallerytext');
        const link = text.querySelector('a');
        const name = link.innerHTML;

        let flagWiki;

        if (text.innerHTML.includes('details')) {
            flagWiki = 'https://en.wikipedia.org'
                + text.querySelectorAll('a')[1]?.href;
        }

        let imgSrc = 'https://'
            + (name === 'Torba' ? 'en.wikipedia' : 'commons.wikimedia')
            + '.org' + flag.querySelector('a').href;

        let dir = 'subdivision';
        const year = /\(((\d{4}|\?)[\d\-, ]*)\)/.exec(text.innerHTML)?.[1];
        let variant;

        if (
            subdivisionOf === 'Cuba' ||
                (subdivisionOf === 'Bahrain' && name === 'Central') ||
                (subdivisionOf === 'Moldova' && name.endsWith('County')) ||
                (subdivisionOf === 'Sudan' && (name === 'Shilluk' || name === 'Kordofan'))
        ) {
            dir = 'historical';
        } else if (
            subdivisionOf === 'Morocco' ||
                subdivisionOf === 'Fiji' ||
                ((subdivisionOf === 'Uganda' || subdivisionOf === 'El Salvador') && year)
        ) {
            dir = 'former';
        } else if (name === 'Atlántida' || name === 'Ebon Atoll') {
            dir = 'unofficial';
        } else if (name === 'Vojvodina') {
            if (vojvodina_traditional) variant = 'traditional';
            else vojvodina_traditional = true;
        }

        if (dir === 'historical' || dir === 'former') variant = year;

        await save({
            name,
            variant,
            subdivisionOf,
            wiki: 'https://en.wikipedia.org' + link.href,
            flagWiki,
            flagSrc,
            imgSrc,
        }, dir);
    }
}
