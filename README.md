# d3-spotmatrix

**d3-spotmatrix** is an open-source JavaScript library for rendering custom Spot Matrix Charts using the D3.js library.

Check out an [Example](https://arpitnarechania.github.io/d3-spotmatrix/) where you can test various configuration options.

# Installation

Download d3-spotmatrix using bower.

```
bower install d3-spotmatrix --save
```

To use this library then, simply include d3.js, SpotMatrix.js and SpotMatrix.css:

``` html
<script src="/path/to/d3.min.js"></script>
<script src="/path/to/dist/SpotMatrix.css"></script>
<script src="/path/to/dist/SpotMatrix.js"></script>
```

# Usage

To use this library, you must create a container element and instantiate a new
SpotMatrix:

```html
<div id="SpotMatrix"></div>
```


Data
```
var dataset = [{
        "Options": "Option 1",
        "Usable": 82,
        "Scalable": 32,
        "Flexible": 34,
        "Durable": 10,
        "Capable": 73,
        "Stable": 17
    }, {
        "Options": "Option 2",
        "Usable": 55,
        "Scalable": 12,
        "Flexible": 42,
        "Durable": 50,
        "Capable": 19,
        "Stable": 61
    }]
```

Setting chart parameters
``` javascript

        var chart_options = {
            spot_radius : 15,
            spot_cell_padding : 5,
            spot_cell_margin : 5,
            min_color : '#efefef',
            max_color : '#01579b',
            stroke_color : '#01579b',
            spot_matrix_type : 'ring'
        }
        SpotMatrix(dataset,chart_options);

```

## Options

| Option                     | Description                                                               | Type     | Options
| -------------------------- | ------------------------------------------------------------------------- | -------- | ------------------------- |
| `spot_radius`              | The Spot Radius (in pixels)                                               | number   | `15`                      |
| `spot_cell_padding`        | The Spot Cell Padding (in pixels)                                         | number   | `5`                       |
| `spot_cell_margin`         | The Spot Cell Margin (in pixels)                                          | number   | `5`                       |
| `max_color`                | The maximum of the color range                                            | string   | `'green'`                 |
| `min_color`                | The minimum of the color range                                            | string   | `'white'`                 |
| `stroke_color`             | The Spot Stroke Color                                                     | string   | `'black'`                 |
| `spot_matrix_type`         | The type of Spot Matrix (ring/size/color/fill)                            | string   | `'fill'`                  |

# Author

Arpit Narechania
arpitnarechania@gmail.com

# License

MIT license.