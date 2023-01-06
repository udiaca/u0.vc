---
layout: ../../../layouts/MarkdownLayout.astro
title: "Synology server related notes"
---


# Deluge & Docker

Get SSH access to the server.
Gain sudo.

`sudo su`

`cd /volume1/Media`

`cat startDeluge.sh`

```bash
#!/bin/bash

docker run -d \
  --name=deluge \
  -p 8112:8112 \
  -p 6881:6881 \
  -p 6881:6881/udp \
  -e PUID=1026 \
  -e PGID=101 \
  -e TZ=America/Edmonton \
  -e DELUGE_LOGLEVEL=error \
  -v /volume1/Media/Deluge:/config \
  -v /volume1/Media/Downloads:/downloads \
  --restart always \
  lscr.io/linuxserver/deluge:latest
```

`docker ps`

```
CONTAINER ID   IMAGE                               COMMAND   CREATED       STATUS       PORTS                                                                                                     NAMES
b31ac9bd2e06   lscr.io/linuxserver/deluge:latest   "/init"   6 weeks ago   Up 5 weeks   0.0.0.0:6881->6881/tcp, 58846/tcp, 0.0.0.0:8112->8112/tcp, 0.0.0.0:6881->6881/udp, 58946/tcp, 58946/udp   deluge
```

# VPN Scratch Notes

[Checkout the reddit megathread for VPN suggestions](https://www.reddit.com/r/VPN/comments/1020qnn/monthly_vpn_recommendations_megathread_the_only/).

- [Proton Unlimited](https://account.protonvpn.com/dashboard)
- [Mullvad](https://mullvad.net/en/)
- [Private Internet Access](https://www.privateinternetaccess.com/vpn-server)
