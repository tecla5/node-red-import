import path from 'path'
import test from 'ava'
import {
  generate,
  generateJson
} from '../src'
import expected from '../fixtures/single-service'

test('project to json nodes', async t => {
  let baseDir = process.cwd() || __dirname
  let projectPath = path.resolve(baseDir, 'app')
  let result = await generate({
    path: projectPath
  })

  let json = await generateJson({
    path: projectPath
  })

  // TODO: compare
  function compareServices(actual, expected) {
    return true
  }

  function createAllSame({
    item,
    compare
  }) {
    function same(key) {
      // console.log('same', key, actual[key], item[key])
      let a = String(item[key])
      let b = String(compare[key])
      t.is(a, b)
    }

    return function allSame(...keys) {
      keys.map(key => same(key))
    }
  }

  function compareDc(actual, expected) {
    let compareSet = expected.list.map((exp) => {
      let act = actual.find(e => e.name === exp.name)
      return {
        expected: exp,
        actual: act
      }
    });
    compareSet.map(pair => {
      let item = pair.actual
      let compare = pair.expected
      createAllSame({
        item,
        compare
      })('id', 'name', 'topic', 'description', 'framework', 'pattern', 'function', 'maxMessages', 'swarmCount')
    })
  }
  console.log('dc', result.dc)
  console.log('json', json)

  compareDc(result.dc, expected)
  compareServices(result.services, expected)
})