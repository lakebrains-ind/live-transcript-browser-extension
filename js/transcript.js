let speaker;
let mic;
let transObj = [];
let transcriptToShow = [];
const API_KEY = 'AIzaSyBGKI0IL79IXPru-EqDZzhl2DfNR78LI-s'
const errorElem = document.getElementById('error');
//Declare the streamConstraints object
const displayMediaOptions = {
	audio: true,
	//{ mandatory: {
	// chromeMediaSource: 'system',
	// chromeMediaSourceId:' streamId'
	// }
	//},
	video: false,
}

function Startspeaking() {
	navigator.mediaDevices.getUserMedia(displayMediaOptions)
		.then(stream => {
			console.log("hello there");
			mic = stream;
			startTranscript(mic, true);
		}).catch(err => {
			// handling the error if any
			errorElem.innerHTML = err;
			errorElem.style.display = "block";
		});
}
function startcapture() {
	chrome.desktopCapture.chooseDesktopMedia(
		["tab", "window", "audio"],
		function (streamId) {
			console.log(streamId);
			if (streamId) {
				var obj = {
					audio: {
						mandatory: {
							chromeMediaSource: "desktop",
							chromeMediaSourceId: streamId,
						},
					},
					video: {
						optional: [],
						mandatory: {
							chromeMediaSource: "desktop",
							chromeMediaSourceId: streamId,
							maxWidth: 2560,
							maxHeight: 1440,
							maxFrameRate: 30,
						},
					},
				};
				navigator.mediaDevices
					.getUserMedia(obj)
					.then(function (sStream) {
						console.log(sStream);
						speaker = sStream;
						startTranscript(speaker);
					})
					.catch(function (err) {
						console.log(err);
					});
			}
		}
	);
}

const startTranscript = async (stream, mic) => {
	// console.log("from startTranscript and mic is ", mic);
	const fetchData = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			type: "application",
			appId: "4e703070536e6e58356e4b77306d56374d413730484e644d42723579357a7966",
			appSecret:
				"3136653373426c2d375a6a524763374c524f414f64576435595954626d6b6e59306e4e654467596a3173314453447167674532367957736e714131494632595f",
		}),
	};
	const res = await fetch(
		"https://api.symbl.ai/oauth2/token:generate",
		fetchData
	);
	const json = await res.json();
	/**
	 * The JWT token you get after authenticating with our API.
	 * Check the Authentication section of the documentation for more details.
	 */
	const accessToken = json.accessToken;
	let uniqueMeetingId;
	if (mic) {
		uniqueMeetingId = btoa("agent@interactpro.ai");
	} else {
		uniqueMeetingId = btoa("prospect@interactpro.ai");
	}
	const symblEndpoint = `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;
	var conversationId;
	let cacheTable = [];
	const ws = new WebSocket(symblEndpoint);
	//const ws = new WebSocket(`wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`);
	//const symble=  `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;
	// const ws= new WebSocket(symble);

	// Fired when a message is received from the WebSocket server
	ws.onmessage = async (event) => {
		// You can find the conversationId in event.message.data.conversationId;
		const data = JSON.parse(event.data);
		if (data.type === "message" && data.message.hasOwnProperty("data")) {
			console.log("conversationId", data.message.data.conversationId);
			conversationId = data.message.data.conversationId;
		}
		if (data.type === "message_response") {
			for (let message of data.messages) {
					console.log(mic);
				    if (mic) {
					let txtarea = document.getElementById("my_console")
					let mesg = document.createElement('div')
					mesg.classList.add("blue")
					let name = document.createElement('p')
					let transcript = document.createElement('p')
					name.innerHTML = "agent",
						transcript.innerHTML = message.payload.content
					mesg.appendChild(name)
					mesg.appendChild(transcript)
					txtarea.appendChild(mesg)
					transObj = ["Mic", message.payload.content];
					transcriptToShow.push(transObj)
				}
				else {
					let txtarea = document.getElementById("my_console")
					let mesg = document.createElement('div')
					mesg.classList.add("yellow")
					let name = document.createElement('p')
					let transcript = document.createElement('p')
					name.innerHTML = "prospect",
						transcript.innerHTML = message.payload.content
					mesg.appendChild(name)
					mesg.appendChild(transcript)
					txtarea.appendChild(mesg)
					transObj = ["Speaker", message.payload.content];
					transcriptToShow.push(transObj)
				}
				console.log(transcriptToShow);

			}

			if (conversationId) {
				// You can log sentiments on messages from data.message.data.conversationId
				// const sentimentEndpoint = `https://api.symbl.ai/v1/conversations/${conversationId}/messages?sentiment=true`;
				// const response = await fetch(sentimentEndpoint, {
				//   method: "GET",
				//   mode: "cors",
				//   cache: "no-cache",
				//   headers: {
				//     "Content-Type": "application/json",
				//     Authorization: `Bearer ${accessToken}`,
				//   },
				// });
				// const resp = await response.json();
				// if (response.ok) {
				//   let rows = "";

				//   for (let message of resp.messages) {
				//     if (cacheTable.indexOf(message.id) === -1) {
				//       console.log("Polarity: ", message.sentiment.polarity.score);
				//       console.log(message.sentiment.suggested);
				//     }
				//     cacheTable.push(message.id);
				//   }
				// }

			}
		}
		if (data.type === "topic_response") {
			for (let topic of data.topics) {
				console.log("Topic detected: ", topic.phrases);
			}
		}
		if (data.type === "insight_response") {
			for (let insight of data.insights) {
				console.log("Insight detected: ", insight.payload.content);
			}
		}
		if (data.type === "message" && data.message.hasOwnProperty("punctuated")) {
			// if (mic) {
			//   console.log(
			//     "Live transcript (less accurate) of Mic: ",
			//     data.message.punctuated.transcript
			//   );
			// } else {
			//   console.log(
			//     "Live transcript (less accurate): ",
			//     data.message.punctuated.transcript
			//   );
			// }
		}
	};

	// Fired when the WebSocket closes unexpectedly due to an error or lost connetion
	ws.onerror = (err) => {
		console.error(err);
	};

	// Fired when the WebSocket connection has been closed
	//ws.onclose = (event) => {
	//console.info("Connection to websocket closed");
	//};

	// Fired when the connection succeeds.
	ws.onopen = (event) => {
		ws.send(
			JSON.stringify({
				type: "start_request",
				meetingTitle: "Test", // Conversation name
				insightTypes: ["question", "action_item"], // Will enable insight generation
				config: {
					confidenceThreshold: 0.5,
					languageCode: "en-US",
					speechRecognition: {
						encoding: "LINEAR16",
						sampleRateHertz: 44100,
					},
				},
				speaker: {
					userId: "ayushi@symbl.ai",
					name: "Sample",
				},
			})
		);
	};

	/**
	 * The callback function which fires after a user gives the browser permission to use
	 * the computer's microphone. Starts a recording session which sends the audio stream to
	 * the WebSocket endpoint for processing.
	 */
	const handleSuccess = (stream) => {
		const AudioContext = window.AudioContext;
		let context = new AudioContext({ sampleRate: 44100 });
		const source = context.createMediaStreamSource(stream);
		const processor = context.createScriptProcessor(1024, 1, 1);
		const gainNode = context.createGain();
		source.connect(gainNode);
		gainNode.connect(processor);
		processor.connect(context.destination);
		processor.onaudioprocess = (e) => {
			// convert to 16-bit payload
			const inputData =
				e.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
			const targetBuffer = new Int16Array(inputData.length);
			for (let index = inputData.length; index > 0; index--) {
				targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
			}
			// console.log(targetBuffer.buffer);
			// Send audio stream to websocket.
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(targetBuffer.buffer);
			}
		};
	};

	handleSuccess(stream);
};

//Function to download the transcripted data in a csv file format
function stopTranscript() {
	console.log(transcriptToShow);
	let csvContent = "data:text/csv;charset=utf-8," + transcriptToShow.map(e => e.join(",")).join("\n");
	var encodedUri = encodeURI(csvContent);
	window.open(encodedUri);
}
function sendMail(){
	chrome.storage.local.get(['email'], function(result) {
		var mail= result.email;
		console.log('Value currently is ' + mail);
		let csvContnt = "data:text/csv;charset=utf-8," +transcriptToShow.map(e => e.join(",")).join("\n");
		let csvData=transcriptToShow.map(e => e.join(",")).join("\n");
		console.log(csvData);
	var encodedUri = encodeURI(csvContnt);
		fetch('https://transcript.lakebrains.com/',{
			method:'POST',
			mode: 'no-cors',
			headers:{
			  'Accept': 'application/json',
			  'Content-Type':'application/json',
			  "Access-Control-Allow-Origin": "*",
			},
			
		   body: JSON.stringify({
			  email:mail,
			  filename:csvContnt
			})
		}).then(res=>{
		  
			return res.json()
				})
		 .then(res=>{ console.log(res)
		})
		 .catch(error=>console.log('ERROR'))
	  
	 	
		//console.log('Value currently is ' + result.email);
	  });

}
let button = document.getElementById("btn");
button.addEventListener('click', () => {
	Startspeaking();
	startcapture();
});
let button1 = document.getElementById("btn1");
button1.addEventListener('click', () => {
	stopTranscript();
});
let button2 = document.getElementById("btn2");
button2.addEventListener('click',()=>{
	sendMail();
})