# aframe-schema-doc

Outputs documentation for the schemas (in Markdown format) for all calls to **AFRAME.registerComponent** and **AFRAME.registerSystem**.

 We monkey patch calls to registerComponent() or registerSystem(), parse the schema and output a Markdown table with information from the schema.  The documentation includes attribute name (converted to kebab-case), type, default value and description (obtained from a *description* property).

 If using from Node the process works by simulating a browser environment with jsdom, loading AFRAME, and then loading the input file. 

 If using from the browser, the documentation is output to the console.

### Examples
Given **test.js**
```javascript
AFRAME.registerComponent("test", {
  schema: {
    alpha: {
      type: "int",
      description: "define the transparency of the subject (%)",
    },
    gammaEpsilon: {
      default: "a",
      oneOf: ["a", "b", "c"],
      description: "defines the type of system to use",
    },
    beta: {
      default: 10,
      if: {gamma: ["a","c"]},
      description: "the maximum intensity",
    },
  }
})
```
**aframe-schema-doc test.js**
```
A-Frame Version: 0.8.2 (Date 2018-04-15, Commit #b20527f)
three Version: github:supermedium/three.js#r90fixMTLLoader
WebVR Polyfill Version: ^0.10.5
AFRAME version 0.8.2
Filename 'test.js' --> './test.js'

## Component test
| Property | Description | Default Value | Type |
| -------- | ----------- | ------------- | ---- |
|alpha|define the transparency of the subject (%)|0|int|
|beta|_if **gamma** is 'a' or 'c'_. the maximum intensity|10|number|
|gammaEpsilon|defines the type of system to use|'a'|['a', 'b', 'c']|
```
Copying into a Markdown file becomes
## Component test
| Property | Description | Default Value | Type |
| -------- | ----------- | ------------- | ---- |
|alpha|define the transparency of the subject (%)|0|int|
|beta|_if **gamma** is 'a' or 'c'_. the maximum intensity|10|number|
|gammaEpsilon|defines the type of system to use|'a'|['a', 'b', 'c']|

### Installation
Using Node
```
npm install -g aframe-schema-doc
```
no installation needed, if using from the browser
### Usage
If using Node
```
aframe-schema-doc <filename>
```
or from the browser, **include the script after AFRAME, but before your script files**. For example:
```html
<head>
  <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-schema-doc/dist/aframe-schema-doc.js"></script>
  <script src="YOUR .JS FILE HERE"></script>
  <script> /* OR YOUR SCRIPT HERE */ </script>
</head>
```
### Configuration

| Switch | Description |
| -------- | ----------- |
| --unsorted | output in the same order as the schema |
| --sorted | output in alphabetical order (default) |
| --kebabcase | output attribute names in kebab-case |
| --camelcase | output attribute names in camelCase (default) |

### Limitations
If using Node, the application will try to load the file using **require()**, so if there are errors in the file that prevent it from executing then documentation will not be output.
