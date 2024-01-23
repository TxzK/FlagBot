import fs from 'fs';
import { spawnSync } from 'child_process';

import { JSDOM } from 'jsdom';

export function create(dir) {
    const path = `./flags/${dir}`;

    if (!fs.existsSync(path)) {
        console.error(`Directory ${path} doesn't exist. Creating it.`);
        fs.mkdirSync(path, { recursive: true });
    }
}

export async function save(info, dir) {
    console.error('Saving:', info);

    console.error(`Fetching ${info.imgSrc}`);
    const mediaPage = await fetch(info.imgSrc);

    const doc = new JSDOM(await mediaPage.text()).window.document;
    const links = doc.querySelectorAll('a.mw-thumbnail-link');

    let imgLink;

    if (links.length > 0) {
        imgLink = links[links.length - 1].href;
    } else {
        imgLink = doc.querySelector('.fullImageLink > a').href;
    }

    if (imgLink.startsWith('//')) imgLink = 'https:' + imgLink;

    console.error(`Downloading: ${imgLink}`);
    const imgBuffer = await (await fetch(imgLink)).arrayBuffer();

    const fileExt = /\.[A-z\d]*$/.exec(imgLink)[0].toLowerCase();

    const filename = (
        info.name
            + (info.subdivisionOf ? ` ${info.subdivisionOf}` : '')
            + (info.variant ? ` ${info.variant}` : '')
    ).normalize("NFD").replace(/\p{Diacritic}/gu, '').replaceAll(' ', '_');

    const path = `./flags/${dir}/${filename}${fileExt}`;

    if (fs.existsSync(path)) {
        console.error(`Duplicate! ${path} already exists.`);
        process.exit(1);
    }

    console.error(`Saving ${path}`);
    fs.writeFileSync(`${path}`, Buffer.from(imgBuffer));

    console.error(`Saving ${path}.json`);
    fs.writeFileSync(`${path}.json`, JSON.stringify({
        ...info,
        imgLink,
    }));

    let preview = '';
    const viu = spawnSync('viu', ['-st', path]);

    if (viu.status === 0) preview = viu.stdout.toString();

    console.error(`${preview}Done!\n`);
}
