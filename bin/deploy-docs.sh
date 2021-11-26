#!/bin/sh

git checkout gh-pages && \
    git merge master && \
    yarn docs:build && \
    git commit -a docs/ -m "chore: build";
