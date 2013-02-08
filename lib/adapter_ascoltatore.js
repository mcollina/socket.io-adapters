
var EventEmitter = require('events').EventEmitter;
var async = require("async");

module.exports = AdapterAscoltatore;

function AdapterAscoltatore(nsp, ascoltatore){
  EventEmitter.call(this);
  this.nsp = nsp;
  this.ascoltatore = ascoltatore;
  this.funcs = {};
  this.rooms = {};
}

AdapterAscoltatore.prototype = Object.create(EventEmitter.prototype);

AdapterAscoltatore.prototype.add = function(id, room, fn){
  this.rooms[id] = this.rooms[id] || [];
  this.rooms[id].push(room);
  var that = this;
  (function(cb) {
    if(!that.funcs[id]) {
      that.funcs[id] = function(topic, data) {
        if(data.except.indexOf(id) === -1) {
          that.nsp.connected[id].packet(data.packet);
        }
      }
      that.ascoltatore.subscribe("broadcast", that.funcs[id], cb);
    } else {
      cb();
    };
  })(function() {
    that.ascoltatore.subscribe(room, that.funcs[id], fn);
  });
};

AdapterAscoltatore.prototype.del = function(id, room, fn){
  if(!this.funcs[id]) return;

  var that = this;
  async.series([
    that.ascoltatore.unsubscribe.bind(that.ascoltatore, room, this.funcs[id]),
    function(cb) {
      that.rooms[id].forEach(function(value, i) {
        if(value === room) {
          that.rooms[id].splice(i, 1);
        }
      });

      cb(null);
    },
    function(cb) {
      if(that.rooms[id].length === 0) {
        that.ascoltatore.unsubscribe("broadcast", that.funcs[id], cb);
        delete that.rooms[id];
        delete that.funcs[id];
      } else {
        cb(null);
      }
    }
  ], fn);
};

AdapterAscoltatore.prototype.delAll = function(id, fn){
  var that = this;
  var parallel = this.rooms[id].map(function(room) {
    return that.del.bind(that, id, room);
  });
  async.parallel(parallel, fn);
};

AdapterAscoltatore.prototype.broadcast = function(packet, opts){
  var rooms = opts.rooms || [];
  var except = opts.except || [];

  if(rooms.length === 0) {
    rooms.push("broadcast");
  }

  var that = this;
  async.parallel(rooms.map(function(room) {
    return that.ascoltatore.publish.bind(that.ascoltatore, room, { except: except, packet: packet });
  }));
};
