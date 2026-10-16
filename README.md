# ClipNest Website

Static site for ClipNest, the local-only clipboard history app for Windows. It is published with GitHub Pages.

## Files

- `index.html`: home page (features, privacy summary, release notes, download)
- `privacy.html`: privacy policy
- `support.html`: support and FAQ
- `terms.html`: terms of use
- `styles.css`: all styles, with light and dark themes that follow the visitor's system setting
- `script.js`: mobile menu, the interactive sample panel (search, filters, and the Ctrl+Shift+V toggle), checksum copy button, and table-of-contents highlighting
- `assets/clipnest-logo.png`, `assets/favicon-64.png`
- `downloads/ClipNest_Setup.exe`: current installer
- `downloads/SHA256SUMS.txt`: SHA-256 checksum of the installer

The site makes no third-party requests: no web fonts, analytics, or external scripts. It uses the visitor's system fonts (Segoe UI Variable on Windows).

## Publishing a new release

1. Copy `ReleasePackage/ClipNest_Setup.exe` from the app repo into `downloads/`.
2. Regenerate the checksum in PowerShell from this folder:

   ```powershell
   $h = (Get-FileHash downloads\ClipNest_Setup.exe -Algorithm SHA256).Hash
   "$h  ClipNest_Setup.exe" | Set-Content downloads\SHA256SUMS.txt -Encoding ascii
   ```

3. Update the version number, download size, and checksum in `index.html` (hero, release notes, details, and download sections) and the version in `support.html`.
4. Keep the privacy policy in line with `PrivacyPolicy.md` in the app repo, and update its "Last updated" date.

## Deployment

This is a plain static site. Any static host works (GitHub Pages, Netlify, Cloudflare Pages, Vercel). GitHub Pages serves files up to 100 MB, which covers the installer.
