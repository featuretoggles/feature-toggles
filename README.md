<p align="center">
  <a href="https://github.com/featuretoggles/feature-toggles">
    <img alt="Feature Toggles" src="https://avatars3.githubusercontent.com/u/58596566?s=400&u=461bf3f684f7cdb44900167ae4b416d835f4f3b9&v=4">
  </a>
</p>
<p align="center">
  A feature toggles solution for javascript applications.
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/babel-plugin-feature-toggles"><img alt="Babel plugin Downloads" src="https://img.shields.io/npm/dm/babel-plugin-feature-toggles.svg?maxAge=43200&label=Babel%20plugin%20downloads"></a>
</p>
<p align="center">
    <a href="https://github.com/featuretoggles/feature-toggles"><img alt="Github CI" src="https://github.com/featuretoggles/feature-toggles/workflows/Node%20CI/badge.svg"></a>
</p>

# Feature Toggles

Currently, This is available as a babel plugin.

> ### The list of problems stopping you to productive, then you are at right place.
>
> 1. How to maintain both existing and unfinished feature?
> 2. How to get rid of long-lived branches?
> 3. How to manage single codebase used by multiple teams?
> 4. How to maintain a production-ready master branch?

More details why you need feature toggles: https://sanjaypanda.com/blogs/feature-toggles-ideas-and-uses/

## Benefits

- Best for trunk-based development.
- No more Long-lived branches.
- No Merge hell.
- No need of removing unfinished code while releasing, just toggle it off.
- Make product delivery faster.
- No release time overhead.
- Increase team collaboration.

## Cons

- Little bit complexity to the code
- Tech dept and overhead of un-maintained toggles
- Easily get massy

## Protection Required to Fix the Cons

- Establish the right mindset in the team
- One feature one toggle approach
- Automation testing tools for toggle off and toggle on testing
- CI/CD pipeline
- Feature toggle removal tool (solves Tech dept)

## Getting Started

### STEP 1: Install dependency

```sh
    yarn add babel-plugin-feature-toggles --dev
    #or
    npm install babel-plugin-feature-toggles --save-dev
```

### STEP 2: (add to .babelrc or babel.config.json)

```js
{
  plugins: [
    "feature-toggles",
    // Always add this on the first position
    // (Otherwise the plugin might  not work)
  ];
}
```

Default config:

**commentStart:** "toggleStart" \
**commentEnd:** "toggleEnd" \
**dir:** "." \
**toggleConfig:** "" (If nothing is passed then the toggle will not apply)

### STEP 3: (Setting up feature toggle config)

1. Create a directory name `./toggle-configs/` in the root of your application.

2. Add config files like `[name].json`. (e.g `prod.json`)

3. In the config file add the list of flags. (e.g `[feature-1, feature-2]`)

4. The flags are each related to one particular feature. This flag helps to show and hide the features.

```js
// Sample Toggle config
./toggle-configs
    | - ft1.json // Config files
         | - feature-3 // flag name
    | - ft2.json
    |    | - feature-4 // flag name
    | - prod.json
         | - feature-1 // flag name
         | - feature-2 // flag name

// Config files: Represent of one team or a release
// flag name: represent of one feature

```

### STEP 4: How to feature toggle used in code

Instead of using a traditional `if statement` to show hide the feature over run time, we use a unique commented petters of solving the issue.

> **Why commented pattern?**
>
> 1. Traditional `if-else` will be difficult to identify between feature toggle and normal condition.
> 2. `if-else` implementation works well with a run-time feature toggle, but we want something which removes unfinished code build time.
> 3. Another important thought, we want a way which worker for (`Valine Javascript and React/Vue/Angular Components and Function arguments`) verity of places similar way.
> 4. Also cleaning the traditional `if-else` is not easy, so we want something easy removable from code.

feature toggle has `toggleStart` and `toggleEnd` command with a flag name will ensure the code will be Toggle On or Toggle Off by the config of choice.
**Sample codes:**

with _JS_

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

Sample code with _React JSX_

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
  );
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
  );
};
```

for more example: https://github.com/pandasanjay/feature-toggles/tree/master/examples/basic

### STEP 5: How to build your application using feature-toggle?

we should tell the babel plugin to run by "toggleConfig".

_You can do that couple of ways:_

Pass as _argv_ to any command

```sh
    yarn start --toggleConfig=ft1
```

Pass as _env_ variable

```sh
   TOGGLE_CONFIG_NAME=ft1 yarn start
```

## How this works?

```
// Sample Toggle config
./toggle-configs
    | - ft1.json
         | - feature-3
    | - ft2.json
    |    | - feature-4
    | - prod.json
         | - feature-1
         | - feature-2

```

Please see the above sample config path for reference.

1. When we select one config i.e `ft1.json`. (using command `yarn start --toggleConfig=ft1`)

2. First, this will combine all the `toggleflag` from all the config files.

3. Then turn on the flags which available in `ft1.json` config file. (e.g `feature-3` flag used in the code will not remove (Toggle On) and others will be toggled off.)

Follow the below example will help you understand more.

```js

// Output
// true: will show the section of feature
// false: will hide the section of feature
{
    //yarn start --toggleConfig=ft1
    ft1: {
        "feature-3": true,
        "feature-4": false,
        "feature-1": false,
        "feature-2": false
    },
    //yarn start --toggleConfig=ft2
    ft2: {
        "feature-3": false,
        "feature-4": true,
        "feature-1": false,
        "feature-2": false
    },
    //yarn start --toggleConfig=prod
    prod: {
        "feature-3": false,
        "feature-4": false,
        "feature-1": true,
        "feature-2": true
    }

}
```

## Great Power comes with responsibility.

Here is a list of responsibilities.

1. #### One feature one toggle flag

   ```
   - Given you are in a scrum team working for an e-commerce product. And now team gets a new feature requirement to build a new checkout page for your application and the work is divided between 3 developer means 3 stories.
   - For all these 3 story codes will be warped by one toggle flag.
   - Which will help you to reduce toggle and not get messy.
   ```

2. #### Remove toggle flags from code.

```sh
# Remove the code wrapped with toggle "feature-3"
./node_modules/.bin/feature-toggles clean --toggleName=feature-3
```

```sh
# Remove the comment wrapped with toggle "feature-3"
./node_modules/.bin/feature-toggles clean --toggleName=feature-3 --flag
```

```sh
# For more option
./node_modules/.bin/feature-toggles clean --help
Usage:
    $ ./node_modules/.bin/feature-toggles clean <path> <...options>
    path                     Files or directory to transform. Can be a glob like src/**.test.js
    Options:
        -t, --toggleFlagName       Toggle flag name
            --flag                 Only remove comment condition

    Other Options:
        --force, -f              Bypass Git safety checks and forcibly run codemods
        --dry                    Dry run (no changes are made to files)
        --print                  Print transformed files to your terminal
        --explicit-require       Transform only if React is imported in the file (default: true)
        --jscodeshift            (Advanced) Pass options directly to jscodeshift

    Examples
        $ ./node_modules/.bin/feature-toggles clean ./src  --toggleFlagName=feature-3


```

## Try it

[Example 1 - Basic example](https://runkit.com/pandasanjay/runkit-npm-babel-plugin-feature-toggles)

[Example 1 - React Component example](https://runkit.com/pandasanjay/babel-component)

Credits : [@paulpruteanu](https://github.com/paulpruteanu)
