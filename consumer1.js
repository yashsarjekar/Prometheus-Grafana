const kafka = require('kafka-node');


const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });


const consumer1 = new kafka.Consumer(
    client,
    [{ topic: 'test-topic', partition: 0 }],
    { autoCommit: true }
);


consumer1.on('message', function (message) {
console.log('Consumer 1 received message from partition 0:', message);
});

consumer1.on('error', function (err) {
    console.error('Error in Consumer 1:', err);
  });