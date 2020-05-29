Contributing changes
====================

Licensing of contributed material
---------------------------------

Keep in mind as you contribute, that code, docs and other material submitted to
open source projects are usually considered licensed under the same terms
as the rest of the work.

The details vary from project to project, but from the perspective of this
document's authors:

- Anything submitted to a project falls under the licensing terms in the
  repository's top level ``LICENSE`` file.

    - For example, if a project's ``LICENSE`` is BSD-based, contributors should
      be comfortable with their work potentially being distributed in binary
      form without the original source code.

- Per-file copyright/license headers are typically extraneous and undesirable.
  Please don't add your own copyright headers to new files unless the project's
  license actually requires them!

    - Not least because even a new file created by one individual (who often
      feels compelled to put their personal copyright notice at the top) will
      inherently end up contributed to by dozens of others over time, making a
      per-file header outdated/misleading.

Version control branching
-------------------------
There are 2 active branches on this repo, plus branches for each major version (see below):
- The `master` branch is the main branch of the repository, the one that is used for active development
  - Every time this branch is modified (typically when merging a PR), a Storybook is automatically deployed (on _Radix_, `master` environment). It can be found [here](https://intersection-component.app.radix.equinor.com/)
  - Depending on the amount and urgency of the changes, we will create releases which will trigger deployments. This does however require that the version in `package.json` and `package-lock.json` be bumped beforehand. An updated package is deployed to [npm](https://www.npmjs.com/package/@equinor/esv-intersection)
- The `latest` branch always points at the the most recent version released
  - The branch has to be updated manually, whenever a new release is created
  - Every time this branch is updated, the Storybook is automatically deployed (on _Radix_, `latest` environment). It can be found [here](TODO: add link)
This repository relies on [Semantic Versioning](https://semver.org/).

In order to create a release for a new major version, the first step is to create a new branch named `version_X` in the repo (where `X` has to be replaced with an incremental number). Then, a new _Release_ is created from that branch here on Github, named `vX.0.0`. Remember to update the `latest` branch to the new release.
Development continues on the `master` branch. In order to create a new minor version, the desired changes have to be moved to the `version_X` branch (either by merging, rebasing, cherry-picking, …). After proper testing, a new _Release_ can be created here on Github, named `vX.Y.0`. Remember to update the `latest` branch to the new release.
If a hotfix has to be applied to a released version, the fix has to be added on top of `version_X`. Then a new _Release_ can be created here on Github, named `vX.Y.Z`. Remember to update the `latest` branch to the new release. If the fix is relevant also for `master`, make sure the fix is ported on top of `master` as well.
When you want to contribute to the repo, always **fork the repo** or **make a new branch** for your work, no matter how small. This makes it easy for others to take just that one set of changes from your repository, in case you have multiple unrelated changes floating around.
    * A corollary: **don't submit unrelated changes in the same branch/pull request**!
* **Base your new branch off of the appropriate branch** on the main repository:
    * **Bug fixes** should be based either on `master` or on `latest` branches. Contribution to an older `version_X` branch (i.e., any version branch that does not correspond with `latest`) will be **rejected** (there can be exceptions, but that would require very compelling arguments).
        * Bug fixes requiring large changes to the code or which have a chance
          of being otherwise disruptive, may need to based on top of **master**.
          This is a judgement call -- ask the devs!
    * **New features** should branch off of the `master` branch
        * Note that depending on how long it takes for the dev team to merge
          your patch, the copy of ``master`` you worked off of may get out of
          date! If you find yourself 'bumping' a pull request that's been
          sidelined for a while, **make sure you rebase or merge to latest
          master** to ensure a speedier resolution.

Code formatting
---------------

* **Follow the style you see used in the primary repository**! Consistency with
  the rest of the project always trumps other considerations. It doesn't matter
  if you have your own style or if the rest of the code breaks with the greater
  community - just follow along.

Documentation isn't optional
----------------------------

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

Tests aren't optional
---------------------

Any bugfix that doesn't include a test proving the existence of the bug being
fixed, may be suspect.  Ditto for new features that can't prove they actually
work.

Your ideally include unit tests and/or storybooks to test and help describe what you are solving

We've found that test-first development really helps make features better
architected and identifies potential edge cases earlier instead of later.
Writing tests before the implementation is strongly encouraged.

Full example
------------

Here's an example workflow for a project ``theproject`` hosted on Github, which
is currently in version 1.3.x. Your username is ``yourname`` and you're
submitting a basic bugfix.

Preparing your Fork
^^^^^^^^^^^^^^^^^^^

1. Click 'Fork' on Github, creating e.g. ``yourname/theproject``.
2. Clone your project: ``git clone git@github.com:yourname/theproject``.
3. ``cd theproject``
4. Install the development requirements: ``npm install``.
5. Create a branch: ``git checkout -b foo-the-bars 1.3``.

Making your Changes
^^^^^^^^^^^^^^^^^^^

1. Add changelog entry crediting yourself.
2. Write tests expecting the correct/fixed functionality; make sure they fail.
3. Hack, hack, hack.
4. Run tests again, making sure they pass.
5. Commit your changes: ``git commit -m "Foo the bars"``

Creating Pull Requests
^^^^^^^^^^^^^^^^^^^^^^

1. Push your commit to get it back up to your fork: ``git push origin HEAD``
2. Visit Github, click handy "Pull request" button that it will make upon
   noticing your new branch.
3. In the description field, write down issue number (if submitting code fixing
   an existing issue) or describe the issue + your fix (if submitting a wholly
   new bugfix).
4. Hit 'submit'! And please be patient - the maintainers will get to you when
   they can.

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

----
The content of this file is largely inspired by [bitprophet's contribution guide](https://github.com/bitprophet/contribution-guide.org/blob/master/index.rst).
This file is licensed under the _BSD 2-Clause "Simplified" License_ that follows:

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
