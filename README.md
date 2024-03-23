# skice

A command-line tool for creative coding using HTML canvas. It helps to create and work with locally
hosted projects for small experiments or large artworks. `skice` is heavily inspired by a similar but
much more feature-rich tool called [cvanvas-sketch](https://github.com/mattdesl/canvas-sketch).
Unlike "canvas-sketch" it doesn't provide an abstraction layer and the code you write is directly
sent to the browser as is.

## Installation

```
npm install -g skice
```

## Usage

```
skice <command> [<path>] [options...]
```

## Commands
### help, --help, -h

Outputs the help text either for `skice` or the specified command.

```bash
skice help

skice help run
```

### version

Outputs the version number.

```bash
skice version
```

### new

Creates a new sketch project.

```bash
skice new /path/to/sketch_project --context webgl

skice new /path/to/sketch_project --context 2d
```

### run

Runs the project using a local server.

```bash
cd /path/to/sketch_project

skice run

skice run --port 8000

skice run --no-browser
```

### upgrade

Upgrades the project from an older version.

```bash
skice upgrade /path/to/sketch_project --from 1.4.1 --context webgl
```

## Settings

`skice` projects have access to `CanvasSettings` class which provides some useful functionality
like automatic resizing and image export.

### CanvasSettings#width

The width of the canvas element. It will change automatically when the browser window
gets smaller than this value.

### CanvasSettings#height

The height of the canvas element. It will change automatically when the browser window
gets smaller than this value.

### CanvasSettings#exportAs

The export format. The default is `image`.

Possible values:

- image (exports as a PNG file)
- video/* (* can be any video format supported by the browser, e.g., video/webm)

### CanvasSettings#duration

The duration of the video file if a video format is used for the `exportAs` setting. It must be in
milliseconds. The default value is `5000`.

### CanvasSettings#enableExport()

Enables exporting canvas in the specified format using a keyboard shortcut `Ctrl+S`.

```js
const canvasSettings = new CanvasSettings()

canvasSettings.enableExport(canvas, renderer, scene, camera)
```

## `network` module

This module provides convenience function for working with network requests.

Available functions:
- importPlainText(url: string): Promise<string> - loads a plain text file. It can be useful for importing GLSL files.

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

Alternatively you can keep the old naming convention.

```js
import CanvasSettings from 'canvas_settings'

const canvas = document.getElementById('sketch_canvas')
const CANVAS_SETTINGS = new CanvasSettings()
```
