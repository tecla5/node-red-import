const rdr = require('readdir-recursive-promise')
const fs = require('fs-extra')
const path = require('path')
const readYaml = require('read-yaml-promise')

async function filesAt(projectPath) {
  try {
    return await rdr.readdirAsync(projectPath)
  } catch (err) {
    console.error(err)
  }
}

function isNodeRedService(entry) {
  let labels = entry.labels
  return labels && labels['node-red']
}

function createNode(service, name) {
  let labels = service.labels || {}
  let node = {
    name,
    type: 'sub-match'
    // topic: labels.topic,
    // framework: labels.framework,
    // description: labels.description || ''
  }
  node = ['topic', 'framework', 'description', 'pattern', 'function'].reduce((acc, key) => {
    node[key] = labels[key] || ''
    return node
  }, node)

  // TODO: extrat swarm config
  return node
}

async function filterServices(services) {
  return Object.keys(services).reduce((acc, key) => {
    let entry = services[key]

    // console.log('labels', key, entry.labels)
    if (isNodeRedService(entry)) {
      // console.log('set acc', key, entry)
      // acc[key] =
      let node = createNode(entry, key)
      acc.push(node)
    }
    // console.log('acc', acc)
    return acc
  }, [])
}

async function readCompose(filePath) {
  // await fs.readFile
  let obj = await readYaml(filePath)
  let services = obj.services
  return services ? await filterServices(services) : {}
}

async function parseDc({
  filePath
}) {
  return await readCompose(filePath)
}

module.exports = async function (config = {}) {
  if (!config.path) {
    throw Error('Requires path option in config object')
  }
  const projectPath = config.path
  // console.log(projectPath)
  let project = await filesAt(projectPath)
  let dockerCompose = project.files.filter(file =>
    /^docker-compose.ya?ml$/.test(file.name)
  )
  if (dockerCompose) {
    dockerCompose = dockerCompose[0]
    let filePath = path.join(projectPath, dockerCompose.name)
    return {
      dc: await parseDc({
        filePath
      })
    }
  }
  return {}
}