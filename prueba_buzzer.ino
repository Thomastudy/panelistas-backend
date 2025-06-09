#Codigo usado para la prueba del buzzer
#Prueba exitosa!
int buzzer = 8;
void setup()
{
pinMode(buzzer, OUTPUT);
}
void loop()
{

tone(buzzer, 1200, 500);
delay(1000);
} 
