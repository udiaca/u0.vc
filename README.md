# u0.vc

Project containing u0.vc app source code.

## Get Started

```bash
git clone git@github.com:udiaca/u0.vc.git
cd u0.vc
npm i
npm run dev
```

## Development Commands

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `npm run dev`          | Starts local dev server at `localhost:3000`        |
| `npm run build`        | Build your production site to `./dist/`            |
| `npm run preview`      | Preview your build locally, before deploying       |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro preview` |
| `npm run astro --help` | Get help using the Astro CLI                       |
| `npm run deploy`       | Manually deploy to Cloudflare Pages (skip CI)      |

# Deployment

This site will automatically deploy to [`u0.vc`](https://u0.vc) on pushes the [`main` branch](https://github.com/udiaca/u0.vc/tree/main) of [the GitHub remote](https://github.com/udiaca/u0.vc).

Alternatively, a manual deploy may be triggered by running `npm run deploy`.

We use [Cloudflare Pages](https://pages.cloudflare.com/)'s product offering to deploy to the edge network. There are currently no actively managed servers.

# License

[GNU Affero General Public License version 3 (`AGPLv3`)](https://www.gnu.org/licenses/agpl-3.0.html)

```text
u0.vc
Copyright (C) 2022  Alexander Wong

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
