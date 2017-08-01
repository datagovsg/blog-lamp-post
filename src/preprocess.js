import fs from 'fs'
import unzip from 'unzip'
var shapefile = require('shapefile')

fs.createReadStream('data/Static_ 2017_06.zip').pipe(unzip.Extract({path: 'data'}))

fs.createReadStream('data/Static_ 2017_06/GEOSPATIAL/RoadSectionLine.zip').pipe(unzip.Extract({path: 'data/shapefiles'}))
fs.createReadStream('data/Static_ 2017_06/GEOSPATIAL/LampPost.zip').pipe(unzip.Extract({path: 'data/shapefiles'}))

shapefile.read('data/shapefiles/LampPost_May2017/LampPost.shp', 'data/shapefiles/LampPost_May2017/LampPost.dbf')
  .then(json => fs.writeFile('data/geojsons/LampPost.json', JSON.stringify(json)))

shapefile.read('data/shapefiles/RoadSectionLine_May2017/RoadSectionLine.shp', 'data/shapefiles/RoadSectionLine_May2017/RoadSectionLine.dbf')
  .then(json => fs.writeFile('data/geojsons/RoadSectionLine.json', JSON.stringify(json)))
