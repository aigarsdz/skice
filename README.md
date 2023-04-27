## skice

A command-line tool for creative coding using HTML canvas. It helps to create and work with locally
hosted projects for small experiments or large artworks. `skice` is heavily inspired by a similar but
much more feature-rich tool called [cvanvas-sketch](https://github.com/mattdesl/canvas-sketch).
Unlike "canvas-sketch" it doesn't provide an abstraction layer and the code you write is directly
sent to the browser as is.

### Installation

```
npm install -g skice
```

### Usage

```
skice sketch.js --extras=noise --new --open
```

### Options
#### -h, --help

```
skice -h
```

Outputs information about the usage, available options and additional packages.

#### --new

```
skice sketch.js --new
```

Creates a new sketch file at the specified path using the default template (three.js).

#### --open

```
skice sketch.js --open
```

Opens the specified sketch file in the default browser.

#### --extras

```
skice sketch.js --extras=noise
```

Creates a new JSON file with a list of additional packages that can be imported into a sketch using
[an import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap).
This file can also be created manually, and the content of it looks like this:

```json
{
  "gl-noise": "https://unpkg.com/gl-noise@1.6.1/build/glNoise.m.node.js"
}
```

Currently, there is only one package that you can specify with this option, but you can add any
package that works with import maps to this file.

Available extras:
- noise - [gl-noise](https://github.com/FarazzShaikh/glNoise) package

