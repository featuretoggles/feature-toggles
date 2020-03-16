// `
// If "ft1" toggle is used to build the application:
// {
//     "feature-2" : true,
//     "feature-3" : false // Any code wrapped with feature-3 will be removed
// }
// `

/**
 * If you wan to reassign a variable
 * please use below toggles
 */
let abc;
abc = true;
/* toggleStart(feature-3) */
abc = false;
/* toggleEnd(feature-3) */

/**
 * SWITCH CASE
 */
switch (abc) {
  case true:
    console.log("Hello");
  /* toggleStart(feature-3) */
  case false:
    console.log("Hello2");
  /* toggleEnd(feature-3) */
}

/**
 * Inside Object
 */
const obj = {
  /* toggleStart(feature-3) */
  abc: true,
  /* toggleEnd(feature-3) */
  xyz: true
};

/**
 * Object Member Function
 */
obj
  /* toggleStart(feature-3) */
  .func()
  /* toggleEnd(feature-3) */
  .func1();

/**
 * If else condition
 */

if (
  abc &&
  //toggleStart(feature-3)
  obj.abc &&
  //toggleEnd(feature-3)
  obj.abc
) {
  console.log();
}
//toggleStart(feature-3)
else if (true) {
  console.log();
}
//toggleEnd(feature-3)

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
