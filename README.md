[![Build Status](https://travis-ci.org/Blendtec/blendtec-shopify-theme.svg?branch=master)](https://travis-ci.org/Blendtec/blendtec-shopify-theme) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Blendtec Shopify Theme
![Logo](https://s3.amazonaws.com/blendtec.com/images/Logo/BT-Logo.png "Logo")

[blendtec.com](https://wwww.blendtec.com) Shopify Theme

## Getting Started
#### This project is volatile at the moment as it is being aggressively migrated to [Shopify Slate](https://github.com/Shopify/slate) and is in the midst of some intermediary steps. During this time we are making every effort to keep the project viable so there are some oddities in some things such as unused build artifacts and dependencies that aren't being utilized yet. If you are a developer for one of our international dealers we would very much encourage you to get in touch with us if you'd like to contribute. 

### Prerequisites

  - [NodeJs](https://nodejs.org)
  - NPM
  - [Yarn](https://yarnpkg.com/lang/en/docs/install)
  - [Theme Kit](https://shopify.github.io/themekit/#installation) configured with your dev store instance env variables

## Workflow
1. `$ git clone git@github.com:Blendtec/blendtec-shopify-theme.git`
2. `$ cd blendtec-shopify-theme`
2. `$ yarn`
3. `$ yarn upload`
4. `$ yarn watch:webpack` * leave running
5. In a new terminal `$ yarn watch:theme` * leave running
6. `$ git checkout -b <ISSUE-NUMBER>-short-description`
7. Hack on Code until feature is complete (committing sanely)
8. `$ git push -u origin <Branch Name>`
9. Create Pull Request via Github

### I don't want to code I just want a theme file to install
  - [Release Page](https://github.com/Blendtec/blendtec-shopify-theme/releases) 
  - Download the latest version of the 'Blendtec Shopify Theme'

### And coding style tests
Linting is not yet running project wide so it is imperative that lint your individual files

## Deployment
Deployment is handled via Travis-CI and occurs on stage and master branches

## Known Issues
 1. Webpack bundles aren't being used - we are currently refactoring all JS to hopefully remove all js.liquid files so we can run everything through webpack and have a vendors bundle generated. For now, we have the old vendors.js file that is just a series of dependencies that we gathered together from the mishmash of vendor files that were rattling around in the original theme. the vendors.min.js file is simply a minified version of vendors.js. This will go away once we start using the webpack generated bundles. 
 2. Js files are using verbose page.`<component>`.function rather than `this`. This is a step toward classes that we will be migrating to once we have made this initial refactoring pass through the massive and non-uniform app.js. App.js is an obvious frankenstein of coding styles, global variables, iifes, jQuery, native js etc etc. Moving the files into the home.js, collection.js etc is a quick, safe, (less) dirty step toward a homogenious code base.
 3. All the section scripts are in home.js which is only loaded for the home template. This suites our current needs but will be addressed as we move to true modules. 
 4. App.scss.liquid is huge - This is a TBD and I'm hoping this will largely be addressed with importing smaller scss files via webpack. I like Shopify Slate's approach using css variables to pass liquid variables into the scss but my initial research leads me to believe this is only viable for the most recent browsers. We'll see.  


## Contributing
 Please contact us, we would love to have contributors. Until this comes up we don't have a formally planned roadmap other than what has been discussed above which can be summarized as "Migrate to shopify-slate without breaking things".

