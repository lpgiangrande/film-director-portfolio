# Regis Raffin — Film Director Portfolio

A portfolio website for film director **Regis Raffin**, with a custom back office that lets him publish and edit his projects himself: upload images and videos, build each project page block by block, and see the result live before saving.

**Live site → [regisraffin.com](https://www.regisraffin.com)**

![Home page](public/screenshots-readme/home.jpg)

---

## Features

### Public site

- **Project grid** — each thumbnail switches from a still image to a looping video preview on hover (with a still-image fallback where autoplay is blocked).
- **Categories** — all projects, *Animation* or *Live-action*, sorted by release date.
- **Project pages** — main Vimeo video, credits, then a free sequence of blocks: rows of 1 to 4 images/videos with captions, extra Vimeo videos and paragraphs. Images open in a zoom view.
- **About page** — portrait, biography and contact button.
- **Responsive** — desktop, tablet and mobile.
- **Fast media delivery** — files are stored on Amazon S3 and served through a CloudFront CDN.

| Project page | On mobile |
|---|---|
| ![Project page](public/screenshots-readme/project.jpg) | ![Project page on mobile](public/screenshots-readme/mobile-project.jpg) |

### Back office

Designed to be used by a non-developer: no links to paste, no layout rules to remember.

- **Page builder with live preview** — a project page is a list of blocks the client adds, reorders and removes. The preview on the right uses the markup and styles of the public site, so what he sees is what gets published. Clicking an element in the preview scrolls to it in the form.
- **Direct uploads to S3** — images (JPG) and videos (MP4) go straight from the browser to S3 with a progress bar; the server never handles the files. Dropping several files splits them into balanced rows, and visuals can be dragged from one row to another.
- **Vimeo links** — any Vimeo URL is accepted and converted to an embeddable player link.
- **Biography editor** — photo upload, text and contact email, with live preview.
- **Project list** — edit or delete a project. Deleting removes the thumbnail, the page and their files from S3 (files still used elsewhere and site assets are never deleted).
- **Safety nets** — saving is blocked while uploads are running, and the browser warns before leaving a page with unsaved changes.

![Project editor with live preview](public/screenshots-readme/editor.jpg)

| Content blocks | Biography editor |
|---|---|
| ![Content blocks](public/screenshots-readme/editor-blocks.jpg) | ![Biography editor](public/screenshots-readme/bio-editor.jpg) |

![Admin project list](public/screenshots-readme/admin-list.jpg)

---

## Built with

- **Backend** — Node.js, Express, MongoDB (Atlas) with Mongoose, Passport (local strategy)
- **Frontend** — EJS templates, Bootstrap 5, vanilla JavaScript
- **Media** — Amazon S3 (presigned uploads), CloudFront CDN, Vimeo embeds
- **Hosting** — AWS Lightsail, PM2

---

## How it works

### Uploads

```mermaid
sequenceDiagram
    participant B as Browser (back office)
    participant S as Express server
    participant S3 as Amazon S3
    B->>S: GET /admin/presign?type=image/jpeg&folder=projects
    S-->>B: presigned PUT URL + public URL
    B->>S3: PUT file (with progress)
    S3-->>B: 200 OK
    Note over B: the public URL is stored in the form
    B->>S: POST form (links only, as text)
```

The server only signs the request (allowed types: JPG and MP4; allowed folders: `thumbnails`, `projects`, `about`), so large videos never go through it.

### Project content

A project page is stored as an ordered list of blocks:

```js
{
  main_video: "https://player.vimeo.com/video/806237246",
  blocks: [
    { type: "text",  text: "..." },
    { type: "row",   items: [{ url: "https://…/a.jpg", caption: "…" }, { url: "https://…/b.mp4" }], text: "…" },
    { type: "vimeo", url: "https://player.vimeo.com/video/…", text: "…" }
  ]
}
```

A single template (`views/project.ejs`) renders these blocks in order. Blocks sent by the editor are validated and cleaned server side (`utils/projectBlocks.js`).

### Security

- Admin routes require authentication (Passport sessions, bcrypt-hashed passwords).
- CSRF tokens on every form (`csrf-sync`), rate-limited login, Helmet headers with a Content Security Policy.
- Uploads go through short-lived presigned URLs limited to one file type and one folder.
- The AWS user of the site can only upload and delete files, and cannot delete anything under `public/`.

---

## Project structure

```
config/        Passport strategy and route guards
controllers/   Route handlers (public pages, projects, thumbnails, bio, S3 presign)
models/        Mongoose schemas (Project, Thumbnail, Biography, User)
routes/        Public and admin routes
utils/         CDN links, S3 client and cleanup, Vimeo links, block validation
scripts/       One-off data migrations
views/         EJS templates (public site + back office)
public/        CSS, front-end JavaScript, images
```

---

## Running locally

**Requirements:** Node.js 20+, a MongoDB database, an S3 bucket (optionally behind CloudFront).

```bash
npm install
npm run dev        # http://localhost:3000
```

Create a `.env` file at the root:

```bash
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
SECRET_KEY=a-long-random-string

S3_DOMAIN=bucket-name.s3.region.amazonaws.com
CDN_DOMAIN=xxxxxxxx.cloudfront.net

AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-west-3
S3_BUCKET=bucket-name
```

For local work, point `MONGODB_URI` to a copy of the production database rather than the real one.

The S3 bucket needs a CORS rule allowing `PUT` from the site's origins (including `http://localhost:3000` for local work).

---

## Deployment

**On the Mac**

```bash
git add <files> && git commit -m "clear message" && git push
```

**On the Lightsail server** (connect through the AWS console)

```bash
cd ~/htdocs/film-director-portfolio
git pull
npm install        # only if package.json changed
pm2 restart all
```

- The `.env` file is not versioned: if the code needs a new variable, add it on the server with `nano .env`, then `pm2 restart all`. Keep the server's `MONGODB_URI` on the production database.
- If a change alters how data is stored, run the migration script on the production database **before** deploying (e.g. `node scripts/migrateProjectBlocks.js`, then `--apply`).
- **If something looks wrong:** `git fetch && git status` to check whether the server is behind, `pm2 logs --lines 50` to read the errors, then hard-reload the page (Cmd + Shift + R).
