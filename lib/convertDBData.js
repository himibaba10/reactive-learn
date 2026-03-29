export const replaceMongoIdInArray = (array) => {
  const mappedArray = array.map((item) => {
    return {
      ...item,
      _id: item._id.toString(),
      id: item._id.toString(),
    };
  });

  return JSON.parse(JSON.stringify(mappedArray));
};

export const replaceMongoIdInObject = (obj) => {
  if (!obj) return null;

  return JSON.parse(JSON.stringify({ ...obj, id: obj._id.toString() }));
};
