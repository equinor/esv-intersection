
# How to contribute

Pull requests should include the following:
- link to an issue that describes the problem, or a description in the pull request describing the issue and what it solves
- unit tests (if applicable)
- storybook (if applicable)
- a separate commit that contains the ouput from running `npm run docs`

## Setup guide

### Cloning repository

Start by cloning the repository to desired directory.

```
git clone https://github.com/equinor/esv-intersection.git
```

### Install dependencies

Install all dev dependencies defined in package.json using node.

```
npm install
```

## Usage

### Storybook

```
npm run storybook
```

### Document generation

```
npm run docs
```

This command will overwrite any old documentation

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
