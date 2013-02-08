
module.exports = function(ascoltatoreBuilder) {

  var ascoltatori = [];
  function builder(namespace) {
    var ascoltatore = ascoltatoreBuilder();
    ascoltatori.push(ascoltatore);
    var adapter = new adapters.AdapterAscoltatore(namespace, ascoltatore);
    return adapter;
  }

  beforeEach(function(done) {
    this.namespace = {};
    this.instance = builder(this.namespace);

    this.namespace2 = {};
    this.instance2 = builder(this.namespace);

    async.parallel(ascoltatori.map(function(a) {
      return a.on.bind(a, "ready");
    }), done);
  });

  afterEach(function(done) {
    async.series(ascoltatori.map(function(a) {
      return a.close.bind(a);
    }), done);
    ascoltatori = [];
  });

  behaveLikeAnAdapter();
};
