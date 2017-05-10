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

const props = ['id', 'topic', 'framework', 'description', 'pattern', 'function', 'maxMessages']

function createNode(service, name) {
  let labels = service.labels || {}
  let build = service.build
  let filePath = build.context

  let node = {
    name,
    filePath,
    type: 'sub-match'
  }
  node = props.reduce((acc, key) => {
    node[key] = labels[key] || ''
    return node
  }, node)

  // TODO: extrat swarm config
  return node
}

async function filterServices(services) {
  return Object.keys(services).reduce((acc, key) => {
    let entry = services[key]
    if (isNodeRedService(entry)) {
      let node = createNode(entry, key)
      acc.push(node)
    }
    return acc
  }, [])
}

async function readCompose(filePath) {
  let obj = await readYaml(filePath)
  let services = obj.services
  return services ? await filterServices(services) : {}
}

async function parseDc({
  filePath
}) {
  return await readCompose(filePath)
}

function filterServiceFiles(files, filePath) {
  function reducer(acc, file) {
    if (file.files) {
      let results = filterServiceFiles(file.files, file.path)
      acc = acc.concat(results)
    } else if (file.size && filePath && /\/services\//.test(filePath)) {
      let matches = filePath.match(/\/services\/(.+)/)
      let service
      if (matches) {
        service = matches[1]
      }
      let fullPath = path.join(filePath, file.name)
      let content = fs.readFileSync(fullPath, 'utf8')
      let node = {
        service,
        content,
        name: file.name,
        filePath: fullPath
      }
      acc = acc.concat(node)
    }
    return acc
  }
  return files.reduce(reducer, [])
}

function flat(data) {
  return data.reduce((r, e) => Array.isArray(e) ? r = r.concat(flat(e)) : r.push(e) && r, [])
}

async function populate(dc, services) {
  let x = 20,
    dx = 100
  let y = 20,
    dy = 50
  return dc.map(conf => {
    let serviceMatch = services.find(service => {
      let confPath = conf.filePath.slice(2)
      let folderMatch = new RegExp(confPath).test(service.filePath)
      let serviceFile = path.basename(service.filePath)
      let confFile = path.basename(confPath)
      let fileMatch = (path.extname(confPath) === '') ? serviceFile === 'index.js' : serviceFile === confFile
      return folderMatch && fileMatch
    })
    x = x + dx
    y = y + dy
    conf.x = x
    conf.y = y
    conf.function = serviceMatch.content
    return conf
  })
}

async function generate(config = {}) {
  if (!config.path) {
    throw Error('Requires path option in config object')
  }
  const projectPath = config.path
  let project = await filesAt(projectPath)
  let dockerCompose = project.files.filter(file =>
    /^docker-compose.ya?ml$/.test(file.name)
  )

  let services = filterServiceFiles(project.files)
  // console.log('services', services)
  if (dockerCompose) {
    dockerCompose = dockerCompose[0]
    let filePath = path.join(projectPath, dockerCompose.name)
    let dc = await parseDc({
      filePath
    })
    dc = await populate(dc, services)
    // console.log('dc', dc)
    return {
      dc,
      services
    }
  }
  return {}
}

async function generateJson(config) {
  let result = await generate(config)
  return JSON.stringify(result.dc)
}

module.exports = {
  generate,
  generateJson
}