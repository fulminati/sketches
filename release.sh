#!/bin/bash

git add .
git commit -am "Release new version"
git push

npm publish
