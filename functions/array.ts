export const calculateArrayVariation = (arr) => {
  let maxArray = arr.sort(function (a, b) {
    return b.y - a.y;
  });

  // Calculate the variation from smallest to biggest number
  let variation = Math.abs(maxArray[0].y - maxArray[maxArray.length - 1].y);
  return variation < 300 ? 300 : variation;
};

export const getMaxArrayObject = (arr) => {
  if (!arr || arr.length == 0) return 0;
  let maxArray = arr.sort(function (a, b) {
    return b.y - a.y;
  });

  let max = maxArray[0].y;

  return max + calculateArrayVariation(arr) * 0.6;
};

export const getMinArrayObject = (arr) => {
  if (!arr || arr.length == 0) return 0;

  let minArray = arr.sort(function (a, b) {
    return a.y - b.y;
  });

  let min = minArray[0].y;
  return min - calculateArrayVariation(arr) * 0.1;
};

export const getSumArrayObject = (arr) => {
  if (!arr || arr.length == 0) return 0;
  return arr.reduce((acc, value) => acc + parseFloat(value.y), 0);
};

export const getCombinedArray = (arr1, arr2) => {
  if (arr1 && arr1.length > 0 && arr2 && arr2.length > 0) return arr1.concat(arr2);
  else if (arr1 && arr1.length > 0) return arr1;
  else if (arr2 && arr2.length > 0) return arr2;
  else return [];
};

export const findKeyJsonArray = (arr, value) => {
  let found = arr.filter((data) => {
    return data.x == value;
  });
  return found;
};
