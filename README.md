# FlagBot

A mastodon bot for posting random flags. All flags are obtained from various
Wikipedia pages, using scripts stored in the [`scripts`](./scripts) dir. To run
all scripts, run [`./pull_flags.sh`](./pull_flags.sh). To run the actual bot, run
[`./bot.js`](./bot.js), but first you'll need to configure some things using a
`.env` file. Here's an example with all options.

```env
# URL of your mastodon server
FLAGBOT_MASTODON_URL=https://mastodon.social/
# To obtain one, log into your server, then go to Settings > Development
FLAGBOT_MASTODON_TOKEN=<your access token>

# All 4 of these are optional
FLAGBOT_ACCOUNT_URL=https://mastodon.social/@flagbot
FLAGBOT_WEBSITE_URL=https://flagbot.onrender.com/
FLAGBOT_OWNER_ACCOUNT=@TxzK@mastodon.social
FLAGBOT_SOURCE_CODE=https://github.com/TxzK/FlagBot

# Wether to run the server or not
FLAGBOT_SERVER=1
# Wether to post anything or not
FLAGBOT_POST=1
# Can be either public, unlisted, private, or direct. Default private
FLAGBOT_POST_VISIBILITY=public

# Intervals for posting and changing the display name
# Cron expressions, showing default values
FLAGBOT_STATUS_INTERVAL=0 */15 * * * *
FLAGBOT_DISPLAY_NAME_INTERVAL=0 */5 * * * *

# Port for the server. Default 3000
PORT=3000
```

And before you can do any of this, you'll of course need to install the dependencies
using `pnpm i`. Also if you have [viu](https://github.com/atanunq/viu) installed,
you'll be able to see a preview of the flag being posted right in the console.

And also, the code is really messy. It lacks some error handling, often takes
bad shortcuts and barely has any comments. Sorry.

## Server

If you are using a free hosting service to run the bot, (I am using
[render.com](https://render.com/)) you may need to expose a server. You may also
need to use a pinging service (I recommend [cron-job.org](https://cron-job.org/))
to keep the service running. But the default page with the list of all flags is
too large for it to handle. So there's a '/ping' page just for pinging.

## Flags

All flags are saved inside [`flags`](./flags) dir. Flags are saved inside
following subdirs:

- [`national`](./flags/national)
    For national flags
- [`dependency`](./flags/dependency)
    For the flags of dependent territories.
- [`subdivision`](./flags/subdivision)
    For the flags of country subdivisions.
- [`micronation`](./flags/micronation)
    For the flags of micronations.
- [`unofficial`](./flags/unofficial)
    For various unofficial, but widely used flags.
- [`proposed`](./flags/proposed)
    Proposed flags.
- [`former`](./flags/former)
    Former flag of entities that still exists.
- [`historical`](./flags/historical)
    Flag of entities that no longer exists.

With each image file, a JSON file with the same name is also generated. It
contains following fields.

- `name`
    Name of the entity the flag belongs to.
- `variant`
    It's also used for former flags to denote the timeline of use or for
    proposed flags to include more information.
- `wiki`
    Wikipedia page for that entity. Optional.
- `flagWiki`
    Wikipedia page for the flag itself. Optional.
- `flagSrc`
    Source for the flag, most likely a Wikipedia page. Only used in the webpage.
- `imgSrc`
    Link for where the image is from. Most often a Wikimedia Commons page.
- `imgLink`
    Link to the actual image file. Only used in the webpage.
- `dependencyOf`
    For if the flag belongs to a dependent territory of some country.
- `subdivisionOf`
    For if the flag belongs to a subdivision of some country.
- `micronation`
    Set to `true` for the micronations.

## License

All code is licensed under CC0, meaning they're essentially under the public
domain. Generated JSON files are also under the same license. The flags are from
Wikipedia or Wikimedia Commons and are published under various different licenses.
Visit the links for each individual flag to learn more.
