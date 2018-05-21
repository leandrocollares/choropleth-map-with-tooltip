# Choropleth map with legend

An interactive choropleth map that shows
the percentage of international migrant population around the world in 2017.

The visualization is implemented with D3.js version 5.0.0 and based
on Mike Bostock's [block](https://bl.ocks.org/mbostock/4060606). 

The Robinson projection was used to generate the map. This projection
was devised to create visually appealing world maps. Distortion is 
very low along the equator and increases towards the poles.

A threshold scale is employed to colour the map and the legend.
  
## Getting started

* Clone or download the repository. 

* Run a local web server<sup>1</sup> so that the external data file can be loaded.

* Interact with the scatterplot in your web browser.

<sup>1</sup> If Python is installed on the computer, execute one of the following to run a web server locally on port 8000: 

* ```python -m SimpleHTTPServer 8000 ``` for Python 2.x
* ```python -m http.server 8000 ``` for Python 3.x

## Data source

[United Nations International Migration Report 2017 - Highlights](http://www.un.org/en/development/desa/population/migration/publications/migrationreport/docs/MigrationReport2017_Highlights.pdf). 