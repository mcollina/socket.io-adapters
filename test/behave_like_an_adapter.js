
module.exports = function() {

  var stubSocket = function(namespace, id, fn) {
    var socket = {
      packet: fn
    }
    namespace.connected = namespace.connected || {};
    namespace.connected[id] = socket;

    return socket;
  };

  it("should forward broadcast", function(done) {
    var packet = "this is a packet";

    stubSocket(this.namespace, 42, function(result) {
      expect(result).to.equal(packet);
      done();
    });

    this.instance.add(42, "room");

    this.instance.broadcast(packet, {});
  });
};
