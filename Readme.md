# Node-red Docker import

Import [node-red](nodered.org) nodes from a *docker* project

## Install

`npm i`

## Run tests

`ava`

## Usage

```js
  let projectPath = path.resolve(baseDir, 'app')
  let result = await generate({
    path: projectPath
  })
```

## node-red nodes

```js
[ { name: 'my-subtraction',
    filePath: './services/my-subtraction',
    type: 'sub-match',
    topic: 'math',
    framework: 'hemera',
    description: 'Subtraction',
    pattern: '{topic: \'math\', cmd: \'sub\'}',
    function: 'cb(\'sub\');',
    maxMessages: '' },
  { name: 'my-addition',
    filePath: './services/my-addition',
    type: 'sub-match',
    topic: 'math',
    framework: 'hemera',
    description: 'Addition',
    pattern: '{topic: \'math\', cmd: \'add\'}',
    function: 'cb(\'add\');',
    maxMessages: 5 } ]
```

## docker-compose.yml

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
      maxMessages: 5
      pattern: "{topic: 'math', cmd: 'add'}"
    build:
      context: "./services/my-addition"
```

## Service function

Parses service logic located at path referenced by `build.context`.
`context: "./services/my-addition"` resolved to file at `./services/my-addition/index.js`

## License

2017 Tecla5.com



