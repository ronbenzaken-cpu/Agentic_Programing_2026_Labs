# Weekly Plate – weekly diet-menu planner

_Agentic Programming 2026 lab repository._

Weekly Plate is a static web app (HTML + CSS + vanilla JavaScript, no build step, no backend) that plans a week of meals around your **allergies**, the foods you like, and the time and equipment you have.

## Features
- **Allergies & dislikes** – type items (Enter/comma) as removable chips, or quick-add the 9 common allergens. Allergies are hard exclusions; dislikes are avoided when possible.
- **Food preference slides** – Protein, Carbs, Vegetables, Fruit, Dairy, with Select all / Clear. Foods that match an allergy are disabled with a red "allergen" badge.
- **Cooking settings** – skill, max cook time (10–90 min), equipment (or no-cook only), meals per day, number of people.
- **Weekly menu** – 7 days × chosen meals. Generate, regenerate (locked meals are kept), per-meal 🔄 swap and 🔒 lock, and Accept. A dish is never used more than twice per week when alternatives exist.
- **Shopping list** – generated from the accepted menu, grouped by category, with checkboxes.
- **Print / save as PDF** – prints the menu and shopping list only.
- **Saved automatically** – all preferences, the menu and the shopping-list checks are kept in `localStorage`.
- Responsive (375px–1440px), keyboard accessible, ARIA labels, visible focus states.

## Allergy safety
- Every dish in `data/dishes.js` lists all ingredients and allergen tags.
- `js/allergens.js` matches allergies case-insensitively with a synonym map (e.g. "nuts" → almond, walnut, cashew…; "dairy" → milk, cheese, yogurt, butter, cream; "gluten" → wheat, bread, pasta, couscous, barley…). When unsure, it excludes.
- Dishes are filtered by allergies **before** any preference scoring, and the filter is never relaxed. If no safe dish exists, the slot shows **"No safe option, adjust preferences"**.
- **Self-test:** click **Run safety check** in the footer, or run `runSafetyCheck()` in the browser console. It audits the dish data and generates 50 random menus with random allergies, and it must report 0 allergen hits.

Always double-check product labels. Store-bought ingredients vary.

## Run locally
Just open `index.html` in a browser (double-click it). There's nothing to install.

## Project structure
```
index.html          page markup
css/styles.css      styles + print stylesheet
data/foods.js       foods per category (preference slides, shopping groups)
data/dishes.js      78 dishes with ingredients, allergens, time, difficulty, equipment
js/allergens.js     allergen map + safe matching
js/generator.js     menu generator (allergy filter first)
js/selftest.js      runSafetyCheck()
js/app.js           UI, localStorage, shopping list, print
.github/workflows/pages.yml  GitHub Pages deployment
```

## Deploy to GitHub Pages (one-time setup)
1. On GitHub open the repository → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **GitHub Actions**.
3. Push to `main` (or open **Actions** → *Deploy to GitHub Pages* → **Run workflow**).
4. When the workflow finishes, the live URL appears in **Settings → Pages** and in the workflow run summary. It will be:
   `https://<owner>.github.io/Agentic_Programing_2026_Labs/`, which for this repo is https://ronbenzaken-cpu.github.io/Agentic_Programing_2026_Labs/
