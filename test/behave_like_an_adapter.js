
module.exports = function() {

  var packet = "that is a packet";

  var stubSocket = function(namespace, id, fn) {
    var socket = {
      packet: fn
    }
    namespace.connected = namespace.connected || {};
    namespace.connected[id] = socket;

    return socket;
  };

  it("should forward broadcast", function(done) {
    var that = this;

    stubSocket(that.namespace, "42", function(result) {
      expect(result).to.equal(packet);
      done();
    });

    that.instance.add("42", "room", function() {
      that.instance.broadcast(packet, {});
    });
  });

  it("should send a message to a room", function(done) {
    var that = this;

    stubSocket(that.namespace, "42", function(result) {
      expect(result).to.equal(packet);
      done();
    });

    stubSocket(that.namespace, "24", function(result) {
      done(new Error("this should never happen"));
    });

    async.series([
      function(cb) {
        that.instance.add("42", "room", cb);
      },
      function(cb) {
        that.instance.add("24", "room2", cb);
      },
      function(cb) {
        that.instance.broadcast(packet, { rooms: ["room"] });
        cb();
      }
    ]);
  });

  it("should send a message to a room (bis)", function(done) {
    var that = this;

    stubSocket(that.namespace, "2", function(result) {
      expect(result).to.equal(packet);
      done();
    });

    stubSocket(that.namespace, "1", function(result) {
      done(new Error("this should never happen"));
    });

    async.series([
      function(cb) {
        that.instance.add("1", "123", cb);
      },
      function(cb) {
        that.instance.add("2", "abc", cb);
      },
      function(cb) {
        that.instance.broadcast(packet, { rooms: ["abc"] });
        cb();
      }
    ]);
  });

  it("should send a message to multiple partecipants in the room", function(done) {
    var that = this;

    var count = 0;
    var multiDone = function() {
      if(++count == 2) {
        done();
      }
    };

    stubSocket(that.namespace, "2", function(result) {
      expect(result).to.equal(packet);
      multiDone();
    });

    stubSocket(that.namespace, "1", function(result) {
      expect(result).to.equal(packet);
      multiDone();
    });

    async.series([
      function(cb) {
        that.instance.add("1", "abc", cb);
      },
      function(cb) {
        that.instance.add("2", "abc", cb);
      },
      function(cb) {
        that.instance.broadcast(packet, { rooms: ["abc"] });
        cb();
      }
    ]);
  });

  it("should not send a message to a partecipant that has left the room", function(done) {
    var that = this;

    stubSocket(that.namespace, "1", function(result) {
      done();
    });

    stubSocket(that.namespace, "2", function(result) {
      done(new Error("This should never happen"));
    });

    async.series([
      function(cb) {
        that.instance.add("1", "abc", cb);
      },
      function(cb) {
        that.instance.add("2", "abc", cb);
      },
      function(cb) {
        that.instance.del("2", "abc", cb);
      },
      function(cb) {
        that.instance.broadcast(packet, { rooms: ["abc"] });
        cb();
      }
    ]);
  });

  it("should send a message to a partecipant that has left a room but its still in another", function(done) {
    var that = this;

    stubSocket(that.namespace, "1", function(result) {
      done();
    });

    async.series([
      function(cb) {
        that.instance.add("1", "abc", cb);
      },
      function(cb) {
        that.instance.add("1", "123", cb);
      },
      function(cb) {
        that.instance.del("1", "abc", cb);
      },
      function(cb) {
        that.instance.broadcast(packet, { rooms: ["abc", "123"] });
        cb();
      }
    ]);
  });

  it("should not send a message to a partecipant in the room but who has been excluded", function(done) {
    var that = this;

    stubSocket(that.namespace, "1", function(result) {
      done();
    });

    stubSocket(that.namespace, "2", function(result) {
      done(new Error("This should never happen"));
    });

    async.series([
      function(cb) {
        that.instance.add("1", "abc", cb);
      },
      function(cb) {
        that.instance.add("2", "abc", cb);
      },
      function(cb) {
        that.instance.broadcast(packet, { rooms: ["abc"], except: ["2"] });
        cb();
      }
    ]);
  });

  it("should support excluded sids for broadcasts", function(done) {
    var that = this;

    stubSocket(that.namespace, "1", function(result) {
      done();
    });

    stubSocket(that.namespace, "2", function(result) {
      done(new Error("This should never happen"));
    });

    async.series([
      function(cb) {
        that.instance.add("1", "abc", cb);
      },
      function(cb) {
        that.instance.add("2", "abc", cb);
      },
      function(cb) {
        that.instance.broadcast(packet, { except: ["2"] });
        cb();
      }
    ]);
  });
};
