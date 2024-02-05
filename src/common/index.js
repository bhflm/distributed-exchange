
// Define request object like 
export function createEnum(values) {
  const enumObject = {};
  for (const val of values) {
    enumObject[val] = val;
  }
  return Object.freeze(enumObject);
};



const requestConfig = {
  type,
  assetId,
  amount // buy / sell 
};


module.exports = {

};