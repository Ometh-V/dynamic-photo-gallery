# Dynamic Photo Gallery

A lightweight, static photo gallery web app. Drop images into the `photos/` folder, refresh the browser — no build step required.

## Running locally

**Requirements:** Node.js 18+

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

To add or remove photos, edit the `photos/` folder and refresh the page.

## Running in production

```bash
node server.js
```

For long-running deployments, use a process manager to keep the server alive:

```bash
# with pm2
npm install -g pm2
pm2 start server.js --name photo-gallery
pm2 save
```

## Supported formats

`jpg` `jpeg` `png` `gif` `webp` `avif` `svg`

## Project structure

```
dynamic-photo-gallery/
├── photos/               ← place images here
├── index.html
├── style.css
├── app.js
├── server.js             ← local dev server (no dependencies)
├── generate-manifest.js  ← optional: generates manifest.json for static deploys
├── manifest.json
├── Dockerfile
└── package.json
```
