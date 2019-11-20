#!/bin/bash
set -e

temp=$(dirname $(realpath $0))/temp
env_file=${temp}/../../../.env
sketches=${temp}/../../../sketches
fixtures=${temp}/../../fixtures

rm -fr ${temp}
mkdir -p ${temp}
cd ${temp}

cp -R ${fixtures}/ArduinoProject .
cd ArduinoProject
cp ${env_file} .

#${sketches} install

${sketches} upload ArduinoProject
