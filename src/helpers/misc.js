import fs from 'fs'

export function printJSON (json, filename, pretty) {
  const stringified = pretty ? JSON.stringify(json, null, '\t') : JSON.stringify(json)
  fs.writeFile(filename, stringified)
}
