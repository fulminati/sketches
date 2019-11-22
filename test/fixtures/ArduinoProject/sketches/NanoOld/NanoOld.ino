/*
 File: NanoOld.ino
 <write description here>

 Sketches
 https://git.io/fAF8y
 */

#include "NanoOld.h"

void setup() {
  Serial.begin(@param('boudRate'));
  pinMode(NANO_OUTPUT, OUTPUT);
}

void loop() {
  digitalWrite(NANO_OUTPUT, HIGH);
  Serial.println("Hello World!");
  delay(2000);
}
