import fs from 'fs'

export function printJSON (json, filename) {
  fs.writeFile('data/' + filename, JSON.stringify(json))
}
