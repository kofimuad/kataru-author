# Kataru Yahya — Author Website

Minimalist author website built with React + Vite, deployed on Netlify with Netlify Functions as the backend and MongoDB Atlas as the database. Single-repo, no separate backend server needed.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, React Router, Vite      |
| Backend     | Netlify Functions (Node.js)       |
| Database    | MongoDB Atlas                     |
| Image store | Cloudinary (free tier)            |
| Hosting     | Netlify                           |
| Fonts       | EB Garamond + DM Sans (Google)    |

---

## Pages

| Route            | Description                                      |
|------------------|--------------------------------------------------|
| `/`              | Bio — landing page with photo, bio text, links   |
| `/books`         | Published books with covers + buy links          |
| `/publications`  | Poems, essays, stories published elsewhere       |
| `/interviews`    | Interviews, profiles, podcasts                   |
| `/facilitation`  | Workshops, commissions, residencies              |
| `/contact`       | Contact info + enquiry form                      |
| `/admin`         | Admin dashboard (PIN protected)                  |

---

## Local Development

### 1. Clone & install

```bash
git clone <your-repo-url>
cd kataru-yahya
npm install
cd netlify/functions && npm install && cd ../..
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in:

```env
# MongoDB — get from MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority

# Admin PIN — choose any 4-digit number
ADMIN_PIN=2580
VITE_ADMIN_PIN=2580

# Cloudinary — from cloudinary.com dashboard (optional — images still work without it, stored as base64 locally)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run locally

You need the [Netlify CLI](https://docs.netlify.com/cli/get-started/) to run functions locally:

```bash
npm install -g netlify-cli
netlify dev
```

This starts the Vite dev server on port 5173 proxied through Netlify's local emulator on port 8888, so functions work at `/.netlify/functions/...`.

---

## Deployment (Netlify)

1. Push to GitHub / GitLab
2. Connect repo in Netlify dashboard → **Add new site → Import an existing project**
3. Build settings (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. In **Site settings → Environment variables**, add all variables from `.env.example`
5. Deploy

---

## MongoDB Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write access
3. Add your Netlify deploy IP (or `0.0.0.0/0` for all IPs) to the IP allowlist
4. Copy the connection string into `MONGODB_URI`

The app will auto-create these collections on first use:
- `bio` — single document with bio text + photo
- `books` — book entries
- `publications` — published poems / essays / stories
- `interviews` — interviews and media appearances
- `workshops` — facilitation / workshops / commissions

---

## Cloudinary Setup (for image uploads)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. From the dashboard, copy your **Cloud name**, **API key**, and **API secret**
3. Add them to your environment variables

If Cloudinary is not configured, uploaded images will still work in the browser session (stored as base64) but won't persist across deployments.

---

## Admin Dashboard

Access at `/admin/login` — enter your 4-digit `VITE_ADMIN_PIN`.

From the dashboard you can:
- **Bio** — upload the author photo, write bio paragraphs, add caption + press line
- **Books** — add/edit/delete books with cover image, publisher, year, buy links
- **Publications** — list poems, essays, stories with venue, date, external link
- **Interviews** — list interviews, podcasts, profiles with outlet, date, link
- **Facilitation** — list workshops, commissions, residencies with organisation, date, link

---

## Newsletter

The newsletter links to **https://substack.com/@kataru** — update this in:
- `src/components/Footer.jsx`
- `src/pages/Bio.jsx`

---

## Customisation

### Colours (src/styles/global.css)
```css
:root {
  --burgundy:       #6B1E2E;   /* primary accent */
  --burgundy-light: #8B3444;   /* hover state */
  --burgundy-pale:  #F5ECF0;   /* tinted backgrounds */
  --ink:            #1A1A1A;   /* body text */
}
```

### Fonts (index.html)
The site uses **EB Garamond** (serif) and **DM Sans** (sans-serif) from Google Fonts. Change the `<link>` in `index.html` and the `--ff-serif` / `--ff-sans` variables in `global.css`.

### Author photo
Upload via the admin dashboard (`/admin` → Bio tab → Upload photo). The photo is stored in Cloudinary and served from there.

### Social links
Update Instagram / Twitter handles in:
- `src/components/Nav.jsx` (not present — links are in Footer + Bio)
- `src/components/Footer.jsx`
- `src/pages/Bio.jsx`
