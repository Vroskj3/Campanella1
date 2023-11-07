#include <LiquidCrystal.h>

const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
int pinRele = 6;
void setup() {
  Serial.begin(9600);
  lcd.begin(16, 2);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Campanella");
  lcd.setCursor(0, 1);
  lcd.print("Pronta");
  pinMode(pinRele, OUTPUT);
}

String Read = "";
int intRead;
void loop() {
  if (Serial.available()) {
    do { Read = Serial.readString(); } while (Read == '\n');
    intRead = int(Read[0]) - 48;
    switch (intRead) {
      case 1:
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Cambio");
        lcd.setCursor(0, 1);
        lcd.print("Dell'ora");
        digitalWrite(pinRele, HIGH);
        delay(2500);
        digitalWrite(pinRele, LOW);
        break;
      case 2:
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Fine della");
        lcd.setCursor(0, 1);
        lcd.print("Giornata");
        digitalWrite(pinRele, HIGH);
        delay(2000);
        digitalWrite(pinRele, LOW);
        delay(1000);
        digitalWrite(pinRele, HIGH);
        delay(2000);
        digitalWrite(pinRele, LOW);
        delay(1000);
        digitalWrite(pinRele, HIGH);
        delay(2000);
        digitalWrite(pinRele, LOW);
        break;
      case 3:
        lcd.clear();
        lcd.print("EMERGENZA!");
        digitalWrite(pinRele, HIGH);
        delay(7000);
        digitalWrite(pinRele, LOW);
        break;
      case 4:
        lcd.clear();
        Read = "";
        do { Read = Serial.readString(); } while (Read == '\n' || Read == "");
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Codice Regist:");
        lcd.setCursor(0, 1);
        lcd.print(Read);
        Read = "";
        do {
          do { Read = Serial.readString(); } while (Read == '\n' || Read == "");
          intRead = int(Read[0]) - 48;
        } while (intRead != 5);
        break;
    }
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Campanella");
    lcd.setCursor(0, 1);
    lcd.print("Pronta");
  }
}
