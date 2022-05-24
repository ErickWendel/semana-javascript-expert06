# Spotify Radio - JS Expert Week 6.0

Welcome to the sixth Javascript Expert Week. This is the starting code to start our journey.

Tag this project with a star 🌟

## Preview

<img src="./prints/demo.png" />

## Checklist Features

- Web API
    - [ ] Must achieve 100% code coverage in tests
    - [ ] Must have end to end tests validating all API routes
    - [ ] Must deliver static files as Node.js Streams
    - [ ] Must deliver music files as a Node.js Stream
    - [ ] Given a disconnected user it should not break the API
    - [ ] Even if multiple commands are fired at the same time, it should not break the API
    - [ ] If an unexpected error occurs, the API should keep working
    - [ ] The project needs to run on Linux, Mac and Windows environments

- Web App
    - Client
        - [ ] Must play the broadcast
        - [ ] Shouldn't pause if any effects are added
    - Controller
        - [ ] Must achieve 100% code coverage in tests
        - [ ] Must be able to start or stop a broadcast
        - [ ] Must send commands to add audio effects to a stream

## Tasks per class

- Lesson 01: Cover service and route layers with unit tests and achieve 100% code coverage
- Lesson 02: Maintain 100% code coverage and implement e2e tests for the entire API
- Lesson 03: implement unit tests for the frontend and maintain 100% code coverage
- **PLUS**:
    - [ ] provide a new effect
        - [ ] add a new button on the controller
        - [ ] add a new effect sound to the `audios/fx/` folder
        - [ ] repost on heroku
## Source code for classes and solving challenges
- [Class01](./classes/class01/)
    - [desafio-resolvido](./aulas/aula01-desafio-resolvido) and [page with 100% code coverage](https://erickwendel.github.io/semana-javascript-expert06/aulas/aula01-desafio-resolvido /coverage/lcov-report/index.html)
- [Class02](./classes/class02/)
    - [desafio-resolvido](./aulas/aula02-desafio-resolvido) and [page with 100% code coverage](https://erickwendel.github.io/semana-javascript-expert06/aulas/aula02-desafio-resolvido /coverage/lcov-report/index.html)
- [Class03](./classes/class03/)
    - [desafio-resolvido](./aulas/aula03-desafio-resolvido) and [page with 100% code coverage](https://erickwendel.github.io/semana-javascript-expert06/aulas/aula03-desafio-resolvido /coverage/lcov-report/index.html)

### Credits to the sources I've used on the demos

#### Streaming
- [English Conversation](https://youtu.be/ytmMipczEI8)

#### Effects
- [Applause](https://youtu.be/mMn_aYpzpG0)
- [Applause Audience](https://youtu.be/3IC76o_lhFw)
- [Boo](https://youtu.be/rYAQN11a2Dc)
- [Fart](https://youtu.be/4PnUfYhbDDM)
- [Laugh](https://youtu.be/TZ90IUrMNCo)
## FAQ
- `NODE_OPTIONS` is not a system recognized command, what to do?
    - If you are on Windows, the way to create environment variables is different. You must use the word `set` before the command.
    - Ex: ` "test": "set NODE_OPTIONS=--experimental-vm-modules && npx jest --runInBand",`

- I ran `npm test` but nothing happens, what to do?
    - Check your Node.js version. We are using version 17. Go to [node.js website](https://nodejs.org) and download the latest version.

- `jest.spyOn` - when we try to use `function.name` (something like `stream.pipe.name`), it says the instance is undefined
    - In this case, use the value as a string: `jest.spyOn(stream, "pipe").mockReturnValue`
- Challenge 01 impossible to complete 100% code coverage because [testUtil.js](./aulas/aula01/tests/unit/_util/testUtil.js) is not being fully used
    - Add the following code snippet to the first line of the [testUtil.js](./aulas/aula01/tests/unit/_util/testUtil.js) file: `/* istanbul ignore file */` . This will make jest ignore this file and complete 100%.
    - Important: this change will only serve to complete this first and/or second challenge, in the last class, we will not need to ignore this file since we will use all the functions
