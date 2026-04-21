# City OS — Future City Control Panel

Next.js (App Router) smart-city control panel UI with simulated live data.

## Run

From the **workspace root** (the folder that contains both `package.json` and `city-os/`):

```bash
npm install
npm run dev
```

Or from inside the app only:

```bash
cd city-os
npm install
npm run dev
```

Open `http://localhost:3000`.

**Note:** The parent folder name is not a valid npm package name, so the Next.js app lives in `city-os/`. The root `package.json` uses an npm **workspace** so you can run scripts from the parent directory.
