module.exports = {
  list: [{
    "id": "da8d9fae.39952",
    "type": "sub-match",
    "description": "Addition",
    "z": "e2a62830.572358",
    "name": "my-addition",
    "topic": "math",
    "framework": "hemera",
    "pattern": "{topic: 'math', cmd: 'add'}",
    "function": `cb('add');`,
    "validators": "",
    "swarmCount": "1",
    "maxMessages": "5",
    "x": 322.27272727272725,
    "y": 260.9090909090909,
    "wires": [
      []
    ]
  }, {
    "id": "da8d9fae.39951",
    "type": "sub-match",
    "description": "Subtraction",
    "z": "e2a62830.572358",
    "name": "my-subtraction",
    "topic": "math",
    "framework": "hemera",
    "pattern": "{topic: 'math', cmd: 'sub'}",
    "function": `cb('sub');`,
    "validators": "",
    "swarmCount": "2",
    "maxMessages": "",
    "x": 322.27272727272725,
    "y": 260.9090909090909,
    "wires": [
      []
    ]
  }],
  item: {
    dockerServices: [{
      "name": "my addition",
      "swarmCount": "1"
    }]
  }
}