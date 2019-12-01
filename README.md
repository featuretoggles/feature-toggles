# Feature Toggles the best way
 
This is a tool for use feature toggling in a *REACT web application*. 

> Are you struggling with maintenance of unfinished feature? Are you tired of long running branches? Do you want to implement Continuos Delivery and Trunk Based Development?

# Benefits
- Best for truck-based development
- No Long running branches
- No Merge hell
- No release branch
- Make product delivery faster
- No release time overhead.
- Increase team collaboration.

# Cons
- Little bit complexity to the code
- Tech dept and over head of un-maintained toggles
- Easily get massy

# Protection Required to Fix the Cons
- Establish a right mindset in team
- One feature one toggle approach
- Automation tools for toggle off and toggle on testing
- Powerful CI/CD pipeline
- Feature toggle removal tool (solves Tech dept)
- A visual representation of the toggles in side the project folder
- Story and feature-toggle mapping in story 


# Getting Started
## STEP 1: Install dependency
```sh
    yarn add feature-toggles --dev
    #or
    npm install feature-toggles --save-dev
```

## STEP 2: (add to .babelrc)
```js
    {
        plugins: [
            "babel-plugin-feature-toggles" 
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
        
## STEP 3: (Setting up feature toggle config)
A folder name `./feature-toggles/` will be preset in root of the application. Different configuration of toggles will be available as `[name].json` containing array of feature-toggle.  

`name` can be : (Below are the convention)

    - Feature team name (This is used for team to separately build feature in the application) 
        | - ft1.json
        | - ft2.json
    - Release name toggle (This feature is for release config)
        | - prod.json
        | - <name for your release>.json
> *Short-form of any name will be good fit to create above file (e.g. Feature Team 1 = ft1)*

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
## STEP 4: How to build your application using feature-toggle?
As above mentioned each file treated as team or releases, so we should tell the babel plugin to run by "toggleName".

*You can do that couple of ways:* 

Pass as *argv* to any command
```sh
    yarn start --toggleName=ft1
```
Pass as *env* variable
```sh
   TOGGLE_NAME=ft1 yarn start
```

# How this works (WIP)

```js

// Output 
// true: will show the section of feature
// false: will hide the section of feature
{
    ft1: {
        "feature-3": true, 
        "feature-4": false,
        "feature-1": false,
        "feature-2": false
    },
    ft2: {
        "feature-3": false,
        "feature-4": true,
        "feature-1": false,
        "feature-2": false
    },
    prod: {
        "feature-3": false,
        "feature-4": false,
        "feature-1": true,
        "feature-2": true
    }

}
```

Credits : [@paulpruteanu](https://github.com/paulpruteanu) 


