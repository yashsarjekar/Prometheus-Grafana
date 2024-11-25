const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware');
const requestCounter = require('./monitoring/requestCounter');
const client = require('prom-client');
const { Kafka } = require('kafkajs');

app.use(express.json());
app.use(middleware);
app.use(requestCounter);
// Define a route to handle GET requests to the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.get("/user", (req, res) => {
  res.send({
      name: "John Doe",
      age: 25,
  });
});

app.post("/user", (req, res) => {
  const user = req.body;
  res.send({
      ...user,
      id: 1,
  });
});


// Set up Kafka Producer
let messageCount = 0
const kafka = new Kafka({
  clientId: 'async-job-producer',
  brokers: [
    'b-1.cluster01.15375a.c3.kafka.ap-south-1.amazonaws.com:9092',
    'b-2.cluster01.15375a.c3.kafka.ap-south-1.amazonaws.com:9092'
  ],
});
const producer = kafka.producer();


// Kafka Producer Function
async function produceMessage(topic, message) {
  await producer.connect();
  await producer.send({
    topic: topic,
    messages: [{ value: JSON.stringify(message) }]
  });
  await producer.disconnect();
}



// Kafka Consumer Function
async function consumeMessages() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
    }
  });
}


app.post('/produce', async (req, res)=>{
  
  let message = req.body.message;
  
  try {
    await produceMessage('test-topic', message);
    res.status(200).json({ success: true, message: 'Message sent to Kafka' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error sending message', error: err.message });
  }

});


app.get('/consume-messages', (req, res) => {
  res.status(200).json({ success: true, message: 'Consuming messages from Kafka (check logs)' });
});


client.collectDefaultMetrics();
app.get("/metrics", async (req, res)=>{
  const metrics = await client.register.metrics();
  res.set('Content-Type', client.register.contentType);
  res.end(metrics);
});




// Start the server
app.listen(port, () => {
  console.log(`Express app is running at http://localhost:${port}`);
});