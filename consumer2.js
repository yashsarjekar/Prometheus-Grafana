const kafka = require('kafka-node');

// Set up Kafka Consumer for partition 1
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer2 = new kafka.Consumer(
  client,
  [{ topic: 'test-topic', partition: 1 }],
  { autoCommit: true }
);

// Process messages from partition 1
consumer2.on('message', function (message) {
  console.log('Consumer 2 received message from partition 1:', message);
});

consumer2.on('error', function (err) {
  console.error('Error in Consumer 2:', err);
});
