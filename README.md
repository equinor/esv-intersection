[![npm version](https://badge.fury.io/js/%40equinor%2Fesv-intersection.svg)](https://badge.fury.io/js/%40equinor%2Fesv-intersection)
![Publish Package](https://github.com/equinor/esv-intersection/workflows/Publish%20Package/badge.svg)
![Unit tests](https://github.com/equinor/esv-intersection/workflows/Unit%20tests/badge.svg)
# ESV Intersection component
A reusable component to create intersection visualizations for wells

Part of the [Equinor Subsurface Visualization project](https://github.com/equinor/esv)

- **Repository**: https://github.com/equinor/esv-intersection
- **Storybook**: https://intersection-component.app.radix.equinor.com
- **NPM Package**: https://www.npmjs.com/package/@equinor/esv-intersection
- **Documentation**: https://equinor.github.io/esv-intersection/
- **React (typescript) example**: https://github.com/equinor/react-intersection-example

## Getting started

#### Installation
Using npm:
```bash
npm install --save @equinor/esv-intersection
```
Using yarn:
```bash
yarn add @equinor/esv-intersection
```

#### Usage

```javascript
import { Controller, GridLayer } from '@equinor/esv-intersection';

const container = document.createElement('div');
const controller = new Controller(container);

// the controller initially has zero height
controller.adjustToSize(400, 400);

controller.addLayer(new GridLayer('grid'));
```
For more examples, check out our stories in our online [storybook](https://intersection-component.app.radix.equinor.com).

## Technical choices

- **Compiler**: [Typescript](https://www.npmjs.com/package/typescript)
- **Module bundler**: [Rollup](https://www.npmjs.com/package/rollup)
- **Testing**: [Jest](https://www.npmjs.com/package/jest)
- **Documentation**: [TypeDoc](https://www.npmjs.com/package/typedoc)
- **Code compressor**: [Terser](https://www.npmjs.com/package/terser)
- **Miscellaneous**:
  - Architecture: A container component that holds several layers, specialized for the type of data and visualization they address (analogous to the VidEx-map component https://github.com/equinor/videx-map)
  - Browser support: Target Edge, Chrome, Firefox, Safari
  - Styling: To be defined. Possibly SCSS or Emotion
  - Testing:
    - linting and unit tests, with test coverage - run automatically on Github Actions
    - possibly snapshot tests at a later stage
    - later on simulation tests, depending on resources and requirements
  - Dependencies:
    - _d3_
    - each layer can include additional dependencies
  - Accessibility: investigate compliance with WCAG2.1 (poossibly automatically)
  - Publishing:
    - automated
    - both tagged releases (semantic versioning) and nightly


## Development methodology
- The _Product Owners_ of the Intersection component are @farzadfz and @thuve
- Development is driven by _user stories_, created and prioritized by developers and POs together
- User stories can be grouped into _milestones_. A milestone represents what is expected to be achieved in about 2 months of development
- The development team has _planning meetings_ with the POs once a week
- The development team has _daily standups_, POs participation is optional but very much encouraged
- Development relies on a _project board_ hosted on github (https://github.com/equinor/intersection/projects/1)
- During planning meetings, the `To do` column of the board is populated with user stories and tasks
- What is placed in the `To do` column is expected to be completed in 1 week of normal work
- At the developers discretion, a _technical planning meeting_ can be held after the planning
- During a _technical planning meeting_, current user stories and tasks can be discussed and potentially split into smaller tasks
- A _demo_ for the stakeholders will be held approximately every 4 weeks
  - Stakeholders for the _WellX_ and _REP_ projects (including the _REP reference user group_) should be invited to the demo


## Setup guide

### Cloning repository

Start by cloning the repository to desired directory.

```
git clone --recursive https://github.com/equinor/esv-intersection.git
```

### Install dependencies

Install all dev dependencies defined in package.json using node.

```
npm install
```

## Usage

### Document generation

```
npm run docs
```

Three part process:

1. Deletes the docs-folder, if it exists.
2. Automatically generates documentation to a new docs-folder.
3. Copies the images-folder and .nojekyll into docs.

The copying of images makes it possible to refer to local images within the README!

The empty .nojekyll file makes it possible to upload html pages starting wth underscore to GitHub pages.

### Creating tests

All tests are defined within the test-folder. Jest naming convention is to place tests for SOMESCRIPT.ts in a single file SOMESCRIPT.test.ts.

### Testing

```
npm run test
```

Executes all tests defined within the test folder.

```
npm run test:watch
```

Executes all tests, but does not return immediately. Makes it possible to re-run failed tests quickly.

### Building/Compiling

```
npm run build
```

Compiles the code found within the src-folder. Build is outputted to a new dist-folder.

![Equinor Logo](resources/images/equinor-logo.png)
