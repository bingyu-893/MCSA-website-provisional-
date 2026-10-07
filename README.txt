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

Secretariat source and review workflow
-------------------------------------
Make Secretariat edits in MCSA-offical-website first. From that checkout, run:
node scripts/export-secretariat.cjs ../MCSA-website-provisional-
This exports Chinese/English static articles, scoped styles, structured content,
and unchanged original images. No JavaScript is required by these static pages.
Run here: node tests/secretariat-originals.cjs
The original 640.png and 641.jpeg through 649.jpeg are tracked unchanged; their
SHA-256 hashes and sizes are in content/departments/secretariat-originals.json.
Use feature branches and draft PRs in both repositories. Hugo reviews before merge.
The earlier Secretariat page already existed on main; this review covers source
synchronisation and original-asset verification, not a new live deployment.

Publicity department
--------------------
The Publicity page now follows the Secretariat article layout, with the supplied
original photos, leader messages, three teams, requirements, benefits and past
application notice. Make edits in the official repository, then run its
scripts/export-publicity.cjs with this checkout as destination. Both language
versions are static HTML. Images 640–644 are separate from the Secretariat files.
content/departments/publicity-originals.json records checksums for the five
original images and four unchanged source screenshots. Recruitment dates and
account statistics are historical. English translation awaits editorial review.
