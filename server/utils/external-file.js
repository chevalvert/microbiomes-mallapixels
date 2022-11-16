// Handle both pkg and node filesystem for dynamic calls
// SEE https://github.com/vercel/pkg#snapshot-filesystem

const path = require('path')
module.exports = function (relativePath) {
  const dirname = process.pkg
    ? path.dirname(process.execPath)
    : path.join(__dirname, '..')
  return path.resolve(dirname, relativePath)
}
