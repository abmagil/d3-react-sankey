import { flatMap } from 'lodash'

export const calculateData = (data) => {
  const sankeyData = {
    nodes: [],
    links: [],
  };

  // TODO: Rewrite to be recursive 
  sankeyData.nodes = flatMap(
    Object.entries(data), // ["entertainment", {movies: 10, games: 20}]
    ([category, subcategories]) => {
      return [
        {name: category},
        ...Object.entries(subcategories).map(([subcategory, _expense]) => {
          return { name: subcategory}
        })
      ]
    }
  );
  sankeyData.nodes.push({name: "total"})

  const accumulatedLinks = [];
  Object.entries(data).forEach(([category, subcategories]) => {
    let newLink = {
      source: category,
      target: "total",
      value: 0
    };
    Object.entries(subcategories).forEach(([subcategory, value]) => {
      newLink.value = newLink.value + value;
      accumulatedLinks.push({
        source: subcategory,
        target: category,
        value
      });
    });
    accumulatedLinks.push(newLink);
  });
  sankeyData.links = accumulatedLinks;

  return sankeyData;
}
