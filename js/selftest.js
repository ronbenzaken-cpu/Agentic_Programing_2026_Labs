/* Allergy safety self-test. Run in the browser console: runSafetyCheck()
 * 1. Data audit: every allergen implied by a dish's ingredients must be in its allergen tags.
 * 2. 50 random menus with random allergies (synonyms, mixed case, plurals): zero allergen hits allowed.
 * The check uses its own independent matcher, not the app's isDishSafe. */
(function (g) {
  /* Harmless compounds that would otherwise imply a group in the data audit only. */
  var AUDIT_IGNORE = {
    "peanut butter": ["dairy"], "cocoa butter": ["dairy"], "coconut milk": ["dairy"], "oat milk": ["dairy"],
    "almond milk": ["dairy"], "soy milk": ["dairy"], "corn tortilla": ["gluten"], "rice noodle": ["gluten"], "rice cake": ["gluten"]
  };

  function impliedGroups(ingredient) {
    var txt = ingredient.toLowerCase(), out = [];
    Object.keys(g.Allergens.MAP).forEach(function (grp) {
      var ignored = Object.keys(AUDIT_IGNORE).some(function (c) { return txt.indexOf(c) !== -1 && AUDIT_IGNORE[c].indexOf(grp) !== -1; });
      if (!ignored && g.Allergens.MAP[grp].some(function (t) { return txt.indexOf(t) !== -1; })) out.push(grp);
    });
    return out;
  }

  function auditData() {
    var errors = [];
    g.DISHES.forEach(function (d) {
      if (!d.ingredients || !d.ingredients.length || !Array.isArray(d.allergens)) errors.push(d.name + ": missing ingredients/allergens");
      d.ingredients.forEach(function (ing) {
        impliedGroups(ing).forEach(function (grp) {
          if (d.allergens.indexOf(grp) === -1) errors.push(d.name + ": \"" + ing + "\" implies " + grp + " but tag missing");
        });
      });
      d.allergens.forEach(function (t) { if (!g.Allergens.MAP[t]) errors.push(d.name + ": unknown allergen tag " + t); });
    });
    return errors;
  }

  /* Independent check: does this dish contain anything the person is allergic to? */
  var GROUP_OF = {
    peanut: "peanuts", peanuts: "peanuts", nuts: "tree nuts", "tree nuts": "tree nuts", dairy: "dairy", milk: "dairy",
    "milk/dairy": "dairy", eggs: "eggs", egg: "eggs", fish: "fish", shellfish: "shellfish", gluten: "gluten",
    wheat: "gluten", "wheat/gluten": "gluten", soy: "soy", soya: "soy", sesame: "sesame"
  };
  function violates(dish, allergy) {
    var a = allergy.toLowerCase().trim(), grp = GROUP_OF[a];
    var text = (dish.name + " | " + dish.ingredients.join(" | ")).toLowerCase();
    if (grp) {
      if (dish.allergens.indexOf(grp) !== -1) return grp + " tag";
      var words = g.Allergens.MAP[grp], hit = words.filter(function (w) { return text.indexOf(w) !== -1; })[0];
      if (hit) return hit;
      if (a === "nuts" && (dish.allergens.indexOf("peanuts") !== -1 || text.indexOf("peanut") !== -1)) return "peanut";
      return null;
    }
    return text.indexOf(a.replace(/s$/, "")) !== -1 ? a : null;
  }

  var POOL = ["peanuts", "Peanut", "nuts", "NUTS", "tree nuts", "milk/dairy", "Dairy", "milk", "eggs", "Egg", "fish", "shellfish",
    "wheat/gluten", "Gluten", "wheat", "soy", "Soya", "sesame", "tomato", "Banana", "chicken", "rice", "avocado", "mushrooms", "Shrimp"];
  function pickSome(arr, n) { return arr.slice().sort(function () { return Math.random() - 0.5; }).slice(0, n); }

  function runSafetyCheck(opts) {
    opts = opts || {};
    var runs = opts.runs || 50, hits = [], meals = 0, emptySlots = 0;
    var audit = auditData();
    for (var r = 0; r < runs; r++) {
      var allergies = pickSome(POOL, 1 + Math.floor(Math.random() * 5));
      var prefs = {
        allergies: allergies,
        dislikes: pickSome(["onion", "mushroom", "olives", "cilantro"], Math.floor(Math.random() * 2)),
        selected: {}, skill: pickSome(["beginner", "intermediate", "advanced"], 1)[0],
        maxTime: 10 + Math.floor(Math.random() * 81),
        equipment: pickSome(["stove", "oven", "microwave", "airfryer", "grill"], 1 + Math.floor(Math.random() * 5)),
        noCook: Math.random() < 0.1, meals: ["breakfast", "lunch", "dinner", "snack"], people: 2
      };
      var menu = g.MenuGen.generateMenu(prefs);
      g.MenuGen.swapMeal(menu, Math.floor(Math.random() * 7), "dinner", prefs); // also test swaps
      menu.days.forEach(function (day, di) {
        menu.meals.forEach(function (m) {
          if (!day[m]) { emptySlots++; return; }
          meals++;
          var d = g.MenuGen.dishById(day[m]);
          allergies.forEach(function (a) {
            var v = violates(d, a);
            if (v) hits.push({ run: r + 1, day: di, meal: m, dish: d.name, allergy: a, matched: v });
          });
        });
      });
    }
    var result = { passed: hits.length === 0 && audit.length === 0, menus: runs, mealsChecked: meals, emptySafeSlots: emptySlots, allergenHits: hits, dataAuditErrors: audit };
    if (typeof console !== "undefined") {
      console.log((result.passed ? "✅ PASS" : "❌ FAIL") + " – " + runs + " menus, " + meals + " meals checked, " + hits.length + " allergen hits, " + audit.length + " data errors");
      if (!result.passed) console.log(result);
    }
    return result;
  }

  g.runSafetyCheck = runSafetyCheck;
})(typeof window !== "undefined" ? window : globalThis);
