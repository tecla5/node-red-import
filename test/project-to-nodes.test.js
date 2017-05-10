import path from 'path'
import test from 'ava'
import generate from '../src'
import expected from '../fixtures/single-service'


test('project to json nodes', async t => {
  let baseDir = process.cwd() || __dirname
  let projectPath = path.resolve(baseDir, 'app')
  let result = await generate({
    path: projectPath
  })

  // TODO: compare
  function compareServices(actual, expected) {
    return true
  }

  function compareDc(actual, expected) {
    function same(key) {
      console.log('same', key, actual[key], item[key])
      t.is(actual[key], item[key])
    }

    function allSame(...keys) {
      keys.map(key => same(key))
    }

    let item = expected.list[0]
    actual = actual[0]
    console.log('actual', actual)
    console.log('item', item)

    allSame('name', 'topic', 'description', 'framework', 'pattern', 'function')
  }

  compareDc(result.dc, expected)
  compareServices(result.services, expected)
})