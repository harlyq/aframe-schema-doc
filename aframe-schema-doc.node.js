#! /usr/bin/env node
// THIS CODE IS AUTOMATICALLY GENERATED USING build.js

// NODE env - setup jsdom and determine the filename to use
if (typeof process === "object" && Object.prototype.toString.call(process) === "[object process]") {
  const jsdom = require("jsdom")
  const { JSDOM } = jsdom
   
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

  config = {sort: true, kebabCase: false}

  for (let i = 2, n = process.argv.length; i < n; i++) {
    switch(process.argv[i].toLowerCase()) {
      case "--unsorted": config.sort = false; console.log("disable sort"); break
      case "--camelcase": config.kebabCase = false; console.log("output camel case"); break
      case "--sorted": config.sort = true; console.log("enable sort"); break
      case "--kebabcase": config.kebabCase = true; console.log("output kebab case"); break
      default: 
        if (process.argv[i].includes("--")) {
          console.error(`unknown switch: '${process.argv[i]}'`)
        } else {
          filename = process.argv[i]
        }
    }
  }
}


(function(AFRAME, log, config) {
  let ARG_SORT = true

  // translate the schema into a markdown string
  function schemaToMarkdown(type, name, schema, config) {
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

    function toKebabCase(str) {
      return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    }   

    let schemaKeys = Object.keys(schema)
    if (config.sort) {
      schemaKeys.sort()
    }

    for (let key of schemaKeys) {
      let attr = config.kebabCase ? toKebabCase(key) : key
      let property = schema[key]
      let description = printIf(property.if) + property.description
      let def = typeof property.default !== "undefined" ? printValue(property.default) : printDefaultFromType(property.type)
      let type = property.oneOf ? printValue(property.oneOf, false) : (property.type ? property.type : printTypeFromDefault(property.default))

      str += `\n|${attr}|${description}|${def}|${type}|`
    }

    return str
  }

  // replace the AFRAME register functions with our output function
  const oldRegisterComponent = AFRAME.registerComponent
  AFRAME.registerComponent = function(name, options) {
    log(schemaToMarkdown("Component", name, options.schema, config))
    oldRegisterComponent(name, options)
  }

  const oldRegisterSystem = AFRAME.registerSystem
  AFRAME.registerSystem = function(name, options) {
    log(schemaToMarkdown("System", name, options.schema, config))
    oldRegisterSystem(name, components)
  }

})(AFRAME, args => console.log(args), config || {sort: true, kebabCase: false})

// NODE env - load the file 
if (typeof process === "object" && Object.prototype.toString.call(process) === "[object process]") {
  const path = require("path")

  // switch to friendly slashes and ensure relative to the current directory
  // const filename = process.argv[2]
  console.assert(filename, `missing .js filename to parse`);
  
  let safeFilename = filename.replace("\\", "/")
  if (!path.isAbsolute(filename)) {
    safeFilename = process.cwd() + "/" + safeFilename
  }
  console.log(`Filename '${filename}' ${safeFilename !== filename ? "--> '" + safeFilename + "'" : ""}\n`);

  // read the js file
  require(safeFilename)
  process.exit()
}
