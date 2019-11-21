#!/bin/bash
set -e

temp=$(dirname $(realpath $0))/temp
sketches=${temp}/../../../sketches

rm -fr ${temp}
mkdir -p ${temp}
cd ${temp}

${sketches} init ArduinoProject
cd ArduinoProject

${sketches} init ArduinoProject
${sketches} ls
${sketches} create-sketch CreatedSketch
${sketches} ls
${sketches} rename-sketch CreatedSketch RenamedSketch
${sketches} ls
