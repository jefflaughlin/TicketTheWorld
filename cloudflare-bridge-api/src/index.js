
const url = UPSTASH_URL;

async function gatherResponse(response) {
	const { headers } = response;
	const contentType = headers.get('content-type') || '';
	if (contentType.includes('application/json')) {
		return JSON.stringify(await response.json());
	} else if (contentType.includes('application/text')) {
		return response.text();
	} else if (contentType.includes('text/html')) {
		return response.text();
	} else {
		return response.text();
	}
}

async function handleRequest(request) {
	const reqBody = JSON.stringify(await request.json());

	const init = {
		body: reqBody,
		method: 'POST',
		headers: {
			'content-type': 'application/json;charset=UTF-8',
			'Authorization': UPSTASH_TOKEN,
		},
	};

	const response = await fetch(url, init);
	const results = await gatherResponse(response);
	return new Response(results, init);
}

addEventListener('fetch', event => {
	const { request } = event;
	return event.respondWith(handleRequest(request));
});
