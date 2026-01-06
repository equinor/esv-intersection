# Changelog

## [3.1.8](https://github.com/equinor/esv-intersection/compare/v3.1.7...v3.1.8) (2026-01-06)


### Bug Fixes

* **7143:** add npm as engine ([#961](https://github.com/equinor/esv-intersection/issues/961)) ([76452bc](https://github.com/equinor/esv-intersection/commit/76452bc669aa87f5225adfa5d1e10288f45f2372))

## 3.0.12

### Patch Changes

- 7c26ebb: fix: tsconfig file path for vite

## 3.0.11

### Patch Changes

- 3f59bf5: chore: upgrade dependencies
- ba3661c: chore(dev-deps): upgrade dev dependencies to latest versions
- 1cca891: chore(deps): bump tough-cookie from 4.1.2 to 4.1.3

## 3.0.10

### Patch Changes

- 53386e9: chore(typescript): Enable strict mode for Typescript, but escape in the most annoying places in order to delay the need to change implementation details.
- ef0590b: chore: enable Typescript's strict mode & fix 1500 errors

## 3.0.7

### Patch Changes

- 96a5d01: handle empty nested data when trying to find a sample

## 3.0.6

### Patch Changes

- 776ec1f: chore(deps-dev): bump typedoc from 0.24.6 to 0.24.8
- 49abbad: chore(deps-dev): bump vitest from 0.30.1 to 0.31.4
- 06eab8f: chore(deps): bump d3-array from 3.2.3 to 3.2.4

## 3.0.5

### Patch Changes

- b5cae59: Upgrading several devDependencies, which were not covered in changesets:

  - chore(deps-dev): bump vitest from 0.30.0 to 0.30.1 by @dependabot in https://github.com/equinor/esv-intersection/pull/564
  - chore(deps-dev): bump storybook from 7.0.2 to 7.0.5 by @dependabot in https://github.com/equinor/esv-intersection/pull/570
  - chore(deps-dev): bump @storybook/html-vite from 7.0.2 to 7.0.5 by @dependabot in https://github.com/equinor/esv-intersection/pull/571
  - chore(deps-dev): bump @storybook/addon-storysource from 7.0.2 to 7.0.5 by @dependabot in https://github.com/equinor/esv-intersection/pull/572
  - chore(deps-dev): bump typedoc from 0.24.1 to 0.24.4 by @dependabot in https://github.com/equinor/esv-intersection/pull/573
  - chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.58.0 to 5.59.0 by @dependabot in https://github.com/equinor/esv-intersection/pull/576
  - chore(deps-dev): bump vite-plugin-dts from 2.2.0 to 2.3.0 by @dependabot in https://github.com/equinor/esv-intersection/pull/574
  - chore(deps-dev): bump @typescript-eslint/parser from 5.58.0 to 5.59.0 by @dependabot in https://github.com/equinor/esv-intersection/pull/575
  - chore(deps-dev): bump storybook from 7.0.5 to 7.0.6 by @dependabot in https://github.com/equinor/esv-intersection/pull/577
  - chore(deps-dev): bump typedoc from 0.24.4 to 0.24.6 by @dependabot in https://github.com/equinor/esv-intersection/pull/578
  - chore(deps-dev): bump eslint from 8.38.0 to 8.39.0 by @dependabot in https://github.com/equinor/esv-intersection/pull/583
  - chore(deps-dev): bump vite from 4.2.1 to 4.3.1 by @dependabot in https://github.com/equinor/esv-intersection/pull/582
  - chore(deps-dev): bump prettier from 2.8.7 to 2.8.8 by @dependabot in https://github.com/equinor/esv-intersection/pull/581
  - chore(deps-dev): bump @storybook/addon-storysource from 7.0.5 to 7.0.6 by @dependabot in https://github.com/equinor/esv-intersection/pull/580
  - chore(deps-dev): bump @storybook/html-vite from 7.0.5 to 7.0.7 by @dependabot in https://github.com/equinor/esv-intersection/pull/584
  - chore(deps-dev): bump @typescript-eslint/parser from 5.59.0 to 5.59.1 by @dependabot in https://github.com/equinor/esv-intersection/pull/585
  - chore(deps-dev): bump vite from 4.3.1 to 4.3.4 by @dependabot in https://github.com/equinor/esv-intersection/pull/590
  - chore(deps-dev): bump @storybook/addon-storysource from 7.0.6 to 7.0.7 by @dependabot in https://github.com/equinor/esv-intersection/pull/589
  - chore(deps-dev): bump storybook from 7.0.6 to 7.0.7 by @dependabot in https://github.com/equinor/esv-intersection/pull/587
  - chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.59.0 to 5.59.2 by @dependabot in https://github.com/equinor/esv-intersection/pull/591
  - chore(deps-dev): bump @typescript-eslint/parser from 5.59.0 to 5.59.2 by @dependabot in https://github.com/equinor/esv-intersection/pull/592

- b5cae59: - Fix issues where groups had labels and where last label was not rendered by @HavardNJ in https://github.com/equinor/esv-intersection/pull/594
- 2aef4a3: If GeoModel lineData is empty, don't throw script error
- af7a953: chore: automate releases based on changesets
- b5cae59: Enable slightly stricter Typescript settings:

  - chore: add slightly stricter ts types by @venikx in https://github.com/equinor/esv-intersection/pull/603

## TO BE RELEASED

## v3.0.0

### Feature

- Update perforation rendering
- Add layer for reference lines, with example for RKB, MSL and Seabed
- Add support for casing windows
- Adds support for Perforations
- Adds support for CementSqueeze
- Adds support for CementPlug
- Adds support for Plug & Abandonment symbols
- Adds support for Completion symbols

### Chores

- Update dependencies
- Update workflow actions to latest versions

### Fix

- Fix regression bug on symbol textures where images weren't flipped diagonally

### Breaking Changes

- Remove `casingId` from casings. Items referencing that id should rather use the `id` of the casing instead.
- Rename `casingIds` to `referenceIds` for cement related items, as tubing/screen can be cemented in some cases.
- Many Layers are made generic and type for layers data needs to be specified when extending and using the Layers
- Pixi Layers (SchematicLayer, GeomodelLayerV2) needs to pass inn a Pixi render context. Class PixiRenderApplication can be used for this
- HoleSizeLayer, CasingLayer, CementLayer and WellboreBaseComponentLayer are removed, but functionality is retained and improved in new SchematicLayer
- Data type for for new layer SchematicLayer is based on data for the old layers HoleSizeLayer, CasingLayer and CementLayer, but now requires id and kind specified
- Removed `any` from type definitions in the library
- Removed deprecated layer `GeomodelLayer`, in favor of `GeomodelLayerV2`
- Upgraded peer dependency `pixi.js@7.1.0`

## v3.0.0-beta.6

### Feature

- Update perforation rendering

## v3.0.0-beta.5

### Feature

- Reference lines, with example for RKB, MSL and Seabed

### Chores

- Update dependencies
- Update workflows actions to latest versions

## v3.0.0-beta.4

### Changes

- Add support for casing windows

## v3.0.0-beta.3

### Changes

- Fix regression bug on symbol textures where images weren't flipped diagonally

## v3.0.0-beta.2

### Breaking Changes

- Remove `casingId` from casings. Items referencing that id should rather use the `id` of the casing instead.
- Rename `casingIds` to `referenceIds` for cement related items, as tubing/screen can be cemented in some cases.

### Changes

- Adds support for Peforations

## v3.0.0-beta.0

### Breaking Changes

- Many Layers are made generic and type for layers data needs to be specified when extending and using the Layers
- Pixi Layers (SchematicLayer, GeomodelLayerV2) needs to pass inn a Pixi render context. Class PixiRenderApplication can be used for this
- HoleSizeLayer, CasingLayer, CementLayer and WellboreBaseComponentLayer are removed, but functionality is retained and improved in new SchematicLayer
- Removed `any` from type definitions in the library
- Removed deprecated layer `GeomodelLayer`, in favor of `GeomodelLayerV2`
- Upgraded peer dependency `pixi.js@6.5.8`

### Changes

- Data type for for new layer SchematicLayer is based on data for the old layers HoleSizeLayer, CasingLayer and CementLayer, but now requires id and kind specified
- Adds support for CementSqueeze
- Adds support for CementPlug
- Adds support for Plug & Abandonment symbols
- Adds support for Completion symbols

## v2.2.0

- Fix bugs in GeomodelLabelsLayer
- Upgrade dependencies
- Upgrade peer dependency `pixi.js@6.5.3`

## v2.1.0

- Allow setting `CasingShoeSize` for the `CasingLayer`

## v2.0.1

- Change deprecated `transparent` property to `backgroundAlpha` in Pixi `RendererOptions`
- Bump `terser` from 4.8.0 to 4.8.1
- Upgrade `d3-array` from 3.1.6 to 3.2.0

## v2.0.0

- Update major version of Pixi.js peer dependency to ^6.4.2
- Only render Pixi layers on input changes and user interactions. Should reduce idle CPU load

## v1.8.0

- Update dependencies
- Pixi.js peer dependency bumped to ^5.3.12

## v1.7.0

- Let Pixi Application options be configurable
- Update dependencies

## v1.6.0

- Update major version of d3 to v3
  Breaking changes in d3. Check d3 changelog before updating in your application.
- Perf: Minor optimization, avoid a few spread in loops and don't call updatePaths() twice when setting data

## v1.5.2

- Fix bug in IntersectionReferenceSystem::project for calculateDisplacementFromBottom
- Fix simple demo in readme

## v1.5.1

- Update node to v.16
- Update dependencies
- Fix: Stop clearing data before unmounting layers (#449)

## v1.5.0

- Bump hosted-git-info from 2.8.8 to 2.8.9
- Bump lodash from 4.17.19 to 4.17.21
- Improve responsiveness of rendering
- Refactoring
- Fix issue with interpolators which was causing rendering artifacts in cement layer
- Make CasingLayer easier to extend (#438)

## v1.4.4

- Add option to override interpolators in the IntersectionReferenceSystem
- Update react-dev-utils to 11.0.4

## v1.4.3

- Add option to use a optional range for generating seismic image

## v1.4.2

- Improve wellborelayers textures
- Update typescript to 4.2.2

## v1.4.1

- Matching surface name checks are now case insensitive
- Bumped d3-array package

## v1.4.0

- added option to override arc division and tension in the reference system
- removed group labels from being render in surface labels
- pixi-layers skip render without referenceSystem
- upgrade vulnerable packages
- cleanup GeomodelLayerV2
- cleanup render method on WellboreBaseComponentLayers

## v1.3.1

- fix skip render without referenceSystem in CalloutCanvasLayer

## v1.3.0

- fix CalloutCanvasLayer to always render on data update
- fix position callout with displacement calculated from bottom
- fix issue with missing labels in geomodel
- fix onUnmount on PixiLayers
- add export of interfaces AxisOptions, ControllerOptions, OverlayEvents and OverlayCallbacks
- add destroy method to Controller

## v1.2.1

- improved surface and surface label rendering order
- improved setting data on layer creation
- added fallback for various rendering functions when webGL is not available

## v1.2.0

- deprecate GeomodelLayer (keeping api util next major release)
- add support for inverse xBounds on several layers
- add support for cement spanning multiple casings
- fix issue in HighlightLayer storybook demo layer
- use typescript types from curve-interpolator
- add solid color casing option
- compensate for zFactor in WellboreBaseComponentLayers
- add calculateDisplacementFromBottom option to IntersectionReferenceSystem

## v1.1.0

- surface labels improvement
- bugfix: well layers rendering artifacts
- bugfix: fix distortion in GeomodelLayer and GeomodelLayerV2 lines when increasing zFactor

## v1.0.0

- bring package out of alpha
- bugfix: corrected overlapping logic for WellboreItemShapeGenerator
- minor refactoring

## v0.9.6-alpha

- improve validation on trajectoryAngle in IntersectionReferenceSystem
- handle cases where a curve is vertical

## v0.9.5-alpha

- Added option to remove reference system when clearing data on layers
- misc: added validation when missing data

## v0.9.4-alpha

- bugfix: use only extensionStart as offset
- bump websocket-extensions version

## v0.9.3-alpha

- improve input validation on getExtendedTrajectory

## v0.9.2-alpha

- bugfix: correctly handle position when md or position is supplied in callout layer

## v0.9.1-alpha

- bugfix: corrected input validation on getExtendedTrajectory

## v0.9.0-alpha

- added method in the IntersectionReferenceSystem to get an extended trajectory
- added option to pass in increment, which help specify distance between points on various layers like cement, casing, and holesize layers
- fixed a bug with z-index on html layers
- improved perfomance on cement layer
- add posibility to pass in either a curve length (measured depth, md) or a set of coordinates to the callout layer
- resolve vulnerability
- misc bugfixes and improvements

## v0.8.1-alpha

- misc bugfixes

## v0.8.0-alpha

- added clearAllData method to controller and layer manager
- reworked callout layer
- improved geolabel layer label positioning
- improved input validation
- improved error handling
- misc bugfixes

## v0.7.1-alpha

- improved documentation in the reference system
- removed existing options when creating a reference system
- added the option to pass in a trajectory angle in the reference system

## v0.7.0-alpha

- added cement layer
- fixed issue with peer dependency
- misc bugfixes

## v0.6.4-alpha

- set z-index for overlay and axis dynamically
- misc bugfixes
- improved documentation

## v0.6.3-alpha

- methods show/hide axis label
- methods for flipping axes
- getter for axis in layer manager and controller

## v0.6.2-alpha

- option to add offset in grid layer
- toggle axis
- set interactivity on layers, off by default
- moved base layers to sub-folders

## v0.6.1-alpha

- Expose offset methods in the layer manager and controller
- Allow flipping axis in canvas layer and flip domain in geo labels
- Set zoom levels

## v0.6.0-alpha

- misc optimizations
- improved value handling in IRS
- allow for offset in IRS
- allow for offset in axis

## v0.5.0-alpha

- Added HTML base layer
- Added story featuring point highlighting based on md input

## v0.4.0-alpha

- Added event overlay
- updated stories
- bugfixes

## v0.3.2-alpha

- Basic completion layer
- Pixi.js is now a peer dependency

## v0.3.1-alpha

- functioning defaults for layers
- made setData and clearData available for layers
- minor improvements

## v0.3.0-alpha

- added top level interface
- renamed WebglLayer to PixiLayer
- small fixes

## v0.2.0-alpha

Controls:

- Layer manager
- Reference system

Custom Layers:

- Geomodel label
- Casing

This release also features some miscellaneous improvements and optimizations

## v0.1.3-alpha

Made interfaces and zoom and pan handler available

## v0.1.2-alpha

Include actual files

## v0.1.1-alpha

Initial release

Contains Base, SVG, Canvas, Wellborepath, Callout, Image, and WebGL layers
