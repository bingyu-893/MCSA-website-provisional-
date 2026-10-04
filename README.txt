Static export: upload all contents to your static host root. To edit, use the full CMS package; this export does not run the backend.

Department pages (5 October 2026)
- departments.html and department-*.html contain static HTML and CSS, with no browser JavaScript or content API dependency. English versions use the -en.html suffix; language links preserve the current department.
- Organisation content and original images were copied from official-website commit 3209a5e. Portraits, messages and top-to-bottom article order are retained; photos are not clickable. March recruitment is labelled closed.
- Other departments use the existing provisional snapshot; unavailable daily work/history/head lists are explicitly pending, not invented.
- Edit the static HTML language variants together. Shared styling is in assets/departments-static.css. The official site's CMS renderer remains separate and is not imported here.
- Existing homepage/recruitment navigation now opens the static department pages. Recruitment article URLs remain in data/site.js as recruitmentUrl.
- The existing assets/app (2).js was renamed to assets/app.js to match existing page script references; no new runtime JavaScript is loaded by the static department pages.
- Traditional Chinese versions of the new article are pending translation; static pages offer Simplified Chinese and English.
- Preview: python3 -m http.server 8766, then open /departments.html. Publishing this repository does not by itself verify deployment to www.monashcsa.org.

Secretariat article
- Chinese and English pages use the supplied 640–649 assets in numeric/top-to-bottom order, including four leadership messages and External, Internal and Information Technology teams.
- Images are original bytes, displayed at bounded widths, with no click-to-open links. The 24 July–10 August 2026 recruitment round and its ten IT places are historical.
- content/departments/secretariat.json is an editable content reference, not a browser data dependency. Update both static HTML variants when editing it. English copy is translated from the supplied Chinese material and should receive the team's editorial review.
