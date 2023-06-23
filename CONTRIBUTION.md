# Contributing changes

## Licensing of contributed material

Keep in mind as you contribute, that code, docs and other material submitted to
this repository are considered licensed under the same terms as the rest of the work.

- Anything submitted to the project falls under the `MIT` licensing terms as dscribed in this repository's top level `LICENSE` file.

- Per-file copyright/license headers are typically extraneous and undesirable.
  Please don't add your own copyright headers to new files without contacting the maintainers first

## Branches

There is 1 active branch on this repo, plus possible branches for each majar version:

- The `master` branch is the main branch of the repository, the one that is used for active development
  - Every time this branch is modified (typically when merging a PR), a Storybook is automatically deployed. It can be found [here](https://equinor.github.io/esv-intersection/storybook/master)
  - Depending on the amount and urgency of the changes, we will create releases which will trigger deployments. This does however require that the version in `package.json` and `package-lock.json` be bumped beforehand. An updated package is deployed to [npm](https://www.npmjs.com/package/@equinor/esv-intersection)
- The possible `major version` branches only exist in case there is a need to create a bug fix in a previous major, based of a git tag.

## Automatically Releasing Versions with Changesets

We use a somewhat automated system with the help of [changesets](https://github.com/changesets/changesets), where each change in code it's up to the developer to decide if these changes warrant a certain
version bump. [Click the link if you'd like to learn how to add a changeset.](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md)
If you forgot to add a changeset, the changeset-bot will remind you in the PR to include a changeset, in case you forgot to add one, and it will add it for you.

There's two ways:

1. The PR or commit lands in master without a changeset ([example](https://github.com/equinor/esv-intersection/pull/640#issuecomment-1596336125))
2. The PR or commit includes a changeset ([example](https://github.com/equinor/esv-intersection/pull/630#issuecomment-1582989195))

In the first case, once the PR gets merged, nothing really changes.
In the second case, the changeset action will open a `Version Packages` PR where it will gather all changesets that are currently lading in master ([example](https://github.com/equinor/esv-intersection/pull/631)).

Once we are ready to release the next version, we can merge the PR. The release notes and changelog are automatically generated based on a git tag, and the package gets deployed to the NPM and Github Registry.

## Code formatting

- **Follow the style you see used in the primary repository**! Consistency with
  the rest of the project always trumps other considerations. It doesn't matter
  if you have your own style or if the rest of the code breaks with the greater
  community - just follow along.

## Documentation isn't optional

It's not! Patches without documentation will be returned to sender. a separate commit should be added that contains the ouput from running `npm run docs`. Methods and classes should also have jsdoc documentation.

example:

```javascript
/**
 * increment number by 1
 * @param n - number to be incremented
 */
increment(n) {
  return n + 1;
}
```

## Tests aren't optional

Any bugfix that doesn't include a test proving the existence of the bug being
fixed, may be suspect. Ditto for new features that can't prove they actually
work.

Your ideally include unit tests and/or storybooks to test and help describe what you are solving

We've found that test-first development really helps make features better
architected and identifies potential edge cases earlier instead of later.
Writing tests before the implementation is strongly encouraged.

## Full example

Here's an example workflow for a project `theproject` hosted on Github, which
is currently in version 1.3.x. Your username is `yourname` and you're
submitting a basic bugfix.

Preparing your Fork
^^^^^^^^^^^^^^^^^^^

1. Click 'Fork' on Github, creating e.g. `yourname/theproject`.
2. Clone your project: `git clone git@github.com:yourname/theproject`.
3. `cd theproject`
4. Install the development requirements: `npm install`.
5. Create a branch: `git checkout -b foo-the-bars 1.3`.

Making your Changes
^^^^^^^^^^^^^^^^^^^

1. Add changelog entry crediting yourself.
2. Write tests expecting the correct/fixed functionality; make sure they fail.
3. Hack, hack, hack.
4. Run tests again, making sure they pass.
5. Commit your changes: `git commit -m "Foo the bars"`

Creating Pull Requests
^^^^^^^^^^^^^^^^^^^^^^

1. Push your commit to get it back up to your fork: `git push origin HEAD`
2. Visit Github, click handy "Pull request" button that it will make upon
   noticing your new branch.
3. In the description field, write down issue number (if submitting code fixing
   an existing issue) or describe the issue + your fix (if submitting a wholly
   new bugfix).
4. Hit 'submit'! And please be patient - the maintainers will get to you when
   they can.

## Setup and usage

### Cloning repository

Start by cloning the repository to desired directory.

```bash
git clone --recursive https://github.com/equinor/esv-intersection.git
```

### Install dependencies

```bash
npm install
```

Install all dev dependencies defined in package.json using node.

### Building/Compiling

```bash
npm run build
```

Compiles the code found within the src-folder. Build is outputted to a new dist-folder.

### Creating tests

All tests are defined within the test-folder. Naming convention is to place tests for `SOMESCRIPT.ts` in a single file `SOMESCRIPT.test.ts`.

### Running tests

```bash
npm run test
```

Executes all tests defined within the test folder.

```bash
npm run test:watch
```

Executes all tests, but does not return immediately. Makes it possible to re-run failed tests quickly.

### Storybook

```bash
npm run storybook
```

Run the Storybook on the local machine. The storybook relies on data stored in the [esv-intersection-data](https://github.com/equinor/esv-intersection-data) repository. It is included here as a git submodule. It is advised to run `git submodule update` before starting the storybook, in order to be sure that the sample data is up-to-date.

If the error `Cannot find module './esv-intersection-data'` appears in the console, there is a high chance that the submodule with the data has not been cloned correctly. Running `git submodule update --init` should fix the issue

### Document generation

```
npm run docs
```

This command will overwrite any old documentation

---

The content of this file is largely inspired by [bitprophet's contribution guide](https://github.com/bitprophet/contribution-guide.org/blob/master/index.rst).
This file is licensed under the _BSD 2-Clause "Simplified" License_ that follows:

```
-------------
Copyright (c) 2020 Jeff Forcier.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
-------------
```
