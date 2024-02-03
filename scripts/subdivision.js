#!/usr/bin/env node

import { create } from './shared.js';

import list from './subdivision/list.js';
import brazil from './subdivision/brazil.js';
import japan from './subdivision/japan.js';
import united_states from './subdivision/united_states.js';
import others from './subdivision/others.js';

create('subdivision');
create('unofficial');
create('former');
create('historical');

await list();
await brazil();
await japan();
await united_states();
await others();
