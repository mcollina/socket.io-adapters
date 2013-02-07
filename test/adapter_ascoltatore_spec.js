
describe(adapters.AdapterAscoltatore, function() {

  behaveLikeAnAdapter();

  beforeEach(function() {
    this.namespace = {};
    this.instance = new adapters.AdapterAscoltatore(this.namespace, new ascoltatori.MemoryAscoltatore());
  });
});
