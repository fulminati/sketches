# ArduinoDK

Arduinodk is a command-line tool inspired by package manager like NPM and YARN.

> If you are fascinated by the **package.json** then you will love **sketches.yml**.

## Get Started
```
$ npm install -g arduinodk
```

### Create project from scratch
```
$ mkdir MyArduinoProject
$ cd MyArduinoProject
$ arduinodk init
```
- Read more: [Advanced project management](https://github.com/fulminati/arduinodk/wiki/Advanced-project-management)

### Create project from existing repository
```
$ arduinodk clone <remote-git-repository>
```

## Configure your project
Every Arduinodk project are configured by 'sketch.yml' file
```yml
# Simple 'sketches.yml' file
name: "MyArduinoProject"
board: "package:arch:board[:parameters]"
```
- Read more: [Reference: sketch.yml](https://github.com/fulminati/arduinodk/wiki/Reference:-sketch.yml)

## Build your project

### Verify operation
Verify source code of current project
```
$ arduinodk verify
```

### Upload operation
Upload binary into arduino board
```
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
 
 
