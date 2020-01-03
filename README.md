Repository for the intersection component

Language: typescript

Strategy: same strategy as Videx used in the VidEx-map repository (TODO: add details)

Browser support: Edge, Chrome, Firefox, Safari

Repository: one repo per component, some additional repositories for common utilities

Open source: get in touch with POs

Styling: no real preference, to be defined. Videx map uses SCSS, WellX has to figure out integration with Sencha

Testing:
  - we want unit tests, with test coverage (treat with care)
  - snapshot tests nice to have
  - simulation test: testing basic interaction on all browsers (browser support)
    - can take quite some efforts, maybe ont highest priority
    - decide tools and target platforms
    
Linting: yes, lint in CI, use automatic formatting

Dependencies: _d3_, maybe _emotion_
  - evaluate if other dependencies might be necessary/interesting
  - visualization layers can drag in additional dependencies
  - dependnecies should not be included unless used by some specific layer
  
Accessibility: try our best to comply with WCAG2.1, possibly automatically check this in the future

CI: let's start with Github actions, evaluate different solutions if issues arise later on

Publishing: 
  - have automatic publishing
  - connect to tagged versions in the repo
  - would be good to be able to have a nightly package
  - details to be figured out
  
TODO Set up daily standups
TODO Set up planing meetings with POs
  
