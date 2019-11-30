# Feature Toggles the best way
 
This is a tool for build time feature-toggling.

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


# How this works

A folder name `./feature-toggles/` will be preset in root of every application. Different configuration of toggles will be available as `[name].json` containing array of feature-toggle.  

`name` can be : (Below are the convention)

    - Feature team name (This is used for team to separately build feature in the application) 
        | - ft1.json
        | - ft2.json
    - Release name toggle (This feature is for release config)
        | - prod.json
        | - <name for your release>.json


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


