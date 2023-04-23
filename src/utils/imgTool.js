const getAssetsFile = (url) => {
  return new URL(`../assets/images/overview/${url}`, import.meta.url).href;
};
 
export default {
  getAssetsFile,
};