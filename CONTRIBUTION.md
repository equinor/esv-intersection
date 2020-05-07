
# How to contribute
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
