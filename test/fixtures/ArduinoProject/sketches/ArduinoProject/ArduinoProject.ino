/*
 File: ArduinoProject.ino
 <write description here>

 ArduinoDK
 https://git.io/fAF8y
 */

#include "ArduinoProject.h"

void setup() {
  pinMode(ARDUINOPROJECT_OUTPUT, OUTPUT);
}

void loop() {
  digitalWrite(ARDUINOPROJECT_OUTPUT, HIGH);
}
