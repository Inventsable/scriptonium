# scriptonium

Compile modern Javascript down to Adobe standards and execute it on the fly without touching Typescript.

```bash
npm install scriptonium
```

```js
import scriptonium from "scriptonium";

let stringOfComplexCode =
  "(function(){ return `Good morning ${app.activeDocument.name}, how are you?` }())";

let result = await scriptonium(stringOfComplexCode);
// Returns "Good morning ILST, how are you?"
```

> Note: This is best used when paired with [battleaxedotco/gehenna](https://github.com/battleaxedotco/gehenna), since that pre-loads many ES6 shims and utilities.

### Arrow functions

Believe it or not the below is usable inside Adobe:

```js
// Using the gehenna's ILST utility method get()
get("layers")
  .filter((layer) => {
    // Filter out any non-generically named layer:
    return /^Layer\s\d{1,}$/.test(layer.name);
  })
  .forEach((layer) => {
    // Now act on resulting layers
    alert(layer.name);
    // Reports "Layer 1", "Layer 5", "Layer 6", etc.
  });}
```

### Template literals:

```js
alert(`Current layer is ${app.activeDocument.activeLayer.name}`);
```

Becomes:

```js
"use strict";

alert("Current layer is ".concat(app.activeDocument.activeLayer.name));
```

### Spread operators for Arrays, arguments and parameters:

```js
// Support for spread syntax
let a = ["a", "b", "c"];
let b = ["d", "e"];
let c = [...a, b]; // ['a', 'b', 'c', 'd', 'e']
```

Becomes:

```js
"use strict";

var a = ["a", "b", "c"];
var b = ["d", "e"];
var c = [].concat(a, [b]);
```
