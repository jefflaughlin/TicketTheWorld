require('dotenv').config()
const express = require('express')
const Redis = require("ioredis")
const axios = require('axios')
const https = require('https');
const port = 3000

var redis = new Redis(process.env.REDIS_CONNECTION)
const app = express()
var fs = require("fs")
var previousTimeStamp = 0
var currentTimeStamp = 0
var ticketResult = ""

// hue uses a self-signed certificate which needs to be allowed
https.globalAgent.options.rejectUnauthorized = false;

var headers = {
	'hue-application-key': process.env.HUE_APPLICATION_KEY
}

var hue_red = {
	"on": {
		"on": true
	},
	"dimming": {
		"brightness": 75.0
	},
	"color": {
		"xy": {
			"x": 0.4605,
			"y": 0.2255
		}
	}
}

var hue_purple = {
	"on": {
		"on": true
	},
	"dimming": {
		"brightness": 75.0
	},
	"color": {
		"xy": {
			"x": 0.1605,
			"y": 0.2255
		}
	}
}

function updateHue(colour) {
	axios.put(`${process.env.HUE_BRIDGE_ADDRESS}/clip/v2/resource/light/${process.env.HUE_LIGHT_DEVICE}`, colour, {
		headers: headers
	})
}

app.get('/', (req, res) => {
	// pull back the 'trace' value from upstash
	redis.get("trace", (err, result) => {
		if (err) {
			res.send(err)
		} else {
			ticketResult = JSON.parse(result)
			// compare the retrieved 'trace' with the locally stored one
			fs.readFile("current-jira-trace.json", (err, data) => {
				if (err) {
					// couldn't find local 'trace' so save remote value to file
					fs.writeFile("current-jira-trace.json", result, (err) => {
						if (err) {
							res.send(err)
						};
					});
				} else {
					previousTimeStamp = ticketResult.timestamp
				}
			});

			currentTimeStamp = ticketResult.timestamp
			// only need to update hue if the timestamp has changed indicating a new jira update
			if (currentTimeStamp != previousTimeStamp) {
				fs.writeFileSync("current-jira-trace.json", JSON.stringify(ticketResult))

				// update hue based on ticket type
				// only look for a limited set of ticket types - this can be expanded to include more
				switch (ticketResult.webhookEvent.toString()) {
					case "jira:issue_created":
						updateHue(hue_red)
						res.send("complete: jira:issue_created")
						break
					case "comment_created":
						updateHue(hue_purple)
						res.send("complete: comment_created")
						break
					default:
						res.send(currentTimeStamp.toString() + ":" + previousTimeStamp.toString())
						break
				}
			} else {
				res.send(currentTimeStamp.toString() + ": no change")
			}
		}
	});
})

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})
