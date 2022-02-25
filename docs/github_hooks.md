# Github hooks
> If you're lucky, no one will notice you. [*](quotes.md#github)

Github provides a set of [hooks](https://developer.github.com/v3/repos/hooks/) to automate actions when certain tasks are run.
All the hook files are located inside the directory [./scripts/hooks](./scripts/hooks) and should be [manually installed ](docs/local_enviroment_setup.md#lemurama_Modsquad_setup) while you're installing the repository in your local environment.

Currently we have two hooks in the repository:
* `post-merge`: update the `npm` and `bower` dependencies after your merge new code inside your branch.
* `pre-commit`: execute a validation before commit content to your branch; the validation consist in two tasks:
 * hint the JS code.
 * run the unit tests suite.
The `pre-commit` hook will fail if some error is presented in `jshint` or `unit test`
