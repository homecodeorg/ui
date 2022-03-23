#!/bin/sh

git checkout gh-pages && \
    git merge master && \
    yarn docs:build && \
    rm -rf docs && cp -r build docs && \
    git add docs/ && git commit docs/ -m "chore: build";
