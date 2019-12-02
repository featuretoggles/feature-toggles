// `
// If "ft1" toggle is used to build the application:
// {
//     "feature-2" : true,
//     "feature-3" : false // Any code wrapped with feature-3 will be removed
// }
// `

function basic() {
  // toggleStart(feature-3)
  console.log("This will get remove");
  // toggleEnd(feature-3)

  // The below toggle is not available in the toggle list so that will not removed by toggle
  // toggleStart(feature-10)
  console.log("This will not remove");
  // toggleEnd(feature-10)
}

export default {
  basic
};
