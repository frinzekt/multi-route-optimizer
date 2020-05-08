import _ from "lodash";

const generatePermutation = (array) => {
  // RECURSION: the permutation of an element is just a split of a part of the element + permutation of the rest of the element
  if (!array.length) return [[]];
  return array.flatMap((element, index) => {
    // PASSING EVERY ELEMENT BEFORE AND AFTER THE CURRENT ELEMENT INDEX
    return generatePermutation([
      ...array.slice(0, index),
      ...array.slice(index + 1),
    ]).map((otherElements) => [element, ...otherElements]); // COMBINING THE FIRST ELEMENT WITH THE REST OF THE ELEMENT
  });
};

// USES BRUTE FORCE TO TRY TO OPTIMIZE THE ROUTES
export default (adjacencyMatrix, isGoingBackToStart) => {
  // SET INDICES
  const indices = _.range(adjacencyMatrix.length);

  // INDICES PERMUTATION With the Same Starting
  let permutations = generatePermutation(
    indices.slice(1, indices.length)
  ).map((elements) => [indices[0], ...elements]);

  // Indices Permutation With The Ending as The Starting
  if (isGoingBackToStart) {
    permutations = permutations.map((elements) => [...elements, indices[0]]);
  }
  const weightsForAllPermutations = permutations.map((permutation) => {
    // TIME AND DISTANCE IS SPECIFIED AS WEIGHT
    // adjacencyMatrix[originIndex][]
    let totalTime = 0;
    let totalDistance = 0;
    const timeElapsedBetween = [];
    const distanceTravelledBetween = [];

    for (let i = 0; i < permutation.length - 1; i++) {
      const originIndex = permutation[i];
      const destinationIndex = permutation[i + 1];
      totalTime += adjacencyMatrix[originIndex][destinationIndex].time;
      totalDistance += adjacencyMatrix[originIndex][destinationIndex].distance;

      timeElapsedBetween.push(
        adjacencyMatrix[originIndex][destinationIndex].time
      );
      distanceTravelledBetween.push(
        adjacencyMatrix[originIndex][destinationIndex].distance
      );
    }
    return {
      totalTime,
      totalDistance,
      timeElapsedBetween,
      distanceTravelledBetween,
    };
  });

  // BUNDLING THE PERMUTATION CALCULATION FOR THE API
  const routeCalculation = permutations.map((permutation, index) => ({
    order: permutation,
    weight: weightsForAllPermutations[index],
  }));

  // SORTING THE ROUTE FROM THE ONE WITH THE LOWEST WEIGHT TO THE HEIGHEST
  return routeCalculation.sort((first, second) => {
    if (first.weight.totalTime < second.weight.totalTime) {
      return -1;
    } else {
      return 1;
    }
  });
};
