[![npm version](https://badge.fury.io/js/%40equinor%2Fesv-intersection.svg)](https://badge.fury.io/js/%40equinor%2Fesv-intersection)
![Publish Package](https://github.com/equinor/esv-intersection/workflows/Publish%20Package/badge.svg)
![Unit tests](https://github.com/equinor/esv-intersection/workflows/Unit%20tests/badge.svg)
# ESV Intersection component
A reusable component to create intersection visualizations for wells

Part of the [Equinor Subsurface Visualization project](https://github.com/equinor/esv)

- **Repository**: https://github.com/equinor/esv-intersection
- **NPM Package**: https://www.npmjs.com/package/@equinor/esv-intersection
- **Documentation (latest)**: https://equinor.github.io/esv-intersection/
- **Storybook (latest)**: https://equinor.github.io/esv-intersection/storybook/latest
- **Storybook (nightly)**: https://equinor.github.io/esv-intersection/storybook/master
- **React/typescript example**: https://github.com/equinor/react-intersection-example

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
For more examples, check out our stories in our online [storybook](https://equinor.github.io/esv-intersection/storybook/latest).

## Technical choices

- **Compiler**: [Typescript](https://www.npmjs.com/package/typescript)
- **Module bundler**: [Rollup](https://www.npmjs.com/package/rollup)
- **Testing**: [Jest](https://www.npmjs.com/package/jest)
- **Documentation**: [TypeDoc](https://www.npmjs.com/package/typedoc)
- **Code compressor**: [Terser](https://www.npmjs.com/package/terser)
- **Miscellaneous**:
  - Architecture: A container component that holds several layers, specialized for the type of data and visualization they address (analogous to the VidEx-map component https://github.com/equinor/videx-map)
  - Browser support: Target Edge, Chrome, Firefox, Safari
  - Linting and unit tests run automatically on Github Actions
  

## Development methodology
- The project is maintained by the [VidEx team](https://github.com/orgs/equinor/teams/viz) (Software Innovation Stavanger) and the [Heap Purple team](https://github.com/orgs/equinor/teams/heap-purple) (Software Innovation Bergen)
- TODO: Development is driven by _user stories_, created and prioritized by developers and POs together
- TODO: The development team has _planning meetings_ with the POs once a week
- Development relies on a _project board_ hosted on github (https://github.com/equinor/intersection/projects/1)
- During planning meetings, the `To do` column of the board is populated with user stories and tasks


## Support
If you are an equinor employee, the easiest way to get in touch with the maintainers is through the #esv-intersection channel on Slack.

Otherwise, Github issues are the main communication channel with the maintainers. If you have a bug to report, a feature request, or need some help using the component, simply [create an issue in the repository](https://github.com/equinor/esv-intersection/issues) and one of the maintainers will pick it up. Before creating an issue, please have a look at the following guidelines. Also keep in mind that creating [Pull Requests](CONTRIBUTION.md) is very much welcome. 

### Help needed
Describe your use case in details, make sure to include the version of the component you are using, and relevant software that are part of your pipeline (eg, Chrome/Firefox/Safari, Node, npm, …), including their version as well

### Bug reports
Follow the instructions from the _Help needed_ section above, but also include precise instructions about how to reproduce the bug. If any data is required for reproducing the bug, we need to have access to it as well.

### Feature requests
Give a precise description of your use case. It would be best if you could formulate your request as a user story, using the format `As a <subject> I would like to <the feature you need> so that <the task you want to accomplish>`

## Contribution

See the contribution [page](CONTRIBUTION.md)

## License
The large majority of the files in this repository are released under the [MIT license](LICENSE). There are 2 exceptions:
- the [CONTRIBUTION.md](CONTRIBUTION.md) file, which uses _BSD 2-Clause "Simplified" License_, as described at the end of the file itself
- the content of the [esv-intersection-data](https://github.com/equinor/esv-intersection-data) submodule uses the same license as Equinor's [Volve dataset](https://data.equinor.com/dataset/Volve), which is also available in the submodule

### Storybook

TODO: this should be probably moved to CONTRIBUTION.md

```bash
npm run storybook
```

Run the Storybook on the local machine. The storybook relies on data stored in the [esv-intersection-data](https://github.com/equinor/esv-intersection-data) repository.
It is included here as a git submodule. It is advised to run `git submodule update` before starting the storybook, in order to be sure that the sample data is up-to-date.

If the error `Cannot find module './esv-intersection-data'` appears in the console, there is a high chance that the submodule with the data has not been cloned correctly. Running `git submodule update --init` should fix the issue


![Equinor Logo](resources/images/equinor-logo.png)
