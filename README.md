# Mastodon on uestc.social

This is a fork of [Mastodon](https://joinmastodon.org), with [Chuckya](TheEssem/mastodon) as its upstream. Chuckya's original README is reproduced below.

---

# <img src="https://github.com/uestc-social/mastodon/raw/main/public/chuckya.svg" width="128"> Chuckya

Chuckya is a close-to-upstream soft fork of Mastodon Glitch Edition (more commonly known as glitch-soc) that aims to introduce more experimental features/fixes with the goal of making the overall experience more enjoyable. Although it's mainly developed for and used on the [wetdry.world](https://wetdry.world) instance, it can be deployed by any server admin as a drop-in, backwards-compatible replacement for Mastodon.

Here are some of the changes compared to glitch-soc:

- Emoji reactions (glitch-soc/mastodon#2462)
- Bubble timeline
- Tenor GIF picker (originally from [koyu.space](https://github.com/koyuspace/mastodon), rewritten for Chuckya)
- Mastodon Modern theme (licensed under CC-BY-SA 4.0, [original repo](https://git.gay/freeplay/Mastodon-Modern))
- Configurable media attachment limits
- Polls can be posted alongside media (glitch-soc/mastodon#2524)
- Polls can have only one option
- Restores status trend half-life to 2 hours
- Allows dashes in custom emote names
- Emojis can be put side-by-side
- Minor media attachment tweaks

Changes previously in Chuckya that made their way into vanilla Mastodon:

- Unicode emojis use [`jdecked/twemoji`](https://github.com/jdecked/twemoji) v15 graphics (mastodon/mastodon#28404)

Setup instructions are the same as [glitch-soc's](https://glitch-soc.github.io/docs); just replace the glitch-soc repo URL with `https://github.com/uestc-social/mastodon`.

Original glitch-soc readme is below.

# Mastodon Glitch Edition

[![Ruby Testing](https://github.com/glitch-soc/mastodon/actions/workflows/test-ruby.yml/badge.svg)](https://github.com/glitch-soc/mastodon/actions/workflows/test-ruby.yml)
[![Crowdin](https://badges.crowdin.net/glitch-soc/localized.svg)][glitch-crowdin]

[glitch-crowdin]: https://crowdin.com/project/glitch-soc

So here's the deal: we all work on this code, and anyone who uses that does so absolutely at their own risk. can you dig it?

- You can view documentation for this project at [glitch-soc.github.io/docs/](https://glitch-soc.github.io/docs/).
- And contributing guidelines are available [here](CONTRIBUTING.md) and [here](https://glitch-soc.github.io/docs/contributing/).

Mastodon Glitch Edition is a fork of [Mastodon](https://github.com/mastodon/mastodon). Upstream's README file is reproduced below.

---

> [!NOTE]
> Want to learn more about Mastodon?
> Click below to find out more in a video.

<p align="center">
  <a style="text-decoration:none" href="https://www.youtube.com/watch?v=IPSbNdBmWKE">
    <img alt="Mastodon hero image" src="https://github.com/user-attachments/assets/ef53f5e9-c0d8-484d-9f53-00efdebb92c3" />
  </a>
</p>

<p align="center">
  <a style="text-decoration:none" href="https://github.com/mastodon/mastodon/releases">
    <img src="https://img.shields.io/github/release/mastodon/mastodon.svg" alt="Release" /></a>
  <a style="text-decoration:none" href="https://github.com/mastodon/mastodon/actions/workflows/test-ruby.yml">
    <img src="https://github.com/mastodon/mastodon/actions/workflows/test-ruby.yml/badge.svg" alt="Ruby Testing" /></a>
  <a style="text-decoration:none" href="https://crowdin.com/project/mastodon">
    <img src="https://d322cqt584bo4o.cloudfront.net/mastodon/localized.svg" alt="Crowdin" /></a>
</p>

Mastodon is a **free, open-source social network server** based on [ActivityPub](https://www.w3.org/TR/activitypub/) where users can follow friends and discover new ones. On Mastodon, users can publish anything they want: links, pictures, text, and video. All Mastodon servers are interoperable as a federated network (users on one server can seamlessly communicate with users from another one, including non-Mastodon software that implements ActivityPub!)

## Navigation

- [Project homepage 🐘](https://joinmastodon.org)
- [Donate to support development 🎁](https://joinmastodon.org/sponsors#donate)
  - [View sponsors](https://joinmastodon.org/sponsors)
- [Blog 📰](https://blog.joinmastodon.org)
- [Documentation 📚](https://docs.joinmastodon.org)
- [Official container image 🚢](https://github.com/mastodon/mastodon/pkgs/container/mastodon)

## Features

<img src="./app/javascript/images/elephant_ui_working.svg?raw=true" align="right" width="30%" />

**Part of the Fediverse. Based on open standards, with no vendor lock-in.** - the network goes beyond just Mastodon; anything that implements ActivityPub is part of a broader social network known as [the Fediverse](https://jointhefediverse.net/). You can follow and interact with users on other servers (including those running different software), and they can follow you back.

**Real-time, chronological timeline updates** - updates of people you're following appear in real-time in the UI.

**Media attachments** - upload and view images and videos attached to the updates. Videos with no audio track are treated like animated GIFs; normal videos loop continuously.

**Safety and moderation tools** - Mastodon includes private posts, locked accounts, phrase filtering, muting, blocking, and many other features, along with a reporting and moderation system.

**OAuth2 and a straightforward REST API** - Mastodon acts as an OAuth2 provider, and third party apps can use the REST and Streaming APIs. This results in a [rich app ecosystem](https://joinmastodon.org/apps) with a variety of choices!

## Deployment

### Tech stack

- [Ruby on Rails](https://github.com/rails/rails) powers the REST API and other web pages.
- [PostgreSQL](https://www.postgresql.org/) is the main database.
- [Redis](https://redis.io/) and [Sidekiq](https://sidekiq.org/) are used for caching and queueing.
- [Node.js](https://nodejs.org/) powers the streaming API.
- [React.js](https://reactjs.org/) and [Redux](https://redux.js.org/) are used for the dynamic parts of the interface.
- [BrowserStack](https://www.browserstack.com/) supports testing on real devices and browsers. (This project is tested with BrowserStack)
- [Chromatic](https://www.chromatic.com/) provides visual regression testing. (This project is tested with Chromatic)

### Requirements

- **Ruby** 3.2+
- **PostgreSQL** 13+
- **Redis** 7.0+
- **Node.js** 20+

This repository includes deployment configurations for **Docker and docker-compose**, as well as for other environments like Heroku and Scalingo. For Helm charts, reference the [mastodon/chart repository](https://github.com/mastodon/chart). A [**standalone** installation guide](https://docs.joinmastodon.org/admin/install/) is available in the main documentation.

## Contributing

Mastodon is **free, open-source software** licensed under **AGPLv3**. We welcome contributions and help from anyone who wants to improve the project.

You should read the overall [CONTRIBUTING](https://github.com/mastodon/.github/blob/main/CONTRIBUTING.md) guide, which covers our development processes.

You should also read and understand the [CODE OF CONDUCT](https://github.com/mastodon/.github/blob/main/CODE_OF_CONDUCT.md) that enables us to maintain a welcoming and inclusive community. Collaboration begins with mutual respect and understanding.

You can learn about setting up a development environment in the [DEVELOPMENT](docs/DEVELOPMENT.md) documentation.

If you would like to help with translations 🌐 you can do so on [Crowdin](https://crowdin.com/project/mastodon).

## LICENSE

Copyright (c) 2016-2025 Eugen Rochko (+ [`mastodon authors`](AUTHORS.md))

Licensed under GNU Affero General Public License as stated in the [LICENSE](LICENSE):

```text
Copyright (c) 2016-2025 Eugen Rochko & other Mastodon contributors

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see https://www.gnu.org/licenses/
```
