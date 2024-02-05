#!/usr/bin/env node

import { create } from './shared.js';

create('subdivision');
create('unofficial');
create('former');
create('historical');

await import('./subdivision/list.js');
await import('./subdivision/brazil.js');
await import('./subdivision/japan.js');
await import('./subdivision/united_states.js');
await import('./subdivision/others.js');
