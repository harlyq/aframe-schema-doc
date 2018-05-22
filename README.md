# aframe-schema-doc

Outputs documentation for the schemas (in Markdown format) for all calls to **AFRAME.registerComponent** and **AFRAME.registerSystem** in a given js file.

The process works by simulating a browser environment with jsdom, loading AFRAME, and then loading the input file.  We trap calls to registerComponent() or registerSystem(), parse the schema and output a Markdown table with information from the schema.  The documentation includes attribute name, type, default value and description (obtained from a *description* property).

### Examples
given **test.js**
```
AFRAME.registerComponent("test", {
  schema: {
    alpha: {
      type: "int",
      description: "define the transparency of the subject (%)",
    },
    beta: {
      default: 10,
      if: {gamma: ["a","c"]},
      description: "the maximum intensity",
    },
    gamma: {
      default: "a",
      oneOf: ["a", "b", "c"],
      description: "defines the type of system to use",
    }
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
|gamma|defines the type of system to use|'a'|['a', 'b', 'c']|
```
Copying into a Markdown file becomes
## Component test
| Property | Description | Default Value | Type |
| -------- | ----------- | ------------- | ---- |
|alpha|define the transparency of the subject (%)|0|int|
|beta|_if **gamma** is 'a' or 'c'_. the maximum intensity|10|number|
|gamma|defines the type of system to use|'a'|['a', 'b', 'c']|

### Installation
```
npm install -g aframe-schema-doc
```
### Usage
```
aframe-schema-doc <filename>
```
### Limitations
The application will try to load the file using **require()**, so if there are errors in the file that prevent it from executing then documentation will not be output.
