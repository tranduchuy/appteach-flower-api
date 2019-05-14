# TypeScript Node Starter

## Pre-reqs

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [VS Code](https://code.visualstudio.com/)

## Getting started

Install dependencies

```shell
cd <project_name>
npm install
```

Available command

```shell
npm run start
npm run watch
npm run build
npm run start-ts
npm run watch-ts
npm run debug-ts
```

## Logging

Import logger lib:

```javascript
const console = process['console'];
```

Using logger:

```javascript
// With log(...)
console.log("Hello World!");

// Now with other pipes
console.info("Hello World!");
console.error("Hello World!");
console.warning("Hello World!");

// Now with an Object
console.log({
    hello : "world"
});

//Now with context
console.tag("Demo").time().file().log("Hello world");
```