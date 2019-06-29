const http = require('http');
const fs = require('fs');
const chat = require('./chat/chat');

http.createServer((req, res) => {
  switch (req.method) {
    case ('GET'):
      if (req.url === '/') {
        sendFile('./index.html', res);
      } else {
        console.log(req.url);
        sendFile('./files' + req.url, res);
      }
      break;
    case ('POST'): 
      var jsonString = '';

      req.on('data', function (data) {
        jsonString += data;
      });

      req.on('end', function () {
          // console.log(JSON.parse(jsonString));
          console.log(jsonString);
      });
      // fs.writeFile('./files/qwe', 'hey', function(err) {
      //   if(err) {
      //       return console.log(err);
      //   }

      //   console.log("The file was saved!");
      // })
      res.end('file');
      break;
    case ('DELETE'): 
      console.log(req.headers)
      res.end('delete');
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