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
skice sketch.js --extras=noise --new --open --context=2d
```

### Options
#### -h, --help

```
skice -h
```

Outputs information about the usage, available options and additional packages.

#### -v, --version

```
skice -v
```

Outputs the version number.

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

#### --context

Selects the canvas context to use. A different sketch template will be used based on this value.
The default is `webgl`.

Supported contexts:

- webgl (default)
- 2d

#### --port

Changes the port number on which the server will be listening. Accepts any valid port number between
1 and 65535.

#### --no-server

Prevents the HTTP server from launching.

### Settings

Every sketch file has access to the `CANVAS_SETTINGS` object and `CanvasSettings` class. They can be
used to adjust rendering and export options.

#### `CANVAS_SETTINGS.width`

The width of the canvas element. It will change automatically when the browser window
gets smaller than this value.

#### `CANVAS_SETTINGS.height`

The height of the canvas element. It will change automatically when the browser window
gets smaller than this value.

#### `CANVAS_SETTINGS.exportAs`

The export format. The default is `image`.

Possible values:

- image (exports as a PNG file)
- video/* (* can be any video format supported by the browser, e.g., video/webm)

#### `CANVAS_SETTINGS.duration`

The duration of the video file if a video format is used for the `exportAs` setting. It must be in
milliseconds. The default value is `5000`.

### Upgrading from 1.3.2 to 1.4.x

Some of the functionality has been moved from the HTML template to the sketch file in preparation for
version 2.0.0. Refer to the updated [Canvas 2D](templates/2d_sketch.js) and [WebGL](templates/webgl_sketch.js)
sketch templates to see what code needs to be changed, but the most important part is to add `CanvasSettings`
import and instantiation as well as a reference to the canvas element to your existing sketches like this.

```js
import CanvasSettings from 'canvas_settings'

const canvas = document.getElementById('sketch_canvas')
const canvasSettings = new CanvasSettings()
```

ALternatively you can keep the old naming convention.

```js
import CanvasSettings from 'canvas_settings'

const canvas = document.getElementById('sketch_canvas')
const CANVAS_SETTINGS = new CanvasSettings()
```
