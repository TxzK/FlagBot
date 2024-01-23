#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import { create, save } from './shared.js';

create('dependency');
create('unofficial');

const flagSrc = 'https://en.m.wikipedia.org/wiki/Gallery_of_flags_of_dependent_territories';

const doc = new JSDOM(await (await fetch(flagSrc)).text()).window.document;
const countries = [...doc.querySelectorAll('.collapsible-block')];

countries.pop();

// Guadeloupe has two variants, a red one and a black one
let guadeloupe_red = true;

for (const [i, country] of countries.entries()) {
    const dependencyOf = doc
        .querySelectorAll('.section-heading a:not(.cdx-button)')[i].innerHTML;

    const flags = country.querySelectorAll('li');

    for (const flag of flags) {
        const text = flag.querySelector('.gallerytext');
        const links = text.querySelectorAll('a');

        let name;
        let wiki = 'https://en.wikipedia.org';
        let flagWiki;

        if (links.length === 1) {
            name = links[0].innerHTML;
            wiki += links[0].href;
        } else {
            name = links[1].innerHTML;
            wiki += links[1].href;
            flagWiki = 'https://en.wikipedia.org' + links[0].href;
        }

        const info = {
            name,
            dependencyOf,
            wiki,
            flagWiki,
            flagSrc,
            imgSrc: 'https://commons.wikimedia.org' + flag.querySelector('a').href,
        };

        const note = /\(.*\)/.exec(text.innerHTML)?.[0];

        if (note) {
            if (note.includes('unofficial') || note.includes('semi-official')) {

                if (name === 'Guadeloupe') {
                    if (guadeloupe_red) {
                        info.variant = 'red variant';
                        guadeloupe_red = false;
                    } else {
                        info.variant = 'black variant';
                    }
                }

                await save(info, 'unofficial');
            } else {
                await save(info, 'dependency');
            }
        } else {
            await save(info, 'dependency');
        }
    }
}
