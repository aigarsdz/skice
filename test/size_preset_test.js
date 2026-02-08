import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateSizeInPX } from '../public/canvas_size.js'

const DPI = 300
const expectedResults = {
	A0: [9933, 14043],
	A1: [7016, 9933],
	A2: [4961, 7016],
	A3: [3508, 4961],
	A4: [2480, 3508],
	A5: [1748, 2480],
	A6: [1240, 1748],
	A7: [874, 1240],
	A8: [614, 874],
	A9: [437, 614],
	A10: [307, 437],

	B0: [11811, 16701],
	B1: [8350, 11811],
	B2: [5906, 8350],
	B3: [4169, 5906],
	B4: [2953, 4169],
	B5: [2079, 2953],
	B6: [1476, 2079],
	B7: [1039, 1476],
	B8: [732, 1039],
	B9: [520, 732],
	B10: [366, 520],

	C0: [10831, 15319],
	C1: [7654, 10831],
	C2: [5409, 7654],
	C3: [3827, 5409],
	C4: [2705, 3827],
	C5: [1913, 2705],
	C6: [1346, 1913],
	C7: [957, 1346],
	C8: [673, 957],
	C9: [472, 673],
	C10: [331, 472],

	'Junior Legal': [1500, 2400],
  Letter: [2550, 3300],
  Legal: [2550, 4200],
  Tabloid: [3300, 5100],

  'ANSI A': [2550, 3300],
  'ANSI B': [3300, 5100],
  'ANSI C': [5100, 6600],
  'ANSI D': [6600, 10200],
  'ANSI E': [10200, 13200],

  RA0: [10157, 14409],
  RA1: [7205, 10157],
  RA2: [5079, 7205],
  RA3: [3602, 5079],
  RA4: [2539, 3602],

  SRA0: [10630, 15118],
  SRA1: [7559, 10630],
  SRA2: [5315, 7559],
  SRA3: [3780, 5315],
  SRA4: [2657, 3780]
}

test('preset sizes produce correct pixel values', () => {
	for (const sizeFormatName of Object.keys(expectedResults)) {
		const result = calculateSizeInPX(sizeFormatName, DPI)

		assert.strictEqual(result[0], expectedResults[sizeFormatName][0], `Incorrect width for ${sizeFormatName}`)
		assert.strictEqual(result[1], expectedResults[sizeFormatName][1], `Incorrect height for ${sizeFormatName}`)
	}
})