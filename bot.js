#!/usr/bin/env node

import 'dotenv/config';

import { readdirSync, readFileSync } from 'fs';
import { createServer } from 'http';
import { spawnSync } from 'child_process';

import { JSDOM } from 'jsdom';
import { createRestAPIClient } from 'masto';
import { CronJob } from 'cron';

// configs
const MASTODON_URL = process.env.FLAGBOT_MASTODON_URL;
const MASTODON_TOKEN = process.env.FLAGBOT_MASTODON_TOKEN;

const ACCOUNT_URL = process.env.FLAGBOT_ACCOUNT_URL;
const WEBSITE_URL = process.env.FLAGBOT_WEBSITE_URL;
const OWNER_ACCOUNT = process.env.FLAGBOT_OWNER_ACCOUNT;
const SOURCE_CODE = process.env.FLAGBOT_SOURCE_CODE;

const SERVER = process.env.FLAGBOT_SERVER
const POST = process.env.FLAGBOT_POST;
const POST_VISIBILITY = process.env.FLAGBOT_POST_VISIBILITY || 'private';

const STATUS_INTERVAL = process.env.FLAGBOT_STATUS_INTERVAL || '0 */15 * * * *';
const DISPLAY_NAME_INTERVAL = process.env.FLAGBOT_DISPLAY_NAME_INTERVAL || '0 */5 * * * *';

const PORT = process.env.PORT || 3000;

const log = (msg, color) => console.error(`[${
    new Date().toString().replace(/^\w+ /, '').replace(/[0-9]{4} /, '').replace(/ \(.*\)$/, '')
}] \x1b[3${color}m${msg}\x1b[0m`);

const randChoose = arr => arr[Math.floor(Math.random() * arr.length)];

function genFlagTitle(type, details) {
    let title = '';
    let f = 'F';

    switch (type) {
        case 'former':
        case 'proposed':
        case 'unofficial':
            title += `${type.substring(0, 1).toUpperCase()}${type.substring(1)} `;
            f = 'f';
    }

    title += `${f}lag of ${details.name}`;

    let former = '';

    if (type === 'historical') former = ' former';

    if (details.dependencyOf) {
        title += `, a${former} dependent territory of ${details.dependencyOf}`;
    } else if (details.subdivisionOf) {
        if (former) {
            title += `, a former subdivision of ${details.subdivisionOf}`;
        } else {
            title += `, ${details.subdivisionOf}`;
        }
    } else if (details.micronation) {
        title += `, a${former} micronation`;
    } else if (former) {
        title += ', a former sovereign state'
    }

    if (details.variant) title += ` (${details.variant})`;

    return title + '.';
}

async function postStatus(masto, flags) {
    const [type, flag] = randChoose(flags).split('/');
    const path = `./flags/${type}/${flag}`;
    const details = JSON.parse(readFileSync(`${path}.json`));

    const title = genFlagTitle(type, details);
    let statusStr = title + '\n\n';

    if (details.wiki) statusStr += `More about ${details.name}: ${details.wiki}\n`;
    if (details.flagWiki) statusStr += `More about the flag: ${details.flagWiki}\n`;

    statusStr += `Image from ${details.imgSrc}\n\n`;
    statusStr += '#vexillology #flags #flag #bot';

    // img preview
    let preview = '';
    const viu = spawnSync('viu', ['-st', path]);

    if (viu.status === 0) preview = viu.stdout.toString();

    log(`Posting`, 4);
    console.error(`${preview}${statusStr}`);

    if (POST === '1') {
        try {
            const attachment = await masto.v2.media.create({
                file: new Blob([readFileSync(path)]),
                description: title,
            });

            const status = await masto.v1.statuses.create({
                status: statusStr,
                mediaIds: [attachment.id],
                language: 'en',
                visibility: POST_VISIBILITY,
            });

            log(`Successfully posted! ${status.url} (${POST_VISIBILITY})`, 2);
        } catch (e) {
            log(`Error! ${e.message}`, 1);
        }
    } else {
        log(`Didn't post as FLAGBOT_POST is not set to 1`, 3);
    }
}

async function updateDisplayName(masto, emojis) {
    const [emoji_1, emoji_2] = [randChoose(emojis), randChoose(emojis)];
    const displayName = `${emoji_1} FlagBot ${emoji_2}`;

    log(`Changing display name to ${displayName}`, 4);
    if (POST === '1') {
        try {
            await masto.v1.accounts.updateCredentials({ displayName });
            log(`Successfully changed!`, 2);
        } catch (e) {
            log(`Error! ${e.message}`, 1);
        }
    } else {
        log(`Didn't change as FLAGBOT_POST is not set to 1`, 3);
    }
}

// generating the page consisting of a list of all flags
async function genPage(flags) {
    const getSiteTitle = async url => new JSDOM(await (await fetch(url)).text())
        .window.document.title;

    const sortedFlags = flags.sort((a, b) => {
        const flag_a = a.split('/')[1];
        const flag_b = b.split('/')[1];

        return flag_a.localeCompare(flag_b);
    });

    let page = `
<!DOCTYPE html>

<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@next/css/pico.min.css">
        <style>
            header:not(article > header) {
                padding: 0 var(--pico-spacing) !important;
                border-bottom: var(--pico-border-width) solid var(--pico-secondary-border);
            }

            svg { height: 1.5em }
            div[role=group] { width: 100% }
            .list, details { padding: 0; margin: 0 }
            .list > li { list-style: none; margin: 0; padding: var(--pico-spacing) 0 }
            .list > li:not(:last-of-type) { border-bottom: var(--pico-border-width) solid var(--pico-secondary-border) }
        </style>
        <title>FlagBot - All Flags</title>
    </head>

    <body>
        <header>
            <nav>
                <ul><li><strong>FlagBot</strong></li></ul>

                <!-- Icons adapted from tabler icons: https://tabler.io/icons -->
                <ul>`;

    if (ACCOUNT_URL) {
        page += `
                    <li><a rel="me" href="${ACCOUNT_URL}" title="Mastodon Account" aria-label="Mastodon Account">
                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M18.6 15.3C16.8 17 12 16.9 12 16.9a18.3 18.3 0 0 1-3.3-.3c1.1 2 4.1 2.8 9 2.5-2 2-13.6 5.3-13.7-7.6v-1.2c0-3 0-4.1 1.4-5.6C7 2.7 12 3 12 3s5-.2 6.6 1.7C20 6.2 20 7.3 20 10.3s-.5 4-1.4 5z"/><path d="M12 11.2v-3C12 7 11.1 6 10 6S8 7 8 8.3V13m4-4.7C12 7 12.9 6 14 6s2 1 2 2.3V13"/></svg>
                    </a></li>`;
    }

    if (SOURCE_CODE) {
        page += `
                    <li><a href="${SOURCE_CODE}" title="Source Code" aria-label="Source Code">
                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="m7 8-4 4 4 4M17 8l4 4-4 4M14 4l-4 16"/></svg>
                    </a></li>`;
    }

    page += `
                    <li><button class="secondary" title="Sources" aria-label="Sources" onclick="document.querySelector('dialog').showModal()">
                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M12 9h0"/><path d="M11 12h1v4h1"/></svg>
                    </button></li>
                </ul>
            </nav>
        </header>

        <main class="container">
            <hgroup>
                <h1>All Flags</h1>
                <p>Currently it has ${flags.length} flags.</p>
            </hgroup>

            <hr>

            <div role="group">
                <button class="outline" onclick="document.querySelectorAll('details').forEach(e => e.open = true)">
                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M14 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="M2 12a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6z"/></svg>
                    Expand All
                </button>
                <button class="outline" onclick="document.querySelectorAll('details').forEach(e => e.open = false)">
                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="M6 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="M2 12a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6z"/></svg>
                    Collapse All
                </button>
            </div>

            <br>

            <ul class="list">`;

    const sourceUrls = new Set();

    for (const flag of sortedFlags) {
        const type = flag.split('/')[0];
        const details = JSON.parse(readFileSync(`./flags/${flag}.json`));

        sourceUrls.add(details.flagSrc);

        let name = details.name;

        name += (details.dependencyOf || details.subdivisionOf)
            ? ', ' + (details.dependencyOf || details.subdivisionOf) : '';

        name += details.micronation ? ' (micronation)' : '';

        switch (type) {
            case 'former':
            case 'historical':
            case 'proposed':
            case 'unofficial':
                name += ` (${type})`;
        }

        if (details.variant) name += ` (${details.variant})`;

        page += `
                <li>
                    <details>
                        <summary>${name}</summary>

                        <figure>
                            <img src="${details.imgLink}" loading="lazy" alt="Flag of ${details.name}">
                            <figcaption>${genFlagTitle(type, details)}</figcaption>

                            <ul>`;

        if (details.wiki) page += `
                                <li><a href="${details.wiki}" target="_blank">Wikipedia article</a></li>`;

        if (details.flagWiki) page += `
                                <li><a href="${details.flagWiki}" target="_blank">Wikipedia article for the flag</a></li>`;

        page += `
                                <li><a href="${details.imgSrc}" target="_blank">Image source</a></li>
                            </ul>
                        </figure>
                    </details>
                </li>`
    }

    page += `
            </ul>
        </main>

        <dialog aria-labelledby="label" aria-describedby="desc">
            <article>
                <header>
                    <a href="#" aria-label="Close" rel="prev" onclick="document.querySelector('dialog').close()"></a>
                    <h2 id="label">Sources</h2>
                </header>

                <div id="desc">
                    <p>All flags are obtained from one of the following pages:</p>

                    <ul>`;

    for (const url of sourceUrls) {
        const title = await getSiteTitle(url);

        page += `
                        <li><a href="${url}" target="_blank">${title}</a></li>`;
    }

    page += `
                    </ul>
                </div>
            </article>
        </dialog>
    </body>
</html>`;

    return page;
}

try {
    const masto = createRestAPIClient({
        url: MASTODON_URL,
        accessToken: MASTODON_TOKEN,
    });

    // getting all the flags
    const types = readdirSync('./flags');
    const flags = [];

    for (const type of types) {
        flags.push(...readdirSync(`./flags/${type}`)
            .filter(flag => flag.endsWith('.json'))
            .map(flag => `${type}/${flag.replace(/\.json$/, '')}`));
    }

    // getting the emojis
    const emojis = JSON.parse(readFileSync('./flag_emojis.json').toString());

    log(`Imported ${flags.length} flags`, 4);

    // Updating fields
    const fieldsAttributes = [];

    if (OWNER_ACCOUNT) fieldsAttributes.push({
        name: 'Owner',
        value: OWNER_ACCOUNT,
    });

    fieldsAttributes.push({
        name: 'Flags',
        value: `${flags.length}`,
    });

    if (WEBSITE_URL) fieldsAttributes.push({
        name: 'All Flags',
        value: WEBSITE_URL,
    });

    if (SOURCE_CODE) fieldsAttributes.push({
        name: 'Source Code',
        value: SOURCE_CODE,
    });

    log(`Updating profile fields attributes`, 4);
    if (POST === '1') {
        await masto.v1.accounts.updateCredentials({ fieldsAttributes });
    } else {
        log(`Didn't update as FLAGBOT_POST is not set to 1`, 3);
    }

    let server;

    // Creating server
    if (SERVER === '1') {
        log('Generating webpage for the server', 4);
        const page = await genPage(flags);

        server = createServer((req, res) => {
            let body;
            let type;

            if (req.url === '/ping') {
                body = `THIS PAGE IS FOR PINGING`;
                type = 'text/plain';
            } else {
                body = page;
                type = 'text/HTML';
            }

            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(body),
                'Content-Type': type,
            }).end(body);
        });

        server.listen(PORT, () => {
            log(`Server started at port ${PORT}`, 2);
        });
    } else {
        log(`Didn't start the server as FLAGBOT_SERVER is not set to 1`, 3);
    }

    const job_1 = new CronJob(STATUS_INTERVAL, () => postStatus(masto, flags), null, true);
    const job_2 = new CronJob(DISPLAY_NAME_INTERVAL, () => updateDisplayName(masto, emojis), null, true);
    log('Bot started', 2);

    const exit = () => {
        log("Exiting", 3);
        job_1.stop();
        job_2.stop();

        if (server) server.close();
    }

    process.on("SIGINT", exit);
    process.on("SIGTERM", exit);
} catch (e) {
    log(`Couldn't start! ${e.message}`, 1);
    process.exit(1);
}
