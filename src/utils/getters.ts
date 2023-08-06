export const getEnumValues = <T>(thing: T) => {
  const array: (string | number)[] = [];
  for (let value in thing) {
    if (isNaN(Number(value))) {
      array.push(thing[value] as string);
    }
  }
  return array;
};
