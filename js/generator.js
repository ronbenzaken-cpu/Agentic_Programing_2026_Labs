/* Weekly menu generator.
 * Order of operations for every slot (never changes):
 *   1. ALLERGY FILTER (hard, never relaxed)
 *   2. meal type + equipment (hard)
 *   3. cook time + skill (relaxed only if nothing else fits)
 *   4. scoring: liked foods (+), dislikes (-), repeats (max 2 per week)
 * An empty safe pool returns null -> UI shows "No safe option". */
(function (g) {
  var A = g.Allergens;
  var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var MEALS = ["breakfast", "lunch", "dinner", "snack"];
  var SKILL = { beginner: 1, intermediate: 2, advanced: 3 };
  var MAX_REPEATS = 2;

  function dishById(id) {
    for (var i = 0; i < g.DISHES.length; i++) if (g.DISHES[i].id === id) return g.DISHES[i];
    return null;
  }

  function equipmentOk(dish, prefs) {
    if (prefs.noCook) return dish.equipment.length === 0;
    return dish.equipment.every(function (e) { return (prefs.equipment || []).indexOf(e) !== -1; });
  }

  function likedTerms(prefs) {
    var terms = [];
    Object.keys(prefs.selected || {}).forEach(function (cat) {
      (prefs.selected[cat] || []).forEach(function (fid) {
        (g.FOODS[cat] || []).forEach(function (f) { if (f.id === fid) terms = terms.concat(f.terms); });
      });
    });
    return terms;
  }

  /* Step 1 + 2: every candidate that is allergy-safe and possible to cook. */
  function safePool(meal, prefs, exp) {
    return g.DISHES.filter(function (d) { return A.isDishSafe(d, exp); })           // 1. allergies FIRST
      .filter(function (d) { return d.meals.indexOf(meal) !== -1 && equipmentOk(d, prefs); });
  }

  /* counts: {dishId: timesUsed}, exclude: [dishIds] (e.g. same day / current dish when swapping) */
  function pickDish(meal, prefs, counts, exclude) {
    var exp = A.expandAllergies(prefs.allergies);
    var pool = safePool(meal, prefs, exp);
    if (!pool.length) return null;

    var maxSkill = SKILL[prefs.skill] || 3, maxTime = prefs.maxTime || 90;
    var strict = pool.filter(function (d) { return d.time <= maxTime && SKILL[d.difficulty] <= maxSkill; });
    var timeRelaxed = pool.filter(function (d) { return SKILL[d.difficulty] <= maxSkill; });
    var candidates = strict.length ? strict : (timeRelaxed.length ? timeRelaxed : pool);

    var fresh = candidates.filter(function (d) { return (counts[d.id] || 0) < MAX_REPEATS && (exclude || []).indexOf(d.id) === -1; });
    if (fresh.length) candidates = fresh;
    else {
      var notExcluded = candidates.filter(function (d) { return (exclude || []).indexOf(d.id) === -1; });
      if (notExcluded.length) candidates = notExcluded;
    }

    var liked = likedTerms(prefs);
    var scored = candidates.map(function (d) {
      var text = d.ingredients.join(" ").toLowerCase();
      var s = Math.random() * 3;
      liked.forEach(function (t) { if (text.indexOf(t) !== -1) s += 2; });
      if ((prefs.dislikes || []).length && A.matchesAny(d, prefs.dislikes)) s -= 20;
      s -= (counts[d.id] || 0) * 1.5;
      return { d: d, s: s };
    }).sort(function (a, b) { return b.s - a.s; });

    var chosen = scored[0].d;
    if (!A.isDishSafe(chosen, exp)) return null; // belt and braces: never return an unsafe dish
    return chosen;
  }

  function slotKey(day, meal) { return day + "-" + meal; }

  /* menu: { meals:[...], days: [ {breakfast: id|null, ...} x7 ] }; locked: {"0-lunch": true} */
  function generateMenu(prefs, prev, locked) {
    var meals = MEALS.filter(function (m) { return (prefs.meals || []).indexOf(m) !== -1; });
    var exp = A.expandAllergies(prefs.allergies);
    var counts = {}, days = [];
    for (var i = 0; i < 7; i++) days.push({});

    // Keep locked meals first (only if still safe with the current allergies).
    if (prev && locked) {
      Object.keys(locked).forEach(function (k) {
        if (!locked[k]) return;
        var parts = k.split("-"), di = +parts[0], m = parts[1];
        var id = prev.days[di] && prev.days[di][m];
        var d = id && dishById(id);
        if (d && meals.indexOf(m) !== -1 && A.isDishSafe(d, exp)) {
          days[di][m] = id; counts[id] = (counts[id] || 0) + 1;
        }
      });
    }
    for (var day = 0; day < 7; day++) {
      meals.forEach(function (m) {
        if (days[day][m]) return;
        var sameDay = meals.map(function (x) { return days[day][x]; }).filter(Boolean);
        var d = pickDish(m, prefs, counts, sameDay);
        days[day][m] = d ? d.id : null;
        if (d) counts[d.id] = (counts[d.id] || 0) + 1;
      });
    }
    return { meals: meals, days: days };
  }

  function swapMeal(menu, day, meal, prefs) {
    var counts = {};
    menu.days.forEach(function (dd, i) {
      menu.meals.forEach(function (m) { if (dd[m] && !(i === day && m === meal)) counts[dd[m]] = (counts[dd[m]] || 0) + 1; });
    });
    var exclude = menu.meals.map(function (m) { return menu.days[day][m]; }).filter(Boolean);
    var d = pickDish(meal, prefs, counts, exclude);
    menu.days[day][meal] = d ? d.id : null;
    return menu;
  }

  g.MenuGen = { DAYS: DAYS, MEALS: MEALS, dishById: dishById, pickDish: pickDish, generateMenu: generateMenu, swapMeal: swapMeal, slotKey: slotKey, equipmentOk: equipmentOk };
})(typeof window !== "undefined" ? window : globalThis);
