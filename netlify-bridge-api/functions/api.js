const express = require('express');
const serverless = require('serverless-http');
const redis = require("ioredis");

const app = express();
const router = express.Router();
let client = new redis(process.env.UPSTASH_ENDPOINT);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
	res.json({
		"message": "Welcome to the API",
		"status": "test"
	});
});

router.post("/json", (req, res) => {
	const jiraWebhook = req.body;

	client.set('key', jiraWebhook.issue.key);
	client.set('trace', JSON.stringify(jiraWebhook));

	// no real need to send back the data - uncomment to test what was sent
	res.send({
		"trace": JSON.stringify(jiraWebhook)
	});
});

app.use("/", router);
module.exports.handler = serverless(app);