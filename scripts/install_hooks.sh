#!/bin/bash

[ ! -f ./git/hooks/pre-commit ] && ln -s ./../../scripts/hooks/pre-commit.local .git/hooks/pre-commit;
[ ! -f ./git/hooks/post-merge.local ] && ln -s ./../../scripts/hooks/post-merge.local .git/hooks/post-merge;
git config commit.template "scripts/hooks/commit.template";
