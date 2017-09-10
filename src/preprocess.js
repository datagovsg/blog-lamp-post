import Zip from 'node-7z'
import {printJSON} from './helpers/misc'

const shapefile = require('shapefile')
const zip = new Zip()

zip.extractFull('data/raw/Static_ 2017_06.zip', 'data/raw')

zip.extractFull('data/raw/Static_ 2017_06/GEOSPATIAL/RoadSectionLine.zip', 'data/shapefiles')
zip.extractFull('data/raw/Static_ 2017_06/GEOSPATIAL/LampPost.zip', 'data/shapefiles')

shapefile.read('data/shapefiles/LampPost_May2017/LampPost.shp', 'data/shapefiles/LampPost_May2017/LampPost.dbf')
  .then(json => printJSON(json, 'data/geojsons/LampPost.json'))

shapefile.read('data/shapefiles/RoadSectionLine_May2017/RoadSectionLine.shp', 'data/shapefiles/RoadSectionLine_May2017/RoadSectionLine.dbf')
  .then(json => printJSON(json, 'data/geojsons/RoadSectionLine.json'))
