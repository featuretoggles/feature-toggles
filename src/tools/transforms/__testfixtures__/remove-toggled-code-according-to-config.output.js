/*
featureTogglesConfig: {
  "feature-10": false
}
*/
import React from "react";

/* toggleStart(feature-10) */
import ReactDom from "react-dom";
/* toggleEnd(feature-10) */

switch (abc) {
/* toggleStart(old-feature-3) */
case true:
  console.log("Hello");
/* toggleEnd(old-feature-3) */
}

const obj1 = {
  /* toggleStart(old-feature-3) */
  xyz: true
  /* toggleEnd(old-feature-3) */
};

let abc;
abc = true;

switch (abc) {
case true:
  console.log("Hello");
}

const obj = {
  xyz: true
};
obj
  .func1();
if (abc &&
obj.abc) {
  console.log();
}
{
  console.log("hello2");
  console.log("hello1");
}

console.log("next");

{
  console.log("hello1");
}

class Welcome {
  render() {
    return (
      <div>

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
    "",
});

export const newComponent = () => {
  return (
    <div>

      {<h1>This feature is existing feature</h1>}
      <h1>You only see me, I am a full feature</h1>
      <Welcome
        /* toggleStart(old-feature-3) */
        abc="true"
        /* toggleEnd(old-feature-3) */ />
      <h1>
        {
          "This feature is under development"
        }
        This will show
      </h1>
    </div>
  );
};
export default Welcome;
