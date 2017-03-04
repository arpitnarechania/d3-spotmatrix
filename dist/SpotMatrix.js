/*****************************************************************************************
    @author: Arpit Narechania
    @email: arpitnarechania@gmail.com
    @project: d3-spotmatrix

    Copyright 2017 Arpit Narechania

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
    OR OTHER DEALINGS IN THE SOFTWARE.
******************************************************************************************/


function SpotMatrix(dataset,chart_options) {
    var spotRadius = chart_options.spot_radius;
    var minColor = chart_options.min_color;
    var maxColor = chart_options.max_color;
    var spotCellPadding = chart_options.spot_cell_padding;
    var spotCellMargin = chart_options.spot_cell_margin;
    var spotMatrixType = chart_options.spot_matrix_type;
    var strokeColor = chart_options.stroke_color;

    if(isNaN(spotRadius) || spotRadius < 0){
        throw new Error("Spot Radius must be a Positive Number");
    }

    if(isNaN(spotCellPadding) || spotCellPadding < 0){
        throw new Error("Spot Cell Padding must be a Positive Number");
    }

    if(isNaN(spotCellMargin) || spotCellMargin < 0){
        throw new Error("Spot Cell Margin must be a Positive Number");
    }

    if(!(spotMatrixType.localeCompare("fill") || spotMatrixType.localeCompare("color") || spotMatrixType.localeCompare("size") || spotMatrixType.localeCompare("ring"))){
       throw new Error("Valid spotMatrixTypes are 'fill,'color','size','ring'");
    }


    if(!isNaN(minColor)){
        throw new Error("minColor must be a String");
    }

    if(!isNaN(maxColor)){
        throw new Error("maxColor must be a String");
    }

    if(!isNaN(strokeColor)){
        throw new Error("strokeColor must be a String");
    }

    var div = d3.select('#SpotMatrix');
    var column_topics = d3.keys(dataset[0]);
    var extentOfData = d3.extent(
        function(array, names) {
            var res = [];
            array.forEach(function(item) {
                names.forEach(function(name) {
                    if (!isNaN(item[name]))
                        res = res.concat(item[name]);
                });
            });
            return (res);
        }(dataset, column_topics)
    )

    function toRadians(degs){
        return Math.PI*degs/180;
    }

    function toDegrees(radians){
        return 180*radians/Math.PI;
    }

    var minValue = extentOfData[0];
    var maxValue = extentOfData[1];

    var colorScale = d3.scale.linear().domain([minValue, maxValue])
        .range([minColor,maxColor]);

    var radiusScale = d3.scale.linear().domain([minValue, maxValue])
        .range([0,spotRadius]);

    var inverseRadiusScale = d3.scale.linear().domain([minValue, maxValue])
        .range([spotRadius,0]);

    var radialScale = d3.scale.linear().domain([minValue, maxValue])
        .range([0,toRadians(359)]);

    var gradientScaleSVG = div.append("svg").attr("width",0).attr("height",0);

    // append a table to the div
    var table = div.append("table")
        .attr("class","table")
        .classed("display", true);

    // append a header to the table
    var thead = table.append("thead");

    // append a body to the table
    var tbody = table.append("tbody");

    // append a row to the header
    var theadRow = thead.append("tr");

    // return a selection of cell elements in the header row
    // attribute (join) data to the selection
    // update (enter) the selection with nodes that have data
    // append the cell elements to the header row
    // return the text string for each item in the data array
    theadRow.selectAll("td")
        .data(d3.keys(dataset[0]))
        .enter()
        .append("td")
        .style({"padding":spotCellPadding+"px","margin":spotCellMargin+"px"})
        .html(function(d) {
            return evalText(d);
        });

    // table body rows
    var tableBodyRows = tbody.selectAll("tr")
        .data(dataset)
        .enter()
        .append("tr");


    //table body row cells
    tableBodyRows.selectAll("td")
        .data(function(d) {
            return d3.values(d);
        })
        .enter()
        .append("td")
        .style({"padding":spotCellPadding+"px","margin":spotCellMargin+"px"})
        .html(function(d) {
            return evalText(d);
        })
        .filter(function(d) {
            return !isNaN(d);
        })
        .append(function(d,i,j) {
            return renderSpots(d,i,j);
        });

    function renderSpots(d,i,j) {

        var w = spotRadius * 2;
        var h = spotRadius * 2;

        var spots = document.createElement("div");
        var svg = d3.select(spots).append("svg")
            .attr({width: w,height: h})
            .style({
            margin: spotCellMargin,
            padding: spotCellPadding});

        var elem = svg.selectAll("div")
            .data([d]);

        var elemEnter = elem.enter()
            .append("g");

        elemEnter.append("circle")
            .attr("class","spots")
            .attr(spotAttr(d,i,j))
            .style(spotStyle(d,i,j));

        if(spotMatrixType=='ring'){
            var elem = svg.selectAll("div")
            .data([d]);

            var elemEnter = elem.enter()
                .append("g");

            elemEnter.append("circle")
                .attr("class","spots")
                .attr({cx: spotRadius,cy: spotRadius,r: inverseRadiusScale(d)})
                .style({fill:minColor});

        }
        if(spotMatrixType=='sector'){

            var arc = d3.svg.arc()
                    .innerRadius(0)
                    .outerRadius(spotRadius)
                    .startAngle(0)
                    .endAngle(radialScale(d));

            var elem = svg.selectAll("div")
            .data([d]);

            var elemEnter = elem.enter()
                .append("g");

            elemEnter.append("path")
                .attr("class", "arc spots")
                .attr("transform","translate(" + spotRadius+ "," + spotRadius+ ")")
                .attr("d", arc)
                .style("fill",maxColor)
                .style("stroke",maxColor)
                .style("stroke-width",1)
        }

        add_tooltips(svg);

        function add_tooltips(){

            // Adding a tooltip which on mouseover shows the date range and the last_close points range.
            var tooltip = d3.select("body")
                .append('div')
                .attr('class', 'tooltip');

                tooltip.append('div')
                .attr('class', 'value');

                svg.selectAll(".spots")
                .on('mouseover', function(d) {

                    var html = d;
                    tooltip.select('.value').html(html);

                    tooltip.style('display', 'block');
                    tooltip.style('opacity',2);

                })
                .on('mousemove', function(d) {
                    tooltip.style('top', (d3.event.layerY + 10) + 'px')
                    .style('left', (d3.event.layerX - 25) + 'px');
                })
                .on('mouseout', function(d) {
                    tooltip.style('display', 'none');
                    tooltip.style('opacity',0);
                });

        }

        return spots;
    }

    function spotAttr(d,i,j){
        if(spotMatrixType!='size') {
               return {cx: spotRadius,cy: spotRadius,r: spotRadius, stroke:strokeColor};
        }
        return {cx: spotRadius,cy: spotRadius,r: radiusScale(d), stroke:strokeColor};
    }

    function spotStyle(d,i,j){
        if(spotMatrixType == 'color'){
            return {fill:colorScale(d)};
        }else if(spotMatrixType == 'fill'){
            var gradientScale = gradientScaleSVG
            .append("defs")
            .append("linearGradient")
            .attr("id", "gradientScale-"+i+","+j)
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%");

            var offset = (d/maxValue) * 100;

            gradientScale.append("stop").attr("offset", offset + "%").style("stop-color", maxColor);
            gradientScale.append("stop").attr("offset", offset + "%").style("stop-color", minColor);

            return {fill:"url(#gradientScale-" + i + "," + j + ")"};

        }else if(spotMatrixType == 'size'){
            return {fill:maxColor};

        }else if(spotMatrixType == 'ring'){
            return {fill:maxColor};
        }else if(spotMatrixType == 'sector'){
            return {fill:"white"};
        }
    }

    function evalColor(d) {
        if (!isNaN(d)) {
            return createSVG(d);
        } else {
            return d;
        }
    }

    function evalText(d) {
        if (!isNaN(d)) {
            //Do nothing
        } else {
            return "<b>" + d + "</b>";
        }
    }

}