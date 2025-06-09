#include <Stepper.h>

const int STEPS_PER_REV = 2048;      // Pasos por vuelta completa
Stepper myStepper(STEPS_PER_REV, 8, 9, 10, 11);

int horizontal = 2048;
int vertical = 0;

void setup() {
  myStepper.setSpeed(6);   
  myStepper.step(horizontal);

}

void loop() {
  // No hacemos nada más
}