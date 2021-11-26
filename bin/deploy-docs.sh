#!/bin/sh

git checkout gh-pages && \
    git merge master && \
    yarn docs:build && \
    git add docs/ && git commit docs/ -m "chore: build";
