int btnPins[6] = {3,4,5,6,7,2};
int btnState[6];

void setup() {
  Serial.begin(9600);
  for(int i = 0; i < 6; i++){
  pinMode(btnPins[i], OUTPUT);
  }
}

void loop() {
  for(int i = 0; i < 6; i++){
    if(digitalRead(btnPins[i]) != 0){
      sendData();
    }
  }
  delay(10);
  }

void sendData() {
  for(int i = 0; i < 6; i++){
    btnState[i] = digitalRead(btnPins[i]);
    Serial.print(btnState[i]);
    Serial.print(' ');
    
  }
  delay(500);
  Serial.println();
}
