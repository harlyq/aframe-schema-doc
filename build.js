#! /usr/bin/env node
const fs = require("fs")

const data = fs.readFileSync("aframe-schema-doc.js", "utf8")
const prepend = "#! /usr/bin/env node\n// THIS CODE IS AUTOMATICALLY GENERATED FROM build.js\n\n"
fs.writeFileSync("aframe-schema-doc.node.js", prepend + data, "utf8")