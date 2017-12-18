# Arduinodk

Arduinodk is a command-line tool inspired by package manager like NPM and YARN.

> If you are fascinated by the **package.json** then you will love **sketch.yml**.

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
# Simple 'sketch.yml' file
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

## Read more

 - [Install Boards and Libraries](https://github.com/fulminati/arduinodk/wiki/Install-boards-and-libraries)

## References
 - https://github.com/arduino/Arduino/blob/ide-1.5.x/build/shared/manpage.adoc
 