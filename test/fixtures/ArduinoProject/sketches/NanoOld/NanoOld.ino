Ar/*
 File: NanoOld.ino
 <write description here>

 Sketches
 https://git.io/fAF8y
 */

#include "NanoOld.h"

void setup() {
  Serial.begin(@param('boudRate'));
  pinMode(NEWSKETCH_OUTPUT, OUTPUT);
}

void loop() {
  digitalWrite(NEWSKETCH_OUTPUT, HIGH);
  Serial.println("Hello World!");
  delay(2000);
}
