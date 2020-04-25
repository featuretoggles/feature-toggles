/*
featureTogglesConfig: {
  "feature-10": false
}
*/
import React from "react";

/* toggleStart(feature-10) */
import ReactDom from "react-dom";
/* toggleEnd(feature-10) */

class Welcome extends React.Component {
  render() {
    return (
      <div>
        {/*toggleStart(feature-10)*/}

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
export const newComponent = () => {
  return (
    <div>


      {<h1>This feature is existing feature</h1>}
      <h1>You only see me, I am a full feature</h1>
      <Welcome abc="true" />
      <h1>
        {"This feature is under development"}
        This will show
      </h1>
    </div>
  );
};
export default Welcome;
