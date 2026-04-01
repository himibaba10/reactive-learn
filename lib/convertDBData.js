export const replaceMongoIdInArray = (array) => {
  if (!Array.isArray(array)) {
    throw new Error('replaceMongoIdInArray function error: Expected an array');
  }

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

  if (typeof obj !== 'object') {
    throw new Error('replaceMongoIdInObject function error: Expected an object');
  }

  return JSON.parse(JSON.stringify({ ...obj, id: obj._id.toString() }));
};
