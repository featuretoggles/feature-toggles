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
  case false:
    console.log("Hello2");
  /* toggleStart(old-feature-3) */
  case true:
    console.log("Hello");
  /* toggleEnd(old-feature-3) */
}

const obj1 = {
  abc: true,
  /* toggleStart(old-feature-3) */
  xyz: true
  /* toggleEnd(old-feature-3) */,
};

let abc;
abc = true;
abc = false;
switch (abc) {
case true:
  console.log("Hello");
case false:
  console.log("Hello2");
}

const obj = {
  abc: true,
  xyz: true,
};
obj
  .func()
  .func1();
if (
  abc &&
  obj.abc &&
  obj.abc
) {
  console.log();
}
else if (true) {
  console.log();
}
class Welcome extends React.Component {
  render() {
    return (
      <div>
        {}
        <h1>This feature is under development</h1>
        {}
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
    '<button v-on:click="count++">You clicked me {{ count }} times.</button>' + "",
});

export const newComponent = () => {
  return (
    <div>
      {}
      <h1>This feature is under development</h1>
      {}

      {abc && <h1>This feature is existing feature</h1>}

      <h1>You only see me, I am a full feature</h1>
      <Welcome
        /* toggleStart(old-feature-3) */
        abc="true"
        /* toggleEnd(old-feature-3) */
        hello=""
      />

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
