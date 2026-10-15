/* Foods shown on the preference slides, grouped by category.
 * `terms` are matched (case-insensitive) against dish ingredients for preference scoring
 * and against the allergen map so allergen foods can be disabled. */
(function (g) {
  g.FOOD_CATEGORIES = [
    { id: "protein", label: "Protein", emoji: "🍗" },
    { id: "carbs", label: "Carbs", emoji: "🍞" },
    { id: "vegetables", label: "Vegetables", emoji: "🥦" },
    { id: "fruit", label: "Fruit", emoji: "🍎" },
    { id: "dairy", label: "Dairy", emoji: "🧀" }
  ];

  function f(id, name, emoji, terms) { return { id: id, name: name, emoji: emoji, terms: terms || [name.toLowerCase()] }; }

  g.FOODS = {
    protein: [
      f("chicken", "Chicken", "🍗"),
      f("beef", "Beef", "🥩"),
      f("turkey", "Turkey", "🦃"),
      f("pork", "Pork", "🥓", ["pork"]),
      f("salmon", "Salmon", "🐟", ["salmon", "fish"]),
      f("tuna", "Tuna", "🐠", ["tuna", "fish"]),
      f("shrimp", "Shrimp", "🦐", ["shrimp"]),
      f("eggs", "Eggs", "🥚", ["egg"]),
      f("tofu", "Tofu", "🍱", ["tofu"]),
      f("lentils", "Lentils", "🫘", ["lentil"]),
      f("chickpeas", "Chickpeas", "🧆", ["chickpea"]),
      f("beans", "Beans", "🫘", ["beans"])
    ],
    carbs: [
      f("rice", "Rice", "🍚"),
      f("pasta", "Pasta", "🍝", ["pasta", "spaghetti", "linguine", "lasagna"]),
      f("bread", "Bread", "🍞", ["bread", "bagel", "pita"]),
      f("oats", "Oats", "🌾", ["oats"]),
      f("quinoa", "Quinoa", "🥣"),
      f("potatoes", "Potatoes", "🥔", ["potato"]),
      f("sweet-potato", "Sweet potato", "🍠", ["sweet potato"]),
      f("tortillas", "Tortillas", "🌮", ["tortilla"]),
      f("couscous", "Couscous", "🥙"),
      f("noodles", "Noodles", "🍜", ["noodle"])
    ],
    vegetables: [
      f("broccoli", "Broccoli", "🥦"),
      f("spinach", "Spinach", "🥬"),
      f("tomato", "Tomato", "🍅"),
      f("bell-pepper", "Bell pepper", "🫑"),
      f("carrot", "Carrot", "🥕"),
      f("zucchini", "Zucchini", "🥒"),
      f("mushrooms", "Mushrooms", "🍄", ["mushroom"]),
      f("onion", "Onion", "🧅"),
      f("cucumber", "Cucumber", "🥒"),
      f("lettuce", "Lettuce", "🥗", ["lettuce", "greens"]),
      f("corn", "Corn", "🌽"),
      f("green-beans", "Green beans", "🫛", ["green beans", "snap peas", "peas"])
    ],
    fruit: [
      f("banana", "Banana", "🍌"),
      f("apple", "Apple", "🍎"),
      f("berries", "Berries", "🫐", ["berries", "blueberr", "strawberr"]),
      f("orange", "Orange", "🍊"),
      f("mango", "Mango", "🥭"),
      f("avocado", "Avocado", "🥑"),
      f("lemon", "Lemon / lime", "🍋", ["lemon", "lime"]),
      f("grapes", "Grapes", "🍇", ["grape"]),
      f("pineapple", "Pineapple", "🍍")
    ],
    dairy: [
      f("milk", "Milk", "🥛"),
      f("cheese", "Cheese", "🧀"),
      f("yogurt", "Yogurt", "🍦", ["yogurt"]),
      f("butter", "Butter", "🧈"),
      f("feta", "Feta", "🧀"),
      f("mozzarella", "Mozzarella", "🍕"),
      f("cottage", "Cottage cheese", "🥣", ["cottage cheese"]),
      f("almond-milk", "Almond milk", "🌰", ["almond milk"]),
      f("oat-milk", "Oat milk", "🥛", ["oat milk"]),
      f("soy-milk", "Soy milk", "🥛", ["soy milk"])
    ]
  };

  /* Shopping-list grouping: first matching keyword wins, otherwise "Pantry & spices". */
  g.SHOPPING_GROUPS = [
    { label: "Protein", emoji: "🍗", keys: ["chicken", "beef", "turkey", "pork", "sausage", "salmon", "tuna", "cod", "fish", "shrimp", "tofu", "lentil", "chickpea", "beans", "edamame", "anchov"] },
    { label: "Dairy & eggs", emoji: "🧀", keys: ["milk", "cheese", "yogurt", "butter", "cream", "feta", "mozzarella", "parmesan", "ricotta", "halloumi", "egg"] },
    { label: "Grains & bread", emoji: "🍞", keys: ["rice", "pasta", "spaghetti", "linguine", "lasagna", "bread", "bagel", "pita", "tortilla", "oats", "quinoa", "couscous", "noodle", "flour", "cracker", "crouton", "granola", "polenta", "popcorn"] },
    { label: "Fruit & vegetables", emoji: "🥦", keys: ["broccoli", "spinach", "tomato", "pepper", "carrot", "zucchini", "mushroom", "onion", "cucumber", "lettuce", "greens", "corn", "peas", "green beans", "cabbage", "celery", "potato", "garlic", "ginger", "scallion", "avocado", "banana", "apple", "berr", "orange", "mango", "lemon", "lime", "grape", "pineapple", "kiwi", "raisin", "basil", "parsley", "cilantro", "mint", "dill", "chives", "rosemary", "thyme", "olives"] }
  ];
})(typeof window !== "undefined" ? window : globalThis);
