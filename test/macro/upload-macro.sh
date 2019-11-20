#!/bin/bash
set -e

temp=$(dirname $(realpath $0))/temp
sketches=${temp}/../../../sketches
fixtures=${temp}/../../fixtures

rm -fr ${temp}
mkdir -p ${temp}
cd ${temp}

cp -R ${fixtures}/ArduinoProject .
cd ArduinoProject

${sketches} upload ArduinoProject
