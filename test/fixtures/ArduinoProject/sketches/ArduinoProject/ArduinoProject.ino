/*
 File: ArduinoProject.ino
 <write description here>

 ArduinoDK
 https://git.io/fAF8y
 */

#include "ArduinoProject.h"

void setup() {
  Serial.begin( @param('boudRate') );
  pinMode(ARDUINOPROJECT_OUTPUT, OUTPUT);
}

void loop() {
  digitalWrite(ARDUINOPROJECT_OUTPUT, HIGH);
Serial.println("On");
   delay(2000);
   digitalWrite(ARDUINOPROJECT_OUTPUT, LOW);
   Serial.println("Off");
      delay(2000);
}
