import mapStyle from './helpers/mapStyle.js'
import {DatagovsgSimpleBar} from 'datagovsg-plottable-charts/lib/datagovsg-charts.min.js'

const map = new google.maps.Map(document.getElementById('map'), {
  center: new google.maps.LatLng(1.352083, 103.819836),
  zoom: 12,
  styles: mapStyle
})

function generateLayer (roadId) {
  const layer = new google.maps.Data()
  layer.setStyle({
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 2,
      fillColor: 'yellow',
      fillOpacity: 0.8,
      strokeColor: 'yellow',
      strokeOpacity: 0,
      strokeWeight: 0
    },
    strokeWeight: 1
  })
  layer.loadGeoJson(`data/road/${roadId}.json`)
  layer.loadGeoJson(`data/lampPost/${roadId}.json`)
  return layer
}

function updateChart (roadId) {
  return window.fetch(`data/histogram/${roadId}.json`)
    .then(res => {
      if (res.status !== 200) return {}
      return res.json()
    })
    .then(histogram => {
      const series = []
      for (let i = 0; i < 50; i++) {
        series.push({label: i + 1, value: histogram[i + 1] || 0})
      }
      return series
    })
}

let layer = new google.maps.Data()

const chart = new DatagovsgSimpleBar({
  data: [],
  xLabel: 'Meters',
  yLabel: 'Frequency'
})
chart.mount(document.getElementById('chart'))
updateChart('ALL').then(series => chart.update({data: series}))

const select = document.getElementById('select')
select.addEventListener('change', event => {
  const selected = event.target.value
  layer.setMap(null)
  if (selected !== 'ALL') {
    layer = generateLayer(selected)
    layer.setMap(map)
  }
  updateChart(selected).then(series => chart.update({data: series}))
})
