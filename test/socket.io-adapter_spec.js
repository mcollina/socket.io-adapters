
var Adapter = require("../socket.io/lib/adapter.js");

describe(Adapter, function() {

  behaveLikeAnAdapter();

  beforeEach(function() {
    this.namespace = {};
    this.instance = new Adapter(this.namespace);
  });
});
