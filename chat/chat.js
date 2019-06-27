let clients = [];

exports.subscribe = function(req, res) {
  clients.push(res);
  console.log('subscribe', clients.length);

  res.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
}

exports.publish = function(message) {
  console.log(`publishing ${message}`);

  clients.forEach(client => client.end(message));

  clients = [];
}