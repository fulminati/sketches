/*
 File: NewSketch.ino
 <write description here>

 Sketches
 https://git.io/fAF8y
 */

#include "NewSketch.h"

void setup() {
  pinMode(NEWSKETCH_OUTPUT, OUTPUT);
}

void loop() {
  digitalWrite(NEWSKETCH_OUTPUT, HIGH);
}
