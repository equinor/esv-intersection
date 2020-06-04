# Changelog

## New changes not yet released

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
