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
