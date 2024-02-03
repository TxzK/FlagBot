import { JSDOM } from 'jsdom';
import { save } from '../shared.js';

const flagSrc = 'https://en.m.wikipedia.org/wiki/List_of_Brazilian_flags';

let states = [...new JSDOM(await (await fetch(flagSrc)).text()).window.document
    .querySelectorAll('.collapsible-block')[5].querySelectorAll('tr')];

states.shift();

export default async function brazil() {
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
            subdivisionOf: 'Brazil',
            wiki,
            flagWiki,
            flagSrc,
            imgSrc: 'https://commons.wikimedia.org' + flag.querySelector('a').href,
        }, 'subdivision');
    }
}
