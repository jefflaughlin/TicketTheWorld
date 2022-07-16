const express = require('express');
const serverless = require('serverless-http');
const redis = require("ioredis");

const app = express();
const router = express.Router();
let client = new redis(process.env.UPSTASH_ENDPOINT);

router.get("/", (req, res) => {
	res.json({
		"message": "Welcome to the API",
		"status": "test"
	});
});

router.get("/jira", async (req, res) => {
	let jiraWebhook = await client.get('trace');

	res.json({
		"jira": jiraWebhook
	});
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/json", (req, res) => {
	const jiraWebhook = req.body;

	client.set('key', jiraWebhook.issue.key);
	client.set('trace', JSON.stringify(jiraWebhook));

	// no real need to send back the data - uncomment to test what was sent
	// res.send({
	// 	"trace": jiraWebhook
	// });
});


app.use("/", router);

module.exports.handler = serverless(app);