const fs = require('fs');
const path = require('path');

// ── 1. Auto-create the GitHub Actions workflow ──────────────────────────────
const workflowDir = path.join(__dirname, '.github', 'workflows');
fs.mkdirSync(workflowDir, { recursive: true });

const workflow = `name: Auto Generate README

on:
  push:
    branches: [main, master]

jobs:
  update-readme:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Generate README
        run: node generate-readme.js

      - name: Commit and push README
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add README.md
          git diff --cached --quiet || git commit -m "docs: auto-update README [skip ci]"
          git push
`;

fs.writeFileSync(path.join(workflowDir, 'readme.yml'), workflow);
console.log('✅ .github/workflows/readme.yml created');

// ── 2. Generate README.md ───────────────────────────────────────────────────
const pkg = JSON.parse(
  fs.existsSync('package.json') ? fs.readFileSync('package.json', 'utf8') : '{}'
);
const appName = pkg.name || 'Walnut Noir';
const version  = pkg.version || '1.0.0';

const readme = `# 🍂 Walnut Noir

> A premium React Native food discovery app with a rich dark walnut aesthetic.

**Developer:** Yashfa Javed &nbsp;|&nbsp; **Version:** ${version} &nbsp;|&nbsp; ![Auto README](https://img.shields.io/badge/README-auto--generated-D9B99B?style=flat&labelColor=2E1F1B)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 Live Search | Real-time restaurant filtering by name |
| 🍜 Cuisine Filter | 9 categories — Desi, Italian, Japanese & more |
| ✨ Shimmer UI | Animated shine effect on the search bar |
| 🗂️ Detail Page | Blurred hero image with order confirmation |
| 🎨 Dark Walnut Theme | Warm \`#2E1F1B\` palette throughout the app |
| 📡 PHP API Fetch | Connects to local XAMPP/WAMP server |

---

## 🛠️ Tech Stack

\`React Native\` &nbsp; \`PHP REST API\` &nbsp; \`MySQL / XAMPP\` &nbsp; \`Animated API\` &nbsp; \`FlatList\` &nbsp; \`ImageBackground\`

---

## ⚙️ API Configuration

\`\`\`
Base URL  →  http://192.168.0.104/leohub_api
Endpoint  →  GET /get_restaurants.php
Requires  →  XAMPP running with MySQL active
\`\`\`

---

## 🚀 Getting Started

**1.** Start XAMPP — enable Apache + MySQL. Place PHP API inside \`htdocs/leohub_api/\`

**2.** Update \`API_URL\` in \`App.js\` to your machine's local IP address

**3.** Install dependencies:
\`\`\`bash
npm install
\`\`\`

**4.** Run the app:
\`\`\`bash
npx react-native run-android
# or
npx react-native run-ios
\`\`\`

**5.** Make sure your phone/emulator is on the same Wi-Fi as the XAMPP host

---

## 📁 Project Structure

\`\`\`
walnut-noir/
├── App.js                        ← Main component, screens, state, API logic
├── generate-readme.js            ← This file — runs on every push
├── .github/
│   └── workflows/
│       └── readme.yml            ← Auto-created by this script
└── leohub_api/
    └── get_restaurants.php       ← PHP JSON endpoint
\`\`\`

**Database table:** \`restaurants\`
\`id · name · cuisine · rating · delivery_time · price_range · location · image_url\`

---

## 🎨 Color Palette

| Token | Hex | Usage |
|---|---|---|
| \`bg\` | \`#2E1F1B\` | Main background |
| \`card\` | \`#3D2B24\` | Card surfaces |
| \`accent\` | \`#D9B99B\` | Highlights, buttons |
| \`border\` | \`#1A0F0A\` | Borders |
| \`highlight\` | \`#5E4B43\` | Filter buttons |

---

## 👤 Author

**Yashfa Javed** — Mobile App Developer

---

*This README is auto-generated on every push via GitHub Actions.*  
*Last updated: ${new Date().toUTCString()}*
`;

fs.writeFileSync('README.md', readme);
console.log('✅ README.md generated successfully!');
