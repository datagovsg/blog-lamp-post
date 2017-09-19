import _min from 'lodash/min'
import _groupBy from 'lodash/groupBy'
import buffer from '@turf/buffer'
import within from '@turf/within'
import {fromSVY21, toSVY21} from 'sg-heatmap/dist/helpers/geometry'

import {neighbourKeys} from './helpers/geometry'
import {printJSON} from './helpers/misc'

import data from '../data/geojsons/LampPost.json'
import roads from '../data/roads'

lampPostDistance(process.argv[2])

export default function lampPostDistance (roadId) {
  const road = roads.features.filter(d => d.properties.RD_CD === roadId)[0]
  if (!road) return
  const filtered = nearRoad(data, road)
  const histogram = nearestNeighbour(filtered)
  console.log(histogram)
  printJSON(histogram, `public/data/histogram/${roadId}.json`)
}

export function nearestNeighbour (data) {
  const points = data.features.map(f => f.geometry.coordinates.map(v => Math.round(v * 1000)))

  const groups = _groupBy(points, pt => pt[0].toFixed().slice(0, -5) + '.' + pt[1].toFixed().slice(0, -5))

  const histogram = {}

  Object.keys(groups).forEach(key => {
    const target = groups[key]
    const test = []
    test.push(...groups[key])
    neighbourKeys(key).forEach(k => {
      if (k in groups) test.push(...groups[k])
    })

    if (test.length === 1) return

    const nearest = target.map((pt1, i) => {
      const dist2 = test.map((pt2, j) => {
        if (i === j) return Infinity
        return Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2)
      })
      return Math.sqrt(_min(dist2)) / 1000
    })

    nearest.forEach(d => {
      const key = Math.round(d)
      histogram[key] = histogram[key] || 0
      histogram[key]++
    })
  })

  return histogram
}

export function nearRoad (data, road) {
  const roadId = road.properties.RD_CD
  data.features.forEach(feature => {
    feature.geometry.coordinates = fromSVY21(feature.geometry.coordinates)
  })
  road.geometry.coordinates = road.geometry.coordinates.map(d => d.map(fromSVY21))
  const bufferedRoad = buffer(road, 0.15)
  printJSON(bufferedRoad, `public/data/road/${roadId}.json`)
  const filtered = within(data, {type: 'FeatureCollection', features: [bufferedRoad]})
  printJSON(filtered, `public/data/lampPost/${roadId}.json`)
  filtered.features.forEach(feature => {
    feature.geometry.coordinates = toSVY21(feature.geometry.coordinates)
  })
  return filtered
}
