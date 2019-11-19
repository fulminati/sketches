/*
 File: ping.ino
 <write description here>

 ArduinoDK
 https://git.io/fAF8y
 */

#include "ping.h"

void setup() {
  pinMode(PING_OUTPUT, OUTPUT);
}

void loop() {
  digitalWrite(PING_OUTPUT, HIGH);
}
