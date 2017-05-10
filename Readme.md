# Node-red Docker import

Import [node-red](nodered.org) nodes from a *docker* project

## Requirements

Requires each node-red service to have specific labels:

- `node-red: true`
- `description`
- `topic`
- `pattern`

```yaml
version: "3.0"
services:
  my-addition:
    labels:
      description: Addition
      node-red: true
      framework: hemera
      topic: math
      pattern: "{topic: 'graph', cmd: 'toyaml'}"
      function: "cb('hello world');"
    build:
      context: "./services/my-addition"

```

## Install

`npm i`

## Run tests

`ava`

## TODO

Parse actual service located in `build.context` (such as `./services/my-addition` above)

## License

2017 Tecla5.com



