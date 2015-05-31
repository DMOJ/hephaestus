var net = require('net');
var Buffer = require('buffer').Buffer;
var zlib = require('zlib');

function Judge() {
	this.conn = null;
}

require('util').inherits(Judge, require('events').EventEmitter);

Judge.prototype.process = function (packet) {
	console.log(packet.name);
};

Judge.prototype.listen = function (port, host) {
	var judge = this;
	this.socket = net.createServer({}, function (c) {
		console.log('client connected');
		if (judge.conn !== null) c.end();
		judge.conn = c;
		c._size = null;
		c._buf = new Buffer(0);
		c.on('end', function () {
			console.log('client disconnected');
			judge.conn = null;
		}).on('data', function (buf) {
			c._buf = Buffer.concat([c._buf, buf]);
			while (true) {
				if (c._size === null && c._buf.length >= 4) {
					c._size = c._buf.readInt32BE(0);
					c._buf = c._buf.slice(4);
					continue;
				}
				if (c._buf.length >= c._size) {
					zlib.inflate(c._buf.slice(0, c._size), function (err, data) {
						if (err) {
							c.close();
						} else {
							console.log(data.toString());
							judge.process(JSON.parse(data));
						}
					});
					c._buf = c._buf.slice(c._size);
					continue;
				}
				break;
			}
		}).on('error', function (exc) {
			console.log(exc);
			c.destroy();
		});
	});
	this.socket.listen(port, host);
	return this;
};

module.exports = {
	create: function (port, host) {
		return new Judge().listen(port, host);
	}
}
