# Feature Toggles the best way

This tool is built to do feature toggling in a *REACT web application*.

This is a babel plugin, help to remove the toggled off feature in the build time.

> Are you struggling with the maintenance of an unfinished feature?
> Are you tired of long-running branches?
> Do you want to implement Continuous Delivery and Trunk Based Development?

## Benefits

- Best for trunk-based development
- No Long-running branches
- No Merge hell
- No release branch
- Make product delivery faster
- No release time overhead.
- Increase team collaboration.

## Cons

- Little bit complexity to the code
- Tech dept and overhead of un-maintained toggles
- Easily get massy

## Protection Required to Fix the Cons

- Establish the right mindset in the team
- One feature one toggle approach
- Automation tools for toggle off and toggle on testing
- Powerful CI/CD pipeline
- Feature toggle removal tool (solves Tech dept)
- A visual representation of the toggles inside the project folder
- Story and feature-toggle mapping in the story


## Getting Started

### STEP 1: Install dependency

```sh
    yarn add babel-plugin-feature-toggles --dev
    #or
    npm install babel-plugin-feature-toggles --save-dev
```

### STEP 2: (add to .babelrc)

```js
    {
        plugins: [
            "feature-toggles" 
            // Always add this on the first position 
            // (Otherwise the plugin might  not work)
        ]
    }

```

Default config:

**commentStart:** "toggleStart" \
**commentEnd:** "toggleEnd" \
**dir:** "</root path/>" \
**toggleName:** "" (If nothing is passed then the toggle will not apply)

### STEP 3: (Setting up feature toggle config)

A folder name `./feature-toggles/` will be present at the root of the application. Different configuration of toggles will be available as `[name].json` containing an array of feature-toggle  

`name` can be : (Below are the convention)

    - Feature team name (This is used for the team to separately build feature in the application)
        | - ft1.json
        | - ft2.json
    - Release name toggle (This feature is for release config)
        | - prod.json
        | - <name for your release>.json
> *Short-form of any name will be a good fit to create above file (e.g. Feature Team 1 = ft1)*

```
// Toggle config
./feature-toggles
    | - ft1.json
         | - feature-3
    | - ft2.json
    |    | - feature-4
    | - prod.json
         | - feature-1
         | - feature-2

```

### STEP 4: How to use in code

This is kind of unique about the tool, here this tool uses the comment to do the feature toggles.

Sample code with *JS*

```js

//Input
function someFunction() {
    //toggleStart(feature-1)
    console.log("This is a new feature!!");
    //toggleEnd(feature-1)

    console.log("I was there already");
}

//OutPut
//if *feature-1* is part of toggled off
function someFunction() {
    console.log("I was there already");
}
```

Sample code with *React JSX*

```js
//Input
export const MyReactComponent = () => {
    return (
        <>
            {/*toggleStart(feature-1)*/}
                <h1>This is a new feature!</h1>
            {/*toggleEnd(feature-1)*/}
            <h2>I was there already</h2>
        </>
    )
};
```

```js
//Output
// if *feature-1* is part of toggled off
export const MyReactComponent = () => {
    return (
        <>
            <h2>I was there already</h2>
        </>
    )
}
```
for more example: https://github.com/pandasanjay/feature-toggles/tree/master/examples/basic

### STEP 5: How to build your application using feature-toggle?

As above mentioned each file treated as a team or releases, so we should tell the babel plugin to run by "toggleName".

*You can do that couple of ways:*

Pass as *argv* to any command

```sh
    yarn start --toggleName=ft1
```

Pass as *env* variable

```sh
   TOGGLE_NAME=ft1 yarn start
```

## How this works?

All the feature toggling work depends

e.g if selected `ft1` (command used `yarn start --toggleName=ft1`) then this will read all the config and generate object like below.

```js

// Output
// true: will show the section of feature
// false: will hide the section of feature
{
    //yarn start --toggleName=ft1
    ft1: {
        "feature-3": true, 
        "feature-4": false,
        "feature-1": false,
        "feature-2": false
    },
    //yarn start --toggleName=ft2
    ft2: {
        "feature-3": false,
        "feature-4": true,
        "feature-1": false,
        "feature-2": false
    },
    //yarn start --toggleName=prod
    prod: {
        "feature-3": false,
        "feature-4": false,
        "feature-1": true,
        "feature-2": true
    }

}
```

Credits : [@paulpruteanu](https://github.com/paulpruteanu)