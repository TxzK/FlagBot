#!/usr/bin/env node

import { create, save } from './shared.js';

create('proposed');

const flags = [
    // various flag of earth proposals
    {
        name: 'Earth',
        variant: 'Citizen of the World Flag by George Dibbern, 1937',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Earth#Citizen_of_the_World_Flag_(1937)',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Earth',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:Citizen_of_the_World_Flag.svg',
    },
    {
        name: 'Earth',
        variant: 'Earth Flag by John McConnell, 1973',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Earth#Earth_Flag_(1969)',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Earth',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:Earth_Day_Flag.png',
    },
    {
        name: 'Earth',
        variant: 'Earth Flag by John McConnell, 1969',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Earth#Earth_Flag_(1969)',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Earth',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:John_McConnell%27s_Flag_of_Earth_1970.svg',
    },
    {
        name: 'Earth',
        variant: 'Flag of Earth by James W. Cadle, 1970',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Earth#Flag_of_Earth_(1970)',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Earth',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:Flag_of_Earth.svg',
    },
    {
        name: 'Earth',
        variant: 'World Flag by Paul Carroll, 1988',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Earth#The_World_Flag_(1988)',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Earth',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:Proposal_Flag_of_the_World_(1988).svg',
    },
    {
        name: 'Earth',
        variant: 'World Flag by Paul Carroll, 2006',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Earth#The_World_Flag_(1988)',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Earth',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:The_world_flag_2006.svg',
    },
    {
        name: 'Earth',
        variant: 'International Flag of Planet Earth by Oskar Pernefeldt, 2015',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Earth#International_Flag_of_Planet_Earth_(2015)',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Earth',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:International_Flag_of_Planet_Earth.svg',
    },
    {
        name: 'Earth',
        variant: 'World Peace Flag of Earth by James William van Kirk, 1913',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Earth#World_Peace_Flag_of_Earth_(1913)',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Earth',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:Peace_Congress_flag.svg',
    },
    {
        name: 'Earth',
        variant: 'Brotherhood Flag, 1938',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Earth#The_Brotherhood_Flag_(1938)',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Earth',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:Brotherhood_Flag.svg',
    },
    {
        name: 'Earth',
        variant: 'Blue Dot Flag by Tijs Bonekamp, 2019',
        flagWiki: 'https://en.wikipedia.org/wiki/Flag_of_Earth#Blue_Dot_Flag_(2019)',
        flagSrc: 'https://en.wikipedia.org/wiki/Flag_of_Earth',
        imgSrc: 'https://commons.wikimedia.org/wiki/File:BandeiraBlueDot.svg',
    },
    // Laser Kiwi flag, best flag in the world lol
    {
        name: 'New Zealand',
        variant: 'Fire the Laser by Lucy Gray, 2015',
        wiki: 'https://en.wikipedia.org/wiki/New_Zealand',
        flagWiki: 'https://en.wikipedia.org/wiki/Laser_Kiwi_flag',
        flagSrc: 'https://en.wikipedia.org/wiki/Laser_Kiwi_flag',
        imgSrc: 'https://en.wikipedia.org/wiki/File:Fire_the_Lazer.svg',
    },
];

for (const flag of flags) {
    await save(flag, 'proposed');
}
