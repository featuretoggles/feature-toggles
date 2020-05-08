/*
featureTogglesConfig: {
  "feature-10": false
}
*/
/* toggleStart(old-feature-3) */
import React from "react";
/* toggleEnd(old-feature-3) */
/* toggleStart(feature-3) */
import ReactDom from "react-dom";
/* toggleEnd(feature-3) */

switch (abc) {
  /* toggleStart(feature-3) */
  case false:
    console.log("Hello2");
  /* toggleEnd(feature-3) */
  /* toggleStart(old-feature-3) */
  case true:
    console.log("Hello");
  /* toggleEnd(old-feature-3) */
}
const obj1 = {
  /* toggleStart(old-feature-3) */
  xyzabc: true,
  /* toggleEnd(old-feature-3) */
  /* toggleStart(feature-3) */
  abc: true,
  /* toggleEnd(feature-3) */
  /* toggleStart(old-feature-3) */
  xyz: true,
  /* toggleEnd(old-feature-3) */
};

let abc;
abc = true;
/* toggleStart(feature-3) */
abc = flase;
/* toggleEnd(feature-3) */

switch (abc) {
  case true:
    console.log("Hello");
  /* toggleStart(feature-3) */
  case false:
    console.log("Hello2");
  /* toggleEnd(feature-3) */
}

const obj = {
  /* toggleStart(feature-3) */
  abc: true,
  /* toggleEnd(feature-3) */
  xyz: true,
};
obj
  /* toggleStart(feature-3) */
  .func()
  /* toggleEnd(feature-3) */
  .func1();
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

//toggleStart(feature-3)
if (obj.abc) {
  console.log("hello");
}
//toggleEnd(feature-3)
else {
  console.log("hello2");
  console.log("hello1");
}

//toggleStart(feature-3)
if (obj.abc)
  //toggleEnd(feature-3)
  console.log("next");

//toggleStart(feature-3)
if (obj.abc) {
  console.log("hello");
} else {
  //toggleEnd(feature-3)
  console.log("hello1");
}

class Welcome
  /* toggleStart(feature-3) */ extends React.Component /* toggleEnd(feature-3) */ {
  render() {
    return (
      <div>
        {/* toggleStart(feature-3) */}
        <h1>This feature is under development</h1>
        {/* toggleEnd(feature-3) */}
        <h1>You only see me, I am a full feature</h1>

        <h1>
          {
            /*toggleStart(feature-10)*/ "This feature is under development" /*toggleEnd(feature-10)*/
          }
          This will show
        </h1>
      </div>
    );
  }
}

Vue.component("button-counter", {
  data: function() {
    return {
      count: 0,
    };
  },
  template:
    /* toggleStart(feature-3) */
    '<button v-on:click="count++">You clicked me {{ count }} times.</button>' +
    /* toggleEnd(feature-3) */
    "",
});

export const newComponent = () => {
  return (
    <div>
      {/* toggleStart(feature-3) */}
      <h1>This feature is under development</h1>
      {/* toggleEnd(feature-3) */}

      {/*toggleStart(feature-3)*/ abc && (
        /*toggleEnd(feature-3)*/ <h1>This feature is existing feature</h1>
      )}

      <h1>You only see me, I am a full feature</h1>
      <Welcome
        /* toggleStart(old-feature-3) */
        abc="true"
        /* toggleEnd(old-feature-3) */
        /* toggleStart(feature-3) */

        hello=""
        /* toggleEnd(feature-3) */
      />

      <h1>
        {
          /*toggleStart(feature-3)*/ "This feature is under development" /*toggleEnd(feature-3)*/
        }
        This will show
      </h1>
    </div>
  );
};
export default Welcome;
