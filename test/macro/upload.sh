#!/bin/bash
set -e

temp=${PWD}/temp
env_file=${temp}/../../../.env
sketches=${temp}/../../../sketches
fixtures=${temp}/../../fixtures

rm -fr ${temp}
mkdir -p ${temp}
cd ${temp}

cp -R ${fixtures}/ArduinoProject .
cd ArduinoProject
cp ${env_file} .

${sketches} install

${sketches} upload NanoOld --roger-monitor
