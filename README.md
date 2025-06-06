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

Mastodon is a **free, open-source social network server** based on ActivityPub where users can follow friends and discover new ones. On Mastodon, users can publish anything they want: links, pictures, text, and video. All Mastodon servers are interoperable as a federated network (users on one server can seamlessly communicate with users from another one, including non-Mastodon software that implements ActivityPub!)

## Navigation

- [Project homepage 🐘](https://joinmastodon.org)
- [Support the development via Patreon][patreon]
- [View sponsors](https://joinmastodon.org/sponsors)
- [Blog](https://blog.joinmastodon.org)
- [Documentation](https://docs.joinmastodon.org)
- [Roadmap](https://joinmastodon.org/roadmap)
- [Official Docker image](https://github.com/mastodon/mastodon/pkgs/container/mastodon)
- [Browse Mastodon servers](https://joinmastodon.org/communities)
- [Browse Mastodon apps](https://joinmastodon.org/apps)

[patreon]: https://www.patreon.com/mastodon

## Features

<img src="/app/javascript/images/elephant_ui_working.svg?raw=true" align="right" width="30%" />

**No vendor lock-in: Fully interoperable with any conforming platform** - It doesn't have to be Mastodon; whatever implements ActivityPub is part of the social network! [Learn more](https://blog.joinmastodon.org/2018/06/why-activitypub-is-the-future/)

**Real-time, chronological timeline updates** - updates of people you're following appear in real-time in the UI via WebSockets. There's a firehose view as well!

**Media attachments like images and short videos** - upload and view images and WebM/MP4 videos attached to the updates. Videos with no audio track are treated like GIFs; normal videos loop continuously!

**Safety and moderation tools** - Mastodon includes private posts, locked accounts, phrase filtering, muting, blocking, and all sorts of other features, along with a reporting and moderation system. [Learn more](https://blog.joinmastodon.org/2018/07/cage-the-mastodon/)

**OAuth2 and a straightforward REST API** - Mastodon acts as an OAuth2 provider, so 3rd party apps can use the REST and Streaming APIs. This results in a rich app ecosystem with a lot of choices!

## Deployment

### Tech stack

- **Ruby on Rails** powers the REST API and other web pages
- **React.js** and **Redux** are used for the dynamic parts of the interface
- **Node.js** powers the streaming API

### Requirements

- **PostgreSQL** 13+
- **Redis** 6.2+
- **Ruby** 3.2+
- **Node.js** 20+

The repository includes deployment configurations for **Docker and docker-compose** as well as specific platforms like **Heroku**, and **Scalingo**. For Helm charts, reference the [mastodon/chart repository](https://github.com/mastodon/chart). The [**standalone** installation guide](https://docs.joinmastodon.org/admin/install/) is available in the documentation.

## Contributing

Mastodon is **free, open-source software** licensed under **AGPLv3**.

You can open issues for bugs you've found or features you think are missing. You
can also submit pull requests to this repository or translations via Crowdin. To
get started, look at the [CONTRIBUTING] and [DEVELOPMENT] guides. For changes
accepted into Mastodon, you can request to be paid through our [OpenCollective].

**IRC channel**: #mastodon on [`irc.libera.chat`](https://libera.chat)

## License

Copyright (c) 2016-2025 Eugen Rochko (+ [`mastodon authors`](AUTHORS.md))

Licensed under GNU Affero General Public License as stated in the [LICENSE](LICENSE):

```
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

[CONTRIBUTING]: CONTRIBUTING.md
[DEVELOPMENT]: docs/DEVELOPMENT.md
[OpenCollective]: https://opencollective.com/mastodon
