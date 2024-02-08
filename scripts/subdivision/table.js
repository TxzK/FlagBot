#!/usr/bin/env node

import { JSDOM } from 'jsdom';
import { save } from '../shared.js';

async function download(flagSrc, subdivisionOf, section, table = 0) {
    let states = [...new JSDOM(await (await fetch(flagSrc)).text()).window.document
        .querySelectorAll('.collapsible-block')[section]
        .querySelectorAll('table')[table]
        .querySelectorAll('tr')];

    states.shift();

    for (const state of states) {
        const [flag, _, text] = state.querySelectorAll('td');
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

        await save({
            name,
            subdivisionOf,
            wiki,
            flagWiki,
            flagSrc,
            imgSrc: 'https://commons.wikimedia.org' + flag.querySelector('a').href,
        }, 'subdivision');
    }
}

await download('https://en.m.wikipedia.org/wiki/List_of_Argentine_flags', 'Argentina', 6);
await download('https://en.m.wikipedia.org/wiki/List_of_Belarusian_flags', 'Belarus', 4);
await download('https://en.m.wikipedia.org/wiki/List_of_Brazilian_flags', 'Brazil', 5);
await download('https://en.m.wikipedia.org/wiki/List_of_Chilean_flags', 'Chile', 5);
await download('https://en.m.wikipedia.org/wiki/List_of_Costa_Rican_flags', 'Costa Rica', 1);
await download('https://en.m.wikipedia.org/wiki/List_of_Croatian_flags', 'Croatia', 5);
await download('https://en.m.wikipedia.org/wiki/List_of_Ecuadorian_flags', 'Ecuador', 6);
await download('https://en.m.wikipedia.org/wiki/List_of_Hungarian_flags', 'Hungary', 0, 5);
await download('https://en.m.wikipedia.org/wiki/List_of_Kazakh_flags', 'Kazakhstan', 6, 1);
await download('https://en.m.wikipedia.org/wiki/List_of_Kazakh_flags', 'Kazakhstan', 6, 2);
await download('https://en.m.wikipedia.org/wiki/List_of_Kyrgyz_flags', 'Kyrgyzstan', 3);
await download('https://en.m.wikipedia.org/wiki/List_of_Malaysian_flags', 'Malaysia', 4);
await download('https://en.m.wikipedia.org/wiki/List_of_Papua_New_Guinean_flags', 'Papua New Guinea', 3);
await download('https://en.m.wikipedia.org/wiki/List_of_Thai_flags', 'Thailand', 8);

/*
 * The following can probably be added too with some easy modifications
 *
 * Australia
 * Belgium
 * Bosnia and Herzegovina
 * Canada
 * Colombia
 * Denmark
 * Egypt
 * Finland
 * France
 * Georgia
 * Germany
 * Greece
 * India
 * Iraq
 * Ireland
 * Israel
 * Italy
 * Morocco
 * Myanmar
 * Netherlands
 * Nigeria
 * North Macedonia
 * Pakistan
 * Palau
 * Philippines
 * Poland
 * Portugal
 * Sri Lanka
 * Sweden
 * Switzerland
 * Taiwan
 * Uzbekistan
 * Venezuela
 */
