const http = require('http');
const fs = require('fs');
const chat = require('./chat/chat');

http.createServer((req, res) => {
  switch (req.url) {
    case ('/'):
      sendFile('./chat/chat.html', res);
      break;
    case ('/subscribe'):
      chat.subscribe(req, res);
      break;
    case ('/publish'):
      let body = '';

      req
        .on('readable', function() {
          var chunk;
          if (null !== (chunk = req.read())) {
            body += chunk;
          }

          if (body.length > 1e4) {
            res.statusCode = 413;
            res.end('Your message is too big for my little chat');
          }
        })
        .on('end', function() {
          try {
            body = JSON.parse(body);
            chat.publish(body.message);
            res.end('ok');
          } catch (e) {
            res.statusCode = 400;
            res.end('Bad Requeset');
            return;
          }
        })
      break;
    default:
      res.statusCode = 404;
      res.end('Not found')
  }
}).listen(1337);

function sendFile(fileName, res) {
  const fileStream = fs.createReadStream(fileName);


  fileStream
    .on('error', (err) => {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File not found');
      } else {
        res.statusCode = 500;
        res.end('Server error');
      }
    })
    .on('open', () => {
      console.log(`open ${fileName}`);
    })
    .on('close', () => {
      console.log(`close ${fileName}`);
    })
    .pipe(res);

  res.on('close', () => {
    fileStream.destroy();
  });
}