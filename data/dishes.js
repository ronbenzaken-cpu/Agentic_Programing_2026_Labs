/* Dish database. Every dish lists ALL ingredients and its allergen tags.
 * Allergen tags use the canonical groups in js/allergens.js:
 *   peanuts, tree nuts, dairy, eggs, fish, shellfish, gluten, soy, sesame
 * equipment: stove, oven, microwave, airfryer, grill ([] = no cooking needed)
 * difficulty: beginner | intermediate | advanced */
(function (g) {
  var id = 0;
  function D(name, emoji, meals, ingredients, allergens, categories, time, difficulty, equipment) {
    id += 1;
    return {
      id: "d" + id, name: name, emoji: emoji, meals: meals, ingredients: ingredients,
      allergens: allergens, categories: categories, time: time, difficulty: difficulty, equipment: equipment
    };
  }
  var B = ["breakfast"], L = ["lunch"], N = ["dinner"], S = ["snack"];

  g.DISHES = [
    /* ---------- Breakfast ---------- */
    D("Scrambled Eggs on Toast", "🍳", B, ["eggs", "butter", "wheat bread", "chives"], ["eggs", "dairy", "gluten"], ["protein", "carbs", "dairy"], 10, "beginner", ["stove"]),
    D("Overnight Oats with Berries", "🥣", B, ["rolled oats", "milk", "mixed berries", "honey", "chia seeds"], ["dairy"], ["carbs", "fruit", "dairy"], 5, "beginner", []),
    D("Greek Yogurt Parfait", "🍨", B.concat(S), ["greek yogurt", "granola", "strawberries", "honey"], ["dairy", "gluten"], ["dairy", "fruit", "carbs"], 5, "beginner", []),
    D("Banana Pancakes", "🥞", B, ["wheat flour", "eggs", "milk", "banana", "butter", "maple syrup"], ["gluten", "eggs", "dairy"], ["carbs", "fruit", "dairy"], 20, "beginner", ["stove"]),
    D("Veggie Omelette", "🍳", B, ["eggs", "bell pepper", "spinach", "onion", "olive oil"], ["eggs"], ["protein", "vegetables"], 15, "beginner", ["stove"]),
    D("Avocado Toast", "🥑", B, ["sourdough bread", "avocado", "lemon", "chili flakes"], ["gluten"], ["carbs", "fruit"], 8, "beginner", ["stove"]),
    D("Tofu Scramble", "🌱", B, ["firm tofu", "turmeric", "spinach", "tomato", "olive oil"], ["soy"], ["protein", "vegetables"], 15, "beginner", ["stove"]),
    D("Peanut Butter Banana Smoothie", "🥤", B.concat(S), ["banana", "peanut butter", "oat milk", "cocoa powder"], ["peanuts"], ["fruit"], 5, "beginner", []),
    D("Shakshuka", "🍅", B, ["eggs", "tomatoes", "bell pepper", "onion", "garlic", "cumin", "olive oil"], ["eggs"], ["protein", "vegetables"], 25, "intermediate", ["stove"]),
    D("Fruit Salad with Mint", "🍓", B.concat(S), ["apple", "orange", "grapes", "mango", "mint", "lime"], [], ["fruit"], 10, "beginner", []),
    D("Quinoa Breakfast Bowl", "🥣", B, ["quinoa", "almond milk", "blueberries", "cinnamon", "maple syrup"], ["tree nuts"], ["carbs", "fruit"], 20, "beginner", ["stove"]),
    D("Cottage Cheese & Pineapple Bowl", "🍍", B.concat(S), ["cottage cheese", "pineapple", "pumpkin seeds"], ["dairy"], ["dairy", "fruit"], 5, "beginner", []),
    D("Smoked Salmon Bagel", "🥯", B, ["bagel", "cream cheese", "smoked salmon", "capers", "red onion"], ["gluten", "dairy", "fish"], ["protein", "carbs", "dairy"], 10, "beginner", []),
    D("Sweet Potato Hash", "🍠", B, ["sweet potato", "onion", "bell pepper", "black beans", "olive oil", "paprika"], [], ["carbs", "vegetables", "protein"], 30, "intermediate", ["stove"]),
    D("Baked Egg Muffins", "🧁", B, ["eggs", "spinach", "cheddar cheese", "bell pepper"], ["eggs", "dairy"], ["protein", "vegetables", "dairy"], 25, "beginner", ["oven"]),
    D("Savory Rice Porridge", "🍚", B, ["rice", "ginger", "scallions", "sesame oil", "soy sauce"], ["sesame", "soy", "gluten"], ["carbs"], 30, "beginner", ["stove"]),
    D("Air Fryer French Toast Sticks", "🍞", B, ["wheat bread", "eggs", "milk", "cinnamon", "maple syrup"], ["gluten", "eggs", "dairy"], ["carbs", "dairy"], 12, "beginner", ["airfryer"]),
    D("Microwave Apple Oatmeal", "🥣", B, ["rolled oats", "water", "apple", "cinnamon", "raisins"], [], ["carbs", "fruit"], 5, "beginner", ["microwave"]),
    D("Berry Smoothie", "🫐", B.concat(S), ["mixed berries", "banana", "oat milk", "flax seeds"], [], ["fruit"], 5, "beginner", []),

    /* ---------- Lunch ---------- */
    D("Chicken Caesar Salad", "🥗", L, ["chicken breast", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing", "egg yolk", "anchovies"], ["dairy", "gluten", "eggs", "fish"], ["protein", "vegetables", "dairy"], 20, "beginner", ["stove"]),
    D("Quinoa Chickpea Salad", "🥗", L, ["quinoa", "chickpeas", "cucumber", "tomato", "red onion", "lemon", "olive oil", "parsley"], [], ["protein", "carbs", "vegetables"], 20, "beginner", ["stove"]),
    D("Turkey & Avocado Wrap", "🌯", L, ["flour tortilla", "turkey breast", "avocado", "lettuce", "tomato"], ["gluten"], ["protein", "carbs", "vegetables"], 10, "beginner", []),
    D("Red Lentil Soup", "🍲", L.concat(N), ["red lentils", "carrot", "onion", "celery", "garlic", "cumin", "vegetable broth"], [], ["protein", "vegetables"], 35, "beginner", ["stove"]),
    D("Tuna Salad Sandwich", "🥪", L, ["canned tuna", "mayonnaise", "celery", "wheat bread", "lettuce"], ["fish", "eggs", "gluten"], ["protein", "carbs"], 10, "beginner", []),
    D("Caprese Salad", "🍅", L, ["tomatoes", "mozzarella", "basil", "olive oil", "balsamic vinegar"], ["dairy"], ["vegetables", "dairy"], 10, "beginner", []),
    D("Hummus Veggie Plate", "🥙", L, ["hummus", "tahini", "chickpeas", "carrot", "cucumber", "bell pepper", "pita bread"], ["sesame", "gluten"], ["protein", "carbs", "vegetables"], 10, "beginner", []),
    D("Chicken Rice Bowl", "🍚", L.concat(N), ["chicken thigh", "rice", "broccoli", "carrot", "garlic", "olive oil"], [], ["protein", "carbs", "vegetables"], 30, "beginner", ["stove"]),
    D("Tomato Basil Pasta", "🍝", L.concat(N), ["pasta", "tomatoes", "garlic", "basil", "olive oil", "parmesan cheese"], ["gluten", "dairy"], ["carbs", "vegetables", "dairy"], 20, "beginner", ["stove"]),
    D("Black Bean Burrito Bowl", "🌯", L, ["black beans", "rice", "corn", "tomato salsa", "avocado", "lime", "cilantro"], [], ["protein", "carbs", "vegetables"], 25, "beginner", ["stove"]),
    D("Shrimp Tacos", "🌮", L.concat(N), ["shrimp", "corn tortillas", "cabbage", "lime", "avocado", "chili powder"], ["shellfish"], ["protein", "carbs", "vegetables"], 20, "intermediate", ["stove"]),
    D("Greek Salad", "🥗", L, ["cucumber", "tomatoes", "red onion", "kalamata olives", "feta cheese", "olive oil", "oregano"], ["dairy"], ["vegetables", "dairy"], 10, "beginner", []),
    D("Air Fryer Falafel Pita", "🧆", L, ["chickpeas", "parsley", "onion", "garlic", "cumin", "pita bread", "tahini"], ["gluten", "sesame"], ["protein", "carbs"], 30, "intermediate", ["airfryer"]),
    D("Sesame Soba Noodles", "🍜", L, ["soba noodles", "wheat flour", "soy sauce", "sesame oil", "cucumber", "edamame", "scallions"], ["gluten", "soy", "sesame"], ["carbs", "vegetables"], 20, "intermediate", ["stove"]),
    D("Microwave Jacket Potato with Beans", "🥔", L, ["potato", "baked beans", "cheddar cheese", "butter"], ["dairy"], ["carbs", "protein", "dairy"], 15, "beginner", ["microwave"]),
    D("Grilled Chicken Salad", "🥗", L, ["chicken breast", "mixed greens", "cherry tomatoes", "cucumber", "lemon", "olive oil"], [], ["protein", "vegetables"], 25, "beginner", ["grill"]),
    D("Minestrone Soup", "🍲", L, ["zucchini", "carrot", "celery", "onion", "tomatoes", "cannellini beans", "small pasta", "vegetable broth"], ["gluten"], ["vegetables", "carbs"], 40, "beginner", ["stove"]),
    D("Egg Fried Rice", "🍳", L.concat(N), ["rice", "eggs", "peas", "carrot", "scallions", "soy sauce", "sesame oil"], ["eggs", "soy", "gluten", "sesame"], ["carbs", "protein", "vegetables"], 20, "intermediate", ["stove"]),
    D("Microwave Veggie Quesadilla", "🫓", L.concat(N), ["flour tortilla", "cheddar cheese", "black beans", "bell pepper", "tomato salsa"], ["gluten", "dairy"], ["carbs", "dairy", "vegetables"], 10, "beginner", ["microwave"]),
    D("Rainbow Rice Noodle Salad", "🥗", L, ["rice noodles", "carrot", "cucumber", "mango", "mint", "lime", "cilantro"], [], ["carbs", "vegetables", "fruit"], 15, "beginner", ["stove"]),

    /* ---------- Dinner ---------- */
    D("Baked Salmon with Veggies", "🐟", N, ["salmon fillet", "broccoli", "lemon", "garlic", "olive oil", "potatoes"], ["fish"], ["protein", "vegetables", "carbs"], 30, "beginner", ["oven"]),
    D("Beef Stir-Fry", "🥩", N, ["beef strips", "bell pepper", "broccoli", "soy sauce", "ginger", "garlic", "rice"], ["soy", "gluten"], ["protein", "vegetables", "carbs"], 25, "intermediate", ["stove"]),
    D("Spaghetti Bolognese", "🍝", N, ["spaghetti", "ground beef", "tomatoes", "onion", "carrot", "garlic", "parmesan cheese"], ["gluten", "dairy"], ["protein", "carbs", "vegetables"], 45, "intermediate", ["stove"]),
    D("Chicken Curry", "🍛", N, ["chicken thigh", "coconut milk", "curry powder", "onion", "garlic", "ginger", "tomatoes", "rice"], [], ["protein", "carbs", "vegetables"], 40, "intermediate", ["stove"]),
    D("Vegetable Lasagna", "🧀", N, ["lasagna sheets", "ricotta cheese", "mozzarella", "spinach", "zucchini", "tomato sauce"], ["gluten", "dairy"], ["carbs", "vegetables", "dairy"], 75, "advanced", ["oven"]),
    D("Grilled Steak & Sweet Potato", "🥩", N, ["beef steak", "sweet potato", "green beans", "olive oil", "rosemary"], [], ["protein", "carbs", "vegetables"], 35, "intermediate", ["grill"]),
    D("Thai Peanut Noodles", "🥜", N, ["rice noodles", "peanuts", "peanut sauce", "soy sauce", "lime", "carrot", "cabbage"], ["peanuts", "soy", "gluten"], ["carbs", "vegetables"], 25, "intermediate", ["stove"]),
    D("Tofu & Veggie Stir-Fry", "🥦", N, ["firm tofu", "broccoli", "bell pepper", "snap peas", "tamari", "ginger", "rice"], ["soy"], ["protein", "vegetables", "carbs"], 25, "beginner", ["stove"]),
    D("Lemon Herb Roast Chicken", "🍗", N, ["whole chicken", "lemon", "garlic", "thyme", "potatoes", "carrot", "olive oil"], [], ["protein", "carbs", "vegetables"], 90, "advanced", ["oven"]),
    D("Fish Tacos", "🌮", N, ["white fish (cod)", "corn tortillas", "cabbage", "lime", "yogurt sauce"], ["fish", "dairy"], ["protein", "carbs", "vegetables"], 25, "intermediate", ["stove"]),
    D("Stuffed Bell Peppers", "🫑", N, ["bell pepper", "ground turkey", "rice", "tomatoes", "onion", "cheddar cheese"], ["dairy"], ["protein", "carbs", "vegetables"], 50, "intermediate", ["oven"]),
    D("Chickpea & Spinach Curry", "🍛", N, ["chickpeas", "spinach", "coconut milk", "tomatoes", "onion", "garlic", "curry powder", "rice"], [], ["protein", "vegetables", "carbs"], 30, "beginner", ["stove"]),
    D("Garlic Butter Shrimp Linguine", "🍤", N, ["shrimp", "linguine", "butter", "garlic", "parsley", "lemon"], ["shellfish", "gluten", "dairy"], ["protein", "carbs"], 25, "intermediate", ["stove"]),
    D("Air Fryer Chicken & Veg", "🍗", N, ["chicken breast", "zucchini", "bell pepper", "paprika", "olive oil"], [], ["protein", "vegetables"], 25, "beginner", ["airfryer"]),
    D("Mushroom Risotto", "🍄", N, ["arborio rice", "mushrooms", "onion", "vegetable broth", "parmesan cheese", "butter"], ["dairy"], ["carbs", "vegetables", "dairy"], 45, "advanced", ["stove"]),
    D("Beef & Bean Chili", "🌶️", N, ["ground beef", "kidney beans", "tomatoes", "onion", "bell pepper", "chili powder", "cumin"], [], ["protein", "vegetables"], 50, "intermediate", ["stove"]),
    D("Grilled Halloumi Skewers", "🍢", N, ["halloumi cheese", "zucchini", "red onion", "cherry tomatoes", "olive oil"], ["dairy"], ["dairy", "vegetables"], 20, "beginner", ["grill"]),
    D("Teriyaki Salmon Bowl", "🍣", N, ["salmon", "teriyaki sauce", "soy sauce", "rice", "edamame", "sesame seeds"], ["fish", "soy", "gluten", "sesame"], ["protein", "carbs"], 25, "intermediate", ["stove"]),
    D("Sheet-Pan Sausage & Veggies", "🌭", N, ["pork sausages (may contain wheat)", "potatoes", "bell pepper", "red onion", "olive oil"], ["gluten"], ["protein", "carbs", "vegetables"], 40, "beginner", ["oven"]),
    D("Pesto Pasta with Chicken", "🌿", N, ["pasta", "basil pesto", "pine nuts", "parmesan cheese", "chicken breast"], ["gluten", "dairy", "tree nuts"], ["protein", "carbs", "dairy"], 25, "intermediate", ["stove"]),
    D("Lentil Ragu over Polenta", "🍲", N, ["brown lentils", "tomatoes", "carrot", "onion", "garlic", "polenta"], [], ["protein", "vegetables", "carbs"], 40, "beginner", ["stove"]),
    D("Grilled Turkey Burgers", "🍔", N, ["ground turkey", "lettuce", "tomato", "red onion", "sweet potato"], [], ["protein", "vegetables", "carbs"], 30, "intermediate", ["grill"]),
    D("Couscous with Roasted Vegetables", "🥘", N, ["couscous", "zucchini", "bell pepper", "red onion", "chickpeas", "olive oil"], ["gluten"], ["carbs", "vegetables", "protein"], 35, "beginner", ["oven"]),
    D("Pan-Seared Cod with Rice", "🐟", N, ["cod fillet", "rice", "green beans", "lemon", "olive oil"], ["fish"], ["protein", "carbs", "vegetables"], 25, "intermediate", ["stove"]),

    /* ---------- Snacks ---------- */
    D("Apple Slices & Peanut Butter", "🍎", S, ["apple", "peanut butter"], ["peanuts"], ["fruit"], 5, "beginner", []),
    D("Hummus & Carrot Sticks", "🥕", S, ["hummus", "tahini", "carrot"], ["sesame"], ["vegetables", "protein"], 5, "beginner", []),
    D("Trail Mix", "🥜", S, ["almonds", "cashews", "raisins", "dark chocolate chips (milk)", "sunflower seeds"], ["tree nuts", "dairy"], ["fruit"], 5, "beginner", []),
    D("Greek Yogurt with Honey & Walnuts", "🍯", S, ["greek yogurt", "honey", "walnuts"], ["dairy", "tree nuts"], ["dairy"], 3, "beginner", []),
    D("Edamame with Sea Salt", "🫛", S, ["edamame", "sea salt"], ["soy"], ["protein", "vegetables"], 8, "beginner", ["stove"]),
    D("Cheese & Crackers", "🧀", S, ["cheddar cheese", "wheat crackers", "grapes"], ["dairy", "gluten"], ["dairy", "carbs", "fruit"], 5, "beginner", []),
    D("Banana Oat Cookies", "🍪", S, ["banana", "rolled oats", "raisins", "cinnamon"], [], ["fruit", "carbs"], 20, "beginner", ["oven"]),
    D("Crispy Air Fryer Chickpeas", "🫘", S, ["chickpeas", "olive oil", "paprika", "sea salt"], [], ["protein"], 15, "beginner", ["airfryer"]),
    D("Fresh Fruit Cup", "🍇", S, ["grapes", "strawberries", "kiwi", "orange"], [], ["fruit"], 5, "beginner", []),
    D("Rice Cakes with Avocado", "🥑", S, ["rice cakes", "avocado", "cherry tomatoes", "lemon"], [], ["carbs", "fruit"], 5, "beginner", []),
    D("Hard-Boiled Eggs", "🥚", S, ["eggs", "salt", "black pepper"], ["eggs"], ["protein"], 12, "beginner", ["stove"]),
    D("Microwave Popcorn", "🍿", S, ["popcorn kernels", "olive oil", "salt"], [], ["carbs"], 5, "beginner", ["microwave"]),
    D("Cucumber Tuna Bites", "🥒", S, ["cucumber", "canned tuna", "lemon", "dill"], ["fish"], ["protein", "vegetables"], 10, "beginner", []),
    D("Mango Lassi", "🥭", S, ["mango", "yogurt", "milk", "cardamom"], ["dairy"], ["fruit", "dairy"], 5, "beginner", []),
    D("Veggie Sticks & Guacamole", "🥑", S, ["avocado", "lime", "bell pepper", "cucumber", "carrot", "cilantro"], [], ["vegetables", "fruit"], 10, "beginner", [])
  ];
})(typeof window !== "undefined" ? window : globalThis);
