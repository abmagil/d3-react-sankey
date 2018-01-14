const defaultCategories = {
  entertainment: [
    "games",
    "movies",
    "sports",
    "other entertainment"
  ],
  investing: [
    "retirement",
    "betterment",
    "other investments"
  ]
}

export default function() {
  return Object.entries(defaultCategories).reduce((categoryAcc, categoryCur) => {
    const [category, subcategories] = categoryCur;
    
    let i = 0;
    categoryAcc[category] = subcategories.reduce((subcatgoryAcc, subcategoryCur) => {
      i++;
      subcatgoryAcc[subcategoryCur] = 20 * i;
      return subcatgoryAcc;
    }, {})
    return categoryAcc;
  }, {})
}
