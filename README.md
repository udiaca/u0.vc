# u0.vc

Project containing [`u0.vc`](https://u0.vc) app source code.

## Get Started

```bash
# clone the project repository
git clone git@github.com:udiaca/u0.vc.git
cd u0.vc

npm i
npm run build # build astro site
npm run dev # starts astro development server on port 3000

npm run build:watch # watch for changes and build astro site
npm run preview # starts cloudflare pages preview server on port 8788
```

### Local HTTPS Proxy

Use [mkcert](https://github.com/FiloSottile/mkcert)

```bash
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

Now run the local ssl development proxy script.

```bash
npm run proxy:https
# alternatively
npx local-ssl-proxy --source 8788 --target 8789 --key localhost+2-key.pem --cert localhost+2.pem
```


### Worker

To run the underlying Cloudflare Worker code, use the following command.

```bash
npm run dev:worker # starts cloudflare workers dev server on port 8787
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
| `npm run test`         | Run astro check                                    |

# Deployment

This site will automatically deploy to [`u0.vc`](https://u0.vc) on pushes the [`main` branch](https://github.com/udiaca/u0.vc/tree/main) of [the GitHub remote](https://github.com/udiaca/u0.vc).

Alternatively, a manual deploy may be triggered by running `npm run deploy`.

We use [Cloudflare Pages](https://pages.cloudflare.com/)'s product offering to deploy to the edge network. There are currently no actively managed servers.

## Deploy Worker

**To deploy the underlying Cloudflare Worker code, uncomment the `wrangler.toml` lines first!**

```
# this has to be commented out due to wrangler pages dev not supporting
# durable object bindings.
# uncomment this whenever working with Durable Objects is needed
# [durable_objects]
# bindings = [
#   { name = "DO_SESSION", class_name = "DOSession" },
#   { name = "DO_USER", class_name = "DOUser" },
# ]
```

Then run `npm run deploy:worker`.

## Static Assets Upload
https://developers.cloudflare.com/r2/examples/rclone/

```bash
rclone tree r2:u0-vc
rclone sync --progress --exclude .DS_Store r2.u0.vc r2:u0-vc
```

# License

[GNU Affero General Public License version 3 (`AGPLv3`)](https://www.gnu.org/licenses/agpl-3.0.html)

```
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
