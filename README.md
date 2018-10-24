# ArduinoDK

ArduinoDK is a command-line tool inspired by package manager like NPM and YARN.

> If you are fascinated by the **package.json** then you will love **sketches.yml**.

## Get Started
```bbabasbash
$ npm install -g arduinodk
```

### Create project from scratch
```bash
$ arduinodk init <MyArduinoProject>
$ cd <MyArduinoProject>
```
- Read more: [Advanced project management](https://github.com/fulminati/arduinodk/wiki/advanced-project-management)

### Configure your project
Each ArduinoDK project can be configured via the 'sketches.yml' file
```yml
name: <MyArduinoProject>
version: 0.0.1
sketches:
  MyArduinoProject:
    board: uno
    port: COM3
```
- Read more: [Reference: sketches.yml](https://github.com/fulminati/arduinodk/wiki/Reference:-sketches.yml)

### Verify operation
Verify source code of current project
```bash
$ arduinodk verify
```

### Upload operation
Upload binary into arduino board
```bash
$ arduinodk upload
```

## Roadmap

| Command       | Progress | Features |
|---------------|:--------:|----------|
| apply-filters | 10%      |          |
| create-sketch | 10%      |          |
| flash         | 10%      |          |
| init          | 10%      |          |
| install       | 10%      |          |
| ls            | 10%      |          |
| monitor       | 10%      |          |
| rename-sketch | 10%      |          |
| sandbox       | 10%      |          |
| upload        | 10%      |          |
| verify        | 10%      |          |

## Read more

 - [Install Boards and Libraries](https://github.com/fulminati/arduinodk/wiki/Install-boards-and-libraries)

## References
 - https://github.com/arduino/Arduino/blob/ide-1.5.x/build/shared/manpage.adoc
 - https://h3ron.com/post/programmare-lesp8266-ovvero-arduino-con-il-wifi-a-meno-di-2/
 - https://cassiopeia.hk/rgb-wifi/
 - https://www.anginf.de/?p=600
 - https://github.com/doleron/esp8266-1-channel-relay-board-with-mqtt
 
