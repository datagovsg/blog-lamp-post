import _groupBy from 'lodash/groupBy'
import _sortBy from 'lodash/sortBy'
import _partition from 'lodash/partition'
import simplify from '@turf/simplify'
import {chain} from './helpers/geometry'
import {printJSON} from './helpers/misc'
import data from '../data/geojsons/RoadSectionLine.json'

const [noGroup, toGroup] = _partition(data.features, d => ['NONAME', 'ZZZ38A'].indexOf(d.properties.RD_CD) > -1)
const grouped = _groupBy(toGroup, d => d.properties.RD_CD)

const features = Object.keys(grouped).map(key => {
  const merged = grouped[key].reduce((a, v) => {
    if (v.geometry.type === 'MultiLineString') {
      a.geometry.coordinates.push(...v.geometry.coordinates)
    } else if (v.geometry.type === 'LineString') {
      a.geometry.coordinates.push(v.geometry.coordinates)
    }
    return a
  }, {
    type: 'Feature',
    properties: grouped[key][0].properties,
    geometry: {type: 'MultiLineString', coordinates: []}
  })
  merged.geometry.coordinates = chain(merged.geometry.coordinates)
  const simplified = simplify(merged, 0.00001)
  simplified.geometry.coordinates = simplified.geometry.coordinates.map(d => {
    if (d[0][0] < d[d.length - 1][0]) return d
    if (d[0][0] > d[d.length - 1][0] || d[0][1] > d[d.length - 1][1]) return d.reverse()
    return d
  })
  simplified.geometry.coordinates = _sortBy(simplified.geometry.coordinates, d => d[0][0])
  return simplified
})

printJSON({type: 'FeatureCollection', features}, 'data/roads.json')
printJSON({type: 'FeatureCollection', features: noGroup}, 'data/dump.json')

const roadNames = {}
_sortBy(data.features, f => f.properties.RD_CD_DESC).forEach(f => {
  roadNames[f.properties.RD_CD_DESC] = f.properties.RD_CD
})

printJSON(roadNames, 'public/roadNames.json', true)
