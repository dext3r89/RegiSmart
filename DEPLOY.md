# RegiSmart Demo and Deployment

## Fastest local demo

Run:

```bash
npm run demo
```

The server binds to `0.0.0.0`, so it prints a `localhost` URL and one or more local network URLs such as `http://192.168.x.x:4173`.

Anyone on the same Wi-Fi can open that LAN URL on their phone or laptop.

## Fastest hosted demo

This project is a static frontend, so it is a good fit for Vercel.

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Deploy with the default static settings.

Included config:

- `vercel.json` enables clean routes like `/admin` and `/teacher`
- HTML files are served with `no-cache` to keep demos fresh after updates

## Important demo note

This app depends on Supabase, so hosted and LAN demos both still require:

- valid Supabase tables and RLS policies
- reachable internet access from the demo device
- the existing publishable key only, never a service role key in frontend code

## Suggested expo flow

For in-person demos:

1. Start `npm run demo` on your laptop.
2. Connect all devices to the same Wi-Fi hotspot.
3. Open the printed LAN URL on phones/tablets.
4. Keep a hosted Vercel URL as backup in case local Wi-Fi is unreliable.
