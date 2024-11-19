import {stat} from 'fs'
import {createSecureServer} from 'http2'
import path from 'path'
import {ephemeral} from 'tls-keygen'
const options = await ephemeral({
  commonName: 'localhost',
  entrust: false
})
createSecureServer(await ephemeral()).on('stream', (stream, headers) => {
  let p = headers[':path']
  if (p === '/' || p === '/index') {
    p = '/index.html'
  }
  const localPath = path.resolve(import.meta.dirname, `.${p}`)
  stat(localPath, (err, stat) => {
    if (err) {
      stream.respond({ ':status': 404 })
      stream.end('Not Found')
      return
    }
    stream.respondWithFile(localPath)
  })
}).listen(3000);
