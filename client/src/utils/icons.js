function extractImageName(filePath) {
    const regex = /\/([^.]+)\.png/; // The regular expression pattern
    const match = filePath.match(regex);
  
    if (match) {
      return match[1]; // Return the captured group (name)
    } else {
      return null; // Return null if the format doesn't match
    }
  }
const icons = require.context("../assets/icons", true);
const iconsList = ["astronaut", "cat", "chicken", "dog", "fox", "meerkat", "owl", "panda", "robot", "tiger"];
let iconSrcList = {};
icons.keys().map((icon) => {
     iconSrcList = {...iconSrcList, [extractImageName(icon)]:icons(icon)}
});
// console.log(iconSrcList);
export {iconSrcList};
export default iconsList;