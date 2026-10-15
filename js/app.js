/* UI wiring for Weekly Plate. */
(function () {
  var A = window.Allergens, G = window.MenuGen;
  var STORE_KEY = "weeklyPlate.v1";
  var $ = function (sel) { return document.querySelector(sel); };

  var DEFAULTS = {
    allergies: [], dislikes: [], selected: { protein: [], carbs: [], vegetables: [], fruit: [], dairy: [] },
    skill: "intermediate", maxTime: 45, equipment: ["stove", "oven", "microwave"], noCook: false,
    meals: ["breakfast", "lunch", "dinner"], people: 2,
    menu: null, locked: {}, accepted: null, checked: {}, slide: 0
  };
  var state = load();

  function load() {
    var s = JSON.parse(JSON.stringify(DEFAULTS));
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (saved) Object.keys(DEFAULTS).forEach(function (k) { if (saved[k] !== undefined) s[k] = saved[k]; });
    } catch (e) { /* storage unavailable: run without persistence */ }
    return s;
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { } }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- Step 1: chips ---------- */
  function renderChips(kind) {
    var ul = $("#" + (kind === "allergies" ? "allergy" : "dislike") + "-chips");
    ul.innerHTML = state[kind].map(function (item, i) {
      return '<li class="chip ' + (kind === "allergies" ? "chip-danger" : "") + '">' + esc(item) +
        ' <button type="button" data-kind="' + kind + '" data-i="' + i + '" aria-label="Remove ' + esc(item) + '">×</button></li>';
    }).join("");
    if (kind === "allergies") renderQuick();
  }
  function addItem(kind, raw) {
    var v = A.normalize(raw).replace(/,+$/, "");
    if (!v || state[kind].indexOf(v) !== -1) return;
    state[kind].push(v);
    onPrefsChanged(kind);
  }
  function removeItem(kind, i) { state[kind].splice(i, 1); onPrefsChanged(kind); }
  function onPrefsChanged(kind) {
    renderChips(kind);
    if (kind === "allergies") { dropAllergenSelections(); renderSlides(); sanitizeMenu(); }
    save();
  }
  function renderQuick() {
    $("#quick-allergens").innerHTML = A.COMMON.map(function (a) {
      var on = state.allergies.indexOf(a) !== -1;
      return '<button type="button" class="chip quick' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-a="' + a + '">' + (on ? "✓ " : "+ ") + a + "</button>";
    }).join("");
  }
  document.querySelectorAll(".chip-input input").forEach(function (input) {
    var kind = input.parentElement.getAttribute("data-target");
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addItem(kind, input.value); input.value = ""; }
      else if (e.key === "Backspace" && !input.value && state[kind].length) removeItem(kind, state[kind].length - 1);
    });
    input.addEventListener("input", function () {
      if (input.value.indexOf(",") !== -1) { input.value.split(",").slice(0, -1).forEach(function (p) { addItem(kind, p); }); input.value = input.value.split(",").pop(); }
    });
    input.addEventListener("blur", function () { if (input.value.trim()) { addItem(kind, input.value); input.value = ""; } });
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-kind]");
    if (b) { removeItem(b.getAttribute("data-kind"), +b.getAttribute("data-i")); return; }
    var q = e.target.closest("button[data-a]");
    if (q) {
      var a = q.getAttribute("data-a"), i = state.allergies.indexOf(a);
      if (i === -1) addItem("allergies", a); else removeItem("allergies", i);
      var again = document.querySelector('button[data-a="' + a + '"]'); if (again) again.focus();
    }
  });

  /* ---------- Step 2: food carousel ---------- */
  function dropAllergenSelections() {
    var exp = A.expandAllergies(state.allergies);
    window.FOOD_CATEGORIES.forEach(function (c) {
      state.selected[c.id] = (state.selected[c.id] || []).filter(function (fid) {
        var food = window.FOODS[c.id].filter(function (f) { return f.id === fid; })[0];
        return food && !A.isFoodAllergen(food, exp);
      });
    });
  }
  function renderTabs() {
    $("#cat-tabs").innerHTML = window.FOOD_CATEGORIES.map(function (c, i) {
      var sel = i === state.slide;
      return '<button type="button" role="tab" id="tab-' + c.id + '" aria-controls="slide-' + c.id + '" aria-selected="' + sel + '" tabindex="' + (sel ? 0 : -1) + '" data-slide="' + i + '">' + c.emoji + " " + c.label + "</button>";
    }).join("");
  }
  function renderSlides() {
    var exp = A.expandAllergies(state.allergies);
    $("#slides").innerHTML = window.FOOD_CATEGORIES.map(function (c, i) {
      var cards = window.FOODS[c.id].map(function (f) {
        var allergen = A.isFoodAllergen(f, exp), checked = !allergen && state.selected[c.id].indexOf(f.id) !== -1;
        return '<label class="food-card' + (allergen ? " is-allergen" : "") + (checked ? " is-selected" : "") + '">' +
          '<input type="checkbox" data-cat="' + c.id + '" value="' + f.id + '"' + (checked ? " checked" : "") + (allergen ? " disabled" : "") +
          (allergen ? ' aria-describedby="allergen-note"' : "") + ">" +
          '<span class="food-emoji" aria-hidden="true">' + f.emoji + "</span>" +
          '<span class="food-name">' + esc(f.name) + "</span>" +
          (allergen ? '<span class="badge-allergen">allergen</span>' : '<span class="tick" aria-hidden="true">✓</span>') + "</label>";
      }).join("");
      return '<div class="slide" role="tabpanel" id="slide-' + c.id + '" aria-labelledby="tab-' + c.id + '"' + (i === state.slide ? "" : " hidden") + ">" +
        '<div class="slide-actions"><button type="button" class="btn btn-sm" data-all="' + c.id + '">Select all</button>' +
        '<button type="button" class="btn btn-sm" data-clear="' + c.id + '">Clear</button>' +
        '<span class="count">' + state.selected[c.id].length + " selected</span></div>" +
        '<div class="food-grid">' + cards + "</div></div>";
    }).join("") + '<p id="allergen-note" class="sr-only">Disabled because it matches one of your allergies.</p>';
    $("#slide-status").textContent = (state.slide + 1) + " of " + window.FOOD_CATEGORIES.length + ": " + window.FOOD_CATEGORIES[state.slide].label;
    $("#prev-slide").disabled = state.slide === 0;
    $("#next-slide").disabled = state.slide === window.FOOD_CATEGORIES.length - 1;
  }
  function goSlide(i, focusTab) {
    state.slide = Math.max(0, Math.min(window.FOOD_CATEGORIES.length - 1, i));
    renderTabs(); renderSlides(); save();
    if (focusTab) document.querySelector('[data-slide="' + state.slide + '"]').focus();
  }
  $("#cat-tabs").addEventListener("click", function (e) { var t = e.target.closest("[data-slide]"); if (t) goSlide(+t.getAttribute("data-slide")); });
  $("#cat-tabs").addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") goSlide(state.slide + 1, true);
    if (e.key === "ArrowLeft") goSlide(state.slide - 1, true);
  });
  $("#prev-slide").addEventListener("click", function () { goSlide(state.slide - 1); });
  $("#next-slide").addEventListener("click", function () { goSlide(state.slide + 1); });
  $("#slides").addEventListener("change", function (e) {
    var cb = e.target; if (!cb.matches("input[data-cat]")) return;
    var list = state.selected[cb.getAttribute("data-cat")], i = list.indexOf(cb.value);
    if (cb.checked && i === -1) list.push(cb.value);
    if (!cb.checked && i !== -1) list.splice(i, 1);
    cb.closest(".food-card").classList.toggle("is-selected", cb.checked);
    cb.closest(".slide").querySelector(".count").textContent = list.length + " selected";
    save();
  });
  $("#slides").addEventListener("click", function (e) {
    var all = e.target.closest("[data-all]"), clr = e.target.closest("[data-clear]");
    if (!all && !clr) return;
    var cat = (all || clr).getAttribute(all ? "data-all" : "data-clear"), exp = A.expandAllergies(state.allergies);
    state.selected[cat] = all ? window.FOODS[cat].filter(function (f) { return !A.isFoodAllergen(f, exp); }).map(function (f) { return f.id; }) : [];
    renderSlides(); save();
    var again = document.querySelector((all ? '[data-all="' : '[data-clear="') + cat + '"]'); if (again) again.focus();
  });

  /* ---------- Step 3: settings ---------- */
  function renderSettings() {
    document.querySelectorAll('input[name="skill"]').forEach(function (r) { r.checked = r.value === state.skill; });
    $("#max-time").value = state.maxTime; $("#max-time-out").textContent = state.maxTime + " min";
    document.querySelectorAll('input[name="equipment"]').forEach(function (c) { c.checked = state.equipment.indexOf(c.value) !== -1; c.disabled = state.noCook; });
    $("#no-cook").checked = state.noCook;
    document.querySelectorAll('input[name="meals"]').forEach(function (c) { c.checked = state.meals.indexOf(c.value) !== -1; });
    $("#people").value = state.people;
  }
  function readChecks(name) { return Array.prototype.filter.call(document.querySelectorAll('input[name="' + name + '"]'), function (c) { return c.checked; }).map(function (c) { return c.value; }); }
  $("#step-3").addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "skill") state.skill = t.value;
    if (t.name === "equipment") state.equipment = readChecks("equipment");
    if (t.id === "no-cook") state.noCook = t.checked;
    if (t.name === "meals") state.meals = readChecks("meals");
    if (t.id === "people") { state.people = clampPeople(t.value); renderShopping(); }
    renderSettings(); save();
  });
  $("#max-time").addEventListener("input", function (e) { state.maxTime = +e.target.value; $("#max-time-out").textContent = state.maxTime + " min"; save(); });
  function clampPeople(v) { v = parseInt(v, 10); return isNaN(v) ? 1 : Math.max(1, Math.min(12, v)); }
  $("#people-minus").addEventListener("click", function () { state.people = clampPeople(state.people - 1); renderSettings(); renderShopping(); save(); });
  $("#people-plus").addEventListener("click", function () { state.people = clampPeople(state.people + 1); renderSettings(); renderShopping(); save(); });
  $("#to-menu").addEventListener("click", function () { if (!state.menu) generate(false); scrollToStep(4); });

  /* ---------- Step 4: menu ---------- */
  function prefs() { return state; }
  function status(msg, kind) { var el = $("#menu-status"); el.textContent = msg; el.className = "status" + (kind ? " status-" + kind : ""); }

  function generate(keepLocked) {
    if (!state.meals.length) { status("Pick at least one meal per day in step 3.", "warn"); return; }
    if (!state.noCook && !state.equipment.length) { status("Pick some equipment in step 3 (or choose No-cook only).", "warn"); return; }
    state.menu = G.generateMenu(prefs(), keepLocked ? state.menu : null, keepLocked ? state.locked : null);
    if (!keepLocked) state.locked = {};
    state.accepted = null;
    renderMenu(); renderShopping(); save();
    var empty = countEmpty();
    status(empty ? "Menu created. " + empty + " slot(s) have no safe option – try more equipment, time or fewer exclusions." : "Here's your week! Swap or lock meals, then accept.", empty ? "warn" : "");
  }
  function countEmpty() {
    var n = 0; if (!state.menu) return 0;
    state.menu.days.forEach(function (d) { state.menu.meals.forEach(function (m) { if (!d[m]) n++; }); });
    return n;
  }
  /* If allergies change after a menu exists, replace any meal that is no longer safe. */
  function sanitizeMenu() {
    if (!state.menu) return;
    var exp = A.expandAllergies(state.allergies), changed = false;
    state.menu.days.forEach(function (d, di) {
      state.menu.meals.forEach(function (m) {
        var dish = d[m] && G.dishById(d[m]);
        if (dish && !A.isDishSafe(dish, exp)) { G.swapMeal(state.menu, di, m, prefs()); delete state.locked[G.slotKey(di, m)]; changed = true; }
      });
    });
    if (changed) { state.accepted = null; status("Your allergies changed, so affected meals were replaced. Please re-accept the menu.", "warn"); }
    renderMenu(); renderShopping();
  }

  function renderMenu() {
    var grid = $("#menu-grid"), m = state.menu;
    $("#regen-btn").disabled = !m; $("#accept-btn").disabled = !m;
    $("#generate-btn").hidden = !!m;
    if (!m) { grid.innerHTML = '<p class="empty">Your menu will appear here.</p>'; return; }
    var exp = A.expandAllergies(state.allergies);
    grid.innerHTML = m.days.map(function (day, di) {
      return '<article class="day-card" aria-labelledby="day-' + di + '"><h3 id="day-' + di + '">' + G.DAYS[di] + "</h3>" +
        m.meals.map(function (meal) {
          var key = G.slotKey(di, meal), locked = !!state.locked[key], dish = day[meal] && G.dishById(day[meal]);
          var label = meal.charAt(0).toUpperCase() + meal.slice(1);
          if (!dish || !A.isDishSafe(dish, exp)) {
            return '<div class="meal meal-empty"><div class="meal-type">' + label + '</div><p class="no-safe" role="note">⚠️ No safe option, adjust preferences</p>' +
              '<div class="meal-actions no-print"><button type="button" class="btn btn-sm" data-swap="' + key + '" aria-label="Try again for ' + G.DAYS[di] + " " + meal + '">🔄 swap</button></div></div>';
          }
          return '<div class="meal' + (locked ? " is-locked" : "") + '">' +
            '<div class="meal-type">' + label + (locked ? ' <span class="pill">🔒 locked</span>' : "") + "</div>" +
            '<div class="meal-main"><span class="meal-emoji" role="img" aria-label="' + esc(dish.name) + '">' + dish.emoji + "</span>" +
            '<div><div class="meal-name">' + esc(dish.name) + "</div>" +
            '<div class="meal-meta">⏱ ' + dish.time + " min · " + dish.difficulty + "</div></div></div>" +
            '<p class="meal-ings">' + esc(dish.ingredients.slice(0, 5).join(", ")) + (dish.ingredients.length > 5 ? "…" : "") + "</p>" +
            '<div class="meal-actions no-print">' +
            '<button type="button" class="btn btn-sm" data-swap="' + key + '"' + (locked ? " disabled" : "") + ' aria-label="Swap ' + G.DAYS[di] + " " + meal + '">🔄 swap</button>' +
            '<button type="button" class="btn btn-sm" data-lock="' + key + '" aria-pressed="' + locked + '" aria-label="' + (locked ? "Unlock " : "Lock ") + G.DAYS[di] + " " + meal + '">' + (locked ? "🔒 locked" : "🔓 lock") + "</button>" +
            "</div></div>";
        }).join("") + "</article>";
    }).join("");
    if (state.accepted) status("✅ Menu accepted and saved! Your shopping list is ready below.", "ok");
  }
  $("#menu-grid").addEventListener("click", function (e) {
    var s = e.target.closest("[data-swap]"), l = e.target.closest("[data-lock]");
    if (!s && !l) return;
    var key = (s || l).getAttribute(s ? "data-swap" : "data-lock"), parts = key.split("-");
    if (s) { G.swapMeal(state.menu, +parts[0], parts[1], prefs()); state.accepted = null; status("Meal swapped. Accept the menu when you're happy.", ""); }
    else state.locked[key] = !state.locked[key];
    renderMenu(); renderShopping(); save();
    var again = document.querySelector('[data-' + (s ? "swap" : "lock") + '="' + key + '"]'); if (again) again.focus();
  });
  $("#generate-btn").addEventListener("click", function () { generate(false); });
  $("#regen-btn").addEventListener("click", function () { generate(true); });
  $("#accept-btn").addEventListener("click", function () {
    state.accepted = JSON.parse(JSON.stringify(state.menu)); state.checked = {};
    save(); renderMenu(); renderShopping();
    status("✅ Menu accepted and saved! Your shopping list is ready below.", "ok");
  });
  $("#print-btn").addEventListener("click", function () { window.print(); });

  /* ---------- Step 5: shopping list ---------- */
  function groupFor(ing) {
    var t = ing.toLowerCase(), groups = window.SHOPPING_GROUPS;
    if (t.indexOf("peanut butter") !== -1) return "Pantry & spices";
    for (var i = 0; i < groups.length; i++) if (groups[i].keys.some(function (k) { return t.indexOf(k) !== -1; })) return groups[i].label;
    return "Pantry & spices";
  }
  function renderShopping() {
    var box = $("#shopping"), m = state.accepted;
    if (!m) { box.innerHTML = '<p class="empty">Accept a menu to get your shopping list.</p>'; return; }
    var items = {};
    m.days.forEach(function (d) { m.meals.forEach(function (meal) {
      var dish = d[meal] && G.dishById(d[meal]); if (!dish) return;
      dish.ingredients.forEach(function (ing) { items[ing] = (items[ing] || 0) + 1; });
    }); });
    var order = window.SHOPPING_GROUPS.map(function (g) { return g.label; }).concat(["Pantry & spices"]);
    var emoji = {}; window.SHOPPING_GROUPS.forEach(function (g) { emoji[g.label] = g.emoji; }); emoji["Pantry & spices"] = "🧂";
    var grouped = {}; Object.keys(items).sort().forEach(function (ing) { var g = groupFor(ing); (grouped[g] = grouped[g] || []).push(ing); });
    box.innerHTML = '<p class="hint">For ' + state.people + " " + (state.people === 1 ? "person" : "people") + " · quantities shown as number of meals using the item.</p>" +
      '<div class="shop-grid">' + order.filter(function (g) { return grouped[g]; }).map(function (g) {
        return '<div class="card shop-group"><h3>' + emoji[g] + " " + g + "</h3><ul>" + grouped[g].map(function (ing) {
          var id = "shop-" + ing.replace(/[^a-z0-9]/gi, "-"), on = !!state.checked[ing];
          return '<li><label for="' + id + '"' + (on ? ' class="done"' : "") + '><input type="checkbox" id="' + id + '" data-ing="' + esc(ing) + '"' + (on ? " checked" : "") + "> " +
            esc(ing) + ' <span class="qty">×' + items[ing] + "</span></label></li>";
        }).join("") + "</ul></div>";
      }).join("") + "</div>";
  }
  $("#shopping").addEventListener("change", function (e) {
    var ing = e.target.getAttribute("data-ing"); if (!ing) return;
    state.checked[ing] = e.target.checked; e.target.parentElement.classList.toggle("done", e.target.checked); save();
  });

  /* ---------- Navigation & progress ---------- */
  function scrollToStep(n) { var el = $("#step-" + n); el.scrollIntoView({ behavior: "smooth" }); el.focus({ preventScroll: true }); }
  $("#start-btn").addEventListener("click", function () { scrollToStep(1); });
  var links = document.querySelectorAll("#progress a");
  function setCurrent(n) {
    links.forEach(function (a) {
      var s = +a.getAttribute("data-step");
      a.classList.toggle("done", s < n); a.classList.toggle("current", s === n);
      if (s === n) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setCurrent(+en.target.id.split("-")[1]); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll(".step").forEach(function (s) { io.observe(s); });
  }
  setCurrent(1);

  /* ---------- Footer ---------- */
  $("#safety-link").addEventListener("click", function (e) {
    e.preventDefault();
    var r = window.runSafetyCheck();
    $("#safety-result").innerHTML = '<p class="' + (r.passed ? "ok" : "bad") + '"><strong>' + (r.passed ? "✅ PASSED" : "❌ FAILED") + "</strong></p>" +
      "<ul><li>" + r.menus + " random menus with random allergies</li><li>" + r.mealsChecked + " meals checked</li>" +
      "<li><strong>" + r.allergenHits.length + "</strong> allergen hits</li><li>" + r.dataAuditErrors.length + " data errors</li>" +
      "<li>" + r.emptySafeSlots + " slots correctly left empty (no safe dish)</li></ul>";
    var dlg = $("#safety-dialog");
    if (dlg.showModal) dlg.showModal(); else alert($("#safety-result").textContent);
  });
  $("#reset-link").addEventListener("click", function (e) {
    e.preventDefault();
    if (!confirm("Clear all your saved preferences and menus?")) return;
    try { localStorage.removeItem(STORE_KEY); } catch (err) { }
    location.reload();
  });

  /* ---------- Init ---------- */
  dropAllergenSelections();
  renderChips("allergies"); renderChips("dislikes"); renderTabs(); renderSlides(); renderSettings();
  if (state.menu) sanitizeMenu(); else renderMenu();
  renderShopping();
})();
