What is the most interesting way I can connect a linux server to a web browser?

How about a Pub/Sub worker that pipes messages into `subprocess.Popen`?

- [Cloudflare Pub/Sub](https://www.cloudflare.com/en-ca/cloudflare-pub-sub-lightweight-messaging-private-beta/)

```bash
source venv/bin/activate
pip install paho-mqtt

# relative repository root
./r2.u0.vc/bridge/worker.py
# relative to README.md file
./worker.py
```
