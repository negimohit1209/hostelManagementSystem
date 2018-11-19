

function compare(a, b) {
  const genreA = a.priority
  const genreB = b.priority
  let comparison = 0;
  if (genreA > genreB) {
    comparison = 1;
  } else if (genreA < genreB) {
    comparison = -1;
  }
  return comparison;
}

module.exports = compare;


