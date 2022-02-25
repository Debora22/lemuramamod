# Releases
> Death is so terribly final, while life is full of possibilities. [*](quotes.md#releases)

This document not only talks about releasing a new `TAG` of the project to all the users but describes
how to generate temporal deploys of a particular branch to a testing URL that we call `stagings`.
`staging` on this project is a temporal `S3`'s URL where a particular branch was deployed for testing purpose.
This URL is public, meaning anyone with the URL can access to it and use the application; this situation may be
considered dangerous because:
* the branch that is being tested may reveal critical information.
* the logic on the branch may cause damages with real customers' data.

So please, use the `staging` carefully.
* don't create `staging`s unless you're sure your branch is working properly.
* don't create `staging`s without a basic review from your coworkers.

### Release a new version of the project
We use [Github releases](https://github.com/Olapic/LemuramaModsquad/releases) to fire the deploy task in Jenkins;
the new release's name should follow the next name convention:
- Tag version: `v.X.Y.Z`; where
 * `X` is the number of the breaking version;
 * `Y` is the number of the feature version;
 * `Z` is the number of the fix version;
- Release title: `v.X.Y.Z: Release name`
- Release description: include a list of JIRAs related with the release your're making.

For more information about the `servem` we us at Frontend, take a look a [this post](https://medium.com/javascript-scene/software-versions-are-broken-3d2dc0da0783).

### Creating a staging url for testing purpose
In order to generate an `staging` URL you should release a new tag of the project,
using the testing branch and using the following name convention:
- Tag version: `v.X.Y.Z-branchName`; where
 * `X`, `Y`, `Z` should be same version from last stable `TAG` released.
 * `branchName` is the name of the branch you're testing..
- Target branch: the branch you're testing.
 - Release title: `v.X.Y.Z-branchName: Testing branchName`
- Release description: No description needed;
