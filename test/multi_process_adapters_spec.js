
describe("Multi process adapter", function() {

  describe("Redis", function() {
    behaveLikeAMultiProcessAdapter(function() {
      return new ascoltatori.RedisAscoltatore(redisSettings());
    });
  });

  describe("AMQP", function() {
    behaveLikeAMultiProcessAdapter(function() {
      return new ascoltatori.AMQPAscoltatore(rabbitSettings());
    });
  });

  describe("MQTT", function() {
    behaveLikeAMultiProcessAdapter(function() {
      return new ascoltatori.MQTTAscoltatore(mqttSettings());
    });
  });

  describe("ZMQ", function() {
    behaveLikeAMultiProcessAdapter(function() {
      return new ascoltatori.ZeromqAscoltatore(zeromqSettings());
    });
  });
});
