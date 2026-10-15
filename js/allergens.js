/* Allergen map + safety matching.
 * Design rule: when in doubt, EXCLUDE. Matching is case-insensitive substring matching,
 * so it over-excludes (e.g. "butter" also hits "peanut butter") rather than ever missing an allergen. */
(function (g) {
  /* Canonical allergen groups -> ingredient words that signal them. */
  var ALLERGEN_MAP = {
    "peanuts": ["peanut", "groundnut", "satay", "arachis"],
    "tree nuts": ["almond", "walnut", "cashew", "pecan", "hazelnut", "pistachio", "macadamia", "brazil nut", "pine nut", "praline", "marzipan", "nutella", "pesto"],
    "dairy": ["milk", "cheese", "yogurt", "yoghurt", "butter", "cream", "ghee", "whey", "casein", "lactose", "feta", "mozzarella", "parmesan", "ricotta", "halloumi", "paneer", "kefir", "custard", "lassi"],
    "eggs": ["egg", "mayonnaise", "mayo", "meringue", "aioli", "albumin"],
    "fish": ["fish", "salmon", "tuna", "cod", "tilapia", "sardine", "anchov", "mackerel", "trout", "halibut", "haddock", "bass"],
    "shellfish": ["shrimp", "prawn", "crab", "lobster", "mussel", "clam", "oyster", "scallop", "squid", "calamari", "crayfish"],
    "gluten": ["wheat", "bread", "pasta", "couscous", "barley", "rye", "flour", "spaghetti", "linguine", "lasagna", "noodle", "tortilla", "pita", "bagel", "croissant", "cracker", "crouton", "breadcrumb", "panko", "seitan", "bulgur", "semolina", "spelt", "farro", "granola", "muesli", "soy sauce", "teriyaki", "toast", "cake", "cookie", "muffin", "pancake", "waffle", "biscuit", "pizza", "malt"],
    "soy": ["soy", "soya", "tofu", "edamame", "tempeh", "miso", "tamari"],
    "sesame": ["sesame", "tahini", "hummus", "halva", "za'atar"]
  };

  /* What people type -> canonical groups. */
  var ALIASES = {
    "peanut": ["peanuts"], "peanuts": ["peanuts"], "groundnut": ["peanuts"],
    "nut": ["tree nuts", "peanuts"], "nuts": ["tree nuts", "peanuts"], "tree nut": ["tree nuts"], "tree nuts": ["tree nuts"],
    "dairy": ["dairy"], "milk": ["dairy"], "milk/dairy": ["dairy"], "lactose": ["dairy"], "milk products": ["dairy"],
    "egg": ["eggs"], "eggs": ["eggs"],
    "fish": ["fish"], "shellfish": ["shellfish"], "seafood": ["fish", "shellfish"], "crustacean": ["shellfish"], "crustaceans": ["shellfish"],
    "gluten": ["gluten"], "wheat": ["gluten"], "wheat/gluten": ["gluten"], "celiac": ["gluten"], "coeliac": ["gluten"],
    "soy": ["soy"], "soya": ["soy"], "soybean": ["soy"], "soybeans": ["soy"],
    "sesame": ["sesame"], "sesame seeds": ["sesame"]
  };

  function normalize(s) { return String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").trim(); }

  /* "Tomatoes" -> ["tomatoes", "tomatoe", "tomato"] so plurals still match singular ingredients. */
  function variants(term) {
    var out = [term];
    if (term.length > 3 && /s$/.test(term)) out.push(term.slice(0, -1));
    if (term.length > 4 && /es$/.test(term)) out.push(term.slice(0, -2));
    if (term.length > 4 && /ies$/.test(term)) out.push(term.slice(0, -3) + "y");
    return out;
  }

  /* Turn a user's allergy list into { groups: Set-like object, terms: [...] } */
  function expandAllergies(list) {
    var groups = {}, terms = {};
    (list || []).forEach(function (raw) {
      var a = normalize(raw);
      if (!a) return;
      variants(a).forEach(function (v) {
        terms[v] = true;
        (ALIASES[v] || []).forEach(function (grp) { groups[grp] = true; });
        if (ALLERGEN_MAP[v]) groups[v] = true;
      });
    });
    Object.keys(groups).forEach(function (grp) { ALLERGEN_MAP[grp].forEach(function (t) { terms[t] = true; }); });
    return { groups: groups, terms: Object.keys(terms).filter(function (t) { return t.length >= 2; }) };
  }

  /* Returns the list of reasons an item is unsafe (empty array = safe).
   * item: { name, ingredients:[...], allergens:[...] } */
  function allergenHits(item, allergies) {
    var exp = allergies && allergies.groups ? allergies : expandAllergies(allergies);
    var hits = [];
    (item.allergens || []).forEach(function (tag) { if (exp.groups[normalize(tag)]) hits.push(tag); });
    var texts = [normalize(item.name)].concat((item.ingredients || []).map(normalize));
    texts.forEach(function (txt) {
      exp.terms.forEach(function (t) { if (txt.indexOf(t) !== -1) hits.push(t + " in \"" + txt + "\""); });
    });
    return hits;
  }

  function isDishSafe(dish, allergies) { return allergenHits(dish, allergies).length === 0; }

  function isFoodAllergen(food, allergies) {
    return allergenHits({ name: food.name, ingredients: food.terms }, allergies).length > 0;
  }

  /* Soft match used for dislikes (same matcher, no group expansion beyond aliases). */
  function matchesAny(item, list) { return allergenHits(item, list).length > 0; }

  g.Allergens = {
    MAP: ALLERGEN_MAP, ALIASES: ALIASES, COMMON: ["peanuts", "tree nuts", "milk/dairy", "eggs", "fish", "shellfish", "wheat/gluten", "soy", "sesame"],
    normalize: normalize, expandAllergies: expandAllergies, allergenHits: allergenHits,
    isDishSafe: isDishSafe, isFoodAllergen: isFoodAllergen, matchesAny: matchesAny
  };
})(typeof window !== "undefined" ? window : globalThis);
