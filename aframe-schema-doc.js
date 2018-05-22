#!/usr/bin/env node

const path = require("path")
const jsdom = require("jsdom")
const { JSDOM } = jsdom


let ARG_SORT = true

const filename = process.argv[2]
console.assert(filename, `first parameter should be a .js filename to parse`)

// HACK globals until it works
global.window = (new JSDOM(``, { pretendToBeVisual: true })).window
global.navigator = {
  userAgent: "node.js",
  platform: "windows", // This can be set to mac, windows, or linux
  appName: "Google Chrome", // Be sure to define this as well
}
global.screen = {}
global.document = window.document

global.AFRAME = require("aframe/src")

// switch to friendly slashes and ensure relative to the current directory
let safeFilename = filename.replace("\\", "/")
if (!path.isAbsolute(filename)) {
  safeFilename = process.cwd() + "/" + safeFilename
}
console.log(`Filename '${filename}' ${safeFilename !== filename ? "--> '" + safeFilename + "'" : ""}\n`)

// translate the schema into a markdown string
function schemaToMarkdown(type, name, schema) {
  let str = `
## ${type} ${name}
| Property | Description | Default Value | Type |
| -------- | ----------- | ------------- | ---- |`

  function printIf(obj) {
    if (typeof obj !== "object") return ""

    let str = ""
    for (let key in obj) {
      if (Array.isArray(obj[key])) str += `_if **${key}** is '${obj[key].join("' or '")}'_. `
    }
    return str
  }

  function printDefaultFromType(t) {
    switch (t) {
      case undefined: return "undefined"
      case "array": return []
      case "vec2": return "{x: 0, y: 0}"
      case "vec3": return "{x: 0, y: 0, z: 0}"
      case "vec3": return "{x: 0, y: 0, z: 0, w: 0}"
      case "int":
      case "number": return 0
      case "string": return "''"
      case "color": return "#FFF"
      case "asset":
      case "audio":
      case "model":
      case "map": return ""
      case "selectorAll":
      case "selector": return "null"
      default: return `unknown: ${t}`
    }
  }

  function printValue(v, quote = true) {
    if (typeof v === "undefined") {
      return "undefined"
    } else if (typeof v === "object") {
      if (Array.isArray(v)) {
        return "[" + v.map(x => printValue(x)).join(", ") + "]"
      } else {
        return "{" + Object.keys(v).map(x => `${x}: ${printValue(v[x])}`).join(", ") + "}"
      }
    } else if (typeof v === "number" && v === Number.MAX_VALUE) {
      return "MAX_VALUE"
    } else if (quote && typeof v === "string") {
      return `'${v}'`
    } else {
      return v
    }
  }

  function printTypeFromDefault(d) {
    let type = typeof d
    switch (type) {
      case "boolean":
      case "string":
      case "number": return type
      case "object": 
        if (Array.isArray(d)) return "array"
      default:
        console.error(`unknown type for default "${d}", assuming string`)
        return "string"
    }
  }

  let schemaKeys = Object.keys(schema)
  if (ARG_SORT) {
    schemaKeys.sort()
  }

  for (let key of schemaKeys) {
    let property = schema[key]
    let description = printIf(property.if) + property.description
    let def = typeof property.default !== "undefined" ? printValue(property.default) : printDefaultFromType(property.type)
    let type = property.oneOf ? printValue(property.oneOf, false) : (property.type ? property.type : printTypeFromDefault(property.default))

    str += `\n|${key}|${description}|${def}|${type}|`
  }

  return str
}

// replace the AFRAME register functions with our output function
AFRAME.registerComponent = function(name, options) {
  console.log(schemaToMarkdown("Component", name, options.schema))
}

AFRAME.registerSystem = function(name, options) {
  console.log(schemaToMarkdown("System", name, options.schema))
}

// read the js file
const x = require(safeFilename)
process.exit()

