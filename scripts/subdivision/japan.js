import { JSDOM } from 'jsdom';
import { save } from '../shared.js';

const flagSrc = 'https://en.wikipedia.org/wiki/Flags_of_Japanese_prefectures';

const galleries = new JSDOM(await (await fetch(flagSrc)).text()).window.document
    .querySelectorAll('.gallery');

async function download(gallery, dir) {
    const flags = galleries[gallery].querySelectorAll('.gallerybox');

    for (const flag of flags) {
        const text = flag.querySelector('.gallerytext');

        if (text.innerHTML.includes('(variant)')) continue;

        const link = text.querySelector('a');
        const name = link.innerHTML;

        await save({
            name,
            variant: /\(([^)]+)\)/.exec(text.innerHTML)?.[1],
            subdivisionOf: 'Japan',
            wiki: 'https://en.wikipedia.org' + link.href,
            flagSrc,
            imgSrc: 'https://commons.wikimedia.org' + flag.querySelector('a').href,
        }, name === 'Karafuto Prefecture' ? 'historical' : dir);
    }
}

export default async function japan() {
    await download(0, 'subdivision');
    await download(2, 'former');
}
