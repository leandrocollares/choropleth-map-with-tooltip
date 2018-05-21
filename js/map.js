const margin = {top: 15, right: 10, bottom: 25, left: 10},
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
    
// Tooltips show the percentage of international
// migrants in each country.
const tooltip = d3.select('#chart').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

// Colour scale used to colour the choropleth
// map and its legend.
const colourScale = d3.scaleThreshold()
    .domain([0, 5, 10, 15, 20, 30, 90])
    .range(d3.schemeReds[8]);

// Linear scale employed to set the x-position
// of the rectangles in the legend.
const x = d3.scaleLinear()
    .domain([0, 90])
    .rangeRound([4, 554]);

const xAxis = d3.axisBottom(x)
    .tickSize(15)
    .tickValues(colourScale.domain())
    .tickFormat(d => d);

// The Robinson projection is used to generate
// the map.
const mapProjection = d3.geoRobinson()
    .scale(150)
    .rotate([352, 0, 0])
    .translate([width / 2, height / 1.8]);

const path = d3.geoPath().projection(mapProjection);

Promise.all([
  d3.json('data/worldCountries.json'),
  d3.tsv('data/internationalMigrants.tsv')]).then(d => 
    ready(null, d[0], d[1]));

function ready(error, data, migrantPopulation) {
  const migrantPopulationById = {};

  migrantPopulation.forEach(d => {
    migrantPopulationById[d.id] = +d.migrantPopulation; });

  data.features.forEach(d => {
    d.migrantPopulation = migrantPopulationById[d.id]; });

  svg.append('g')
      .attr('class', 'countries')
    .selectAll('path')
      .data(data.features)
    .enter().append('path')
      .attr("d", path)
      .style('fill', d => colourScale(migrantPopulationById[d.id]))
      .style('stroke', '#d3d3d3')
      .style('stroke-width', 1)
      .style('opacity', 1)
      .on('mouseover', function(d) {
        let migrantPercentage = (d.migrantPopulation === undefined) ? 
          'not available' :
          d.migrantPopulation + '%';
        d3.select(this)
           .raise()
           .style('stroke', '#333333');
        tooltip.transition()
           .duration(200)
           .style('opacity', 0.9);
        tooltip.html(
          '<p><strong>' + d.properties.name + '</strong></p>' +
          '<p>' + migrantPercentage + '</p>')
           .style('left', (d3.event.pageX + 15) + 'px')
           .style('top', (d3.event.pageY - 30) + 'px');
      })
      .on('mouseout', function(d) {
        d3.select(this)
           .lower()
           .style('stroke', '#d3d3d3');
        tooltip.transition()
           .duration(200)
           .style('opacity', 0);
      })

  const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(25,' + height + ')')
      .call(xAxis);
    
  legend.selectAll('rect')
    .data(colourScale.range().map((color) => {
      let d = colourScale.invertExtent(color);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
    .enter().insert('rect', '.tick')
      .attr('height', 15)
      .attr('x', d => x(d[0]))
      .attr('width', d => (x(d[1]) - x(d[0])))
      .style('fill', d => colourScale(d[0]));

  legend.append('text')
      .attr('text-anchor', 'start')
      .attr('y', -6)
      .text('Percentage of international migrant population');         
};