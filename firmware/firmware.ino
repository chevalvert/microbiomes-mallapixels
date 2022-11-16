#include <Adafruit_NeoPixel.h>

#define LED_PIN 10
#define LED_COUNT 83

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_RGB + NEO_KHZ800);
char pixels[LED_COUNT*3];

void setup() {
  // Initialize the buffer to all black
  memset(pixels, 0, sizeof(pixels));

  strip.begin();
  strip.setBrightness(200);
  strip.show();
  flash();

  Serial.begin(115200);
  while (!Serial) {
    ; // Wait for port to be ready
  }
  Serial.println("READY");
}

void loop() {
  while (true) {
    int bufferPos = 0;

    // Read the data for each pixel
    while (bufferPos < LED_COUNT * 3) {
      int color = Serial.read();
      if (color >= 0) pixels[bufferPos++] = color;
    }

    // Feed the data to the NeoPixel library
    for(int i=0; i < LED_COUNT; i++) {
      int d = i*3;
      uint32_t c = strip.Color(pixels[d], pixels[d+1], pixels[d+2]);
      strip.setPixelColor(i, c);
    }

    strip.show();

    // Clear up the serial buffer
    while (Serial.available() > 0) Serial.read();

    // Let the sender know we're ready for more data
    Serial.println("READY");
  }
}

void flash () {
  for (int index = 0; index < 10; index++) { 
    delay(100); 
    if (index % 2 != 0) strip.clear();
    else {
      for (int i = 0; i < LED_COUNT; i++) strip.setPixelColor(i, 127, 0, 0);
    }
    strip.show();
  }
}
