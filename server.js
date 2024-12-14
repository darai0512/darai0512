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
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end(`
    <html>
<head>
<body>

<div class="credit-layout "><div class="credit-info"><div class="credit-name">TEST</div></div><div class="payjp"><div class="payjp-button"></div></div><script type="text/javascript" src="https://checkout.pay.jp/prerelease" class="payjp-button" data-payjp-partial="true" data-payjp-extra-attribute-phone="#telHtml" data-payjp-key="pk_live_404e8708a69e75336c507f7d" data-payjp-three-d-secure="true" data-payjp-three-d-secure-workflow="subwindow">
</script></div>`)
    /*
  stat(localPath, (err, stat) => {
    if (err) {
      stream.respond({ ':status': 404 })
      stream.end('Not Found')
      return
    }
    stream.respondWithFile(localPath)
  })
  */
}).listen(3000);
