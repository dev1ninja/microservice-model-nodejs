const springCloudConfigClient = require("cloud-config-client");
const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());

const port = 3000;
let microserviceName = "microservice-model"
let ambiente = process.env.AMBIENTE || "local"

springCloudConfigClient.load({
    endpoint: 'https://scc-dev.dataseed.de:443',
    name: microserviceName,
    auth: { user: "root", pass: "s3cr3t"},
    profiles: [ambiente] })
  .then(config => {
    require("./routes")(app, config);
    const consume = require("./config/kafka-consumer")(config, require("./listener/listener-model"));
    consume().catch((err) => {
        console.error("error in consumer: ", err)
    })
    app.listen(port, () =>
        console.log(`App working at http://localhost:${port}`)
    );

  }).catch(console.error)