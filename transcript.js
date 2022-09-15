let speaker;
let mic;
	const errorElem = document.getElementById('error');
  		//Declare the streamConstraints object
    const displayMediaOptions= {
		audio:true,
		//{ mandatory: {
           //  chromeMediaSource: 'system',
                //chromeMediaSourceId:' streamId'
         // }
        //},
        video: false,}
        
		
		
		
	function Startspeaking() {
		navigator.mediaDevices.getUserMedia(displayMediaOptions)
			.then(stream => {
			 console.log("hello there");
			  mic=stream;
			  startTranscript(mic,true);
              
			}).catch(err => {
				// handling the error if any
				errorElem.innerHTML = err;
				errorElem.style.display = "block";
			});
		}
		function startcapture(){
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
                    speaker=sStream;
					startTranscript(speaker);	
				  })
				  .catch(function (err) {
					console.log(err);
				  });
			  }
			}
		  );
		}
		
	  	const startTranscript = async (stream,mic) => {
			// console.log("from startTranscript and mic is ", mic);
			const fetchData = {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
			  },
			  body: JSON.stringify({
				type: "application",
				appId: "744f75664d4f7043374b344c4d71384346304b304f6a4c633042464439497a48",
				appSecret:
				  "475935356c4d587a624943314d5865684c70473567314e6157763153595a457948775331695070485159565f30744d75797774434174414853736879386e4a57",
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
			//const symblEndpoint = `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;
			var conversationId;
			let cacheTable = [];
			//const ws = new WebSocket(symblEndpoint);
			//const ws = new WebSocket(`wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`);
             const symblendpoint=  `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;
            const ws= new WebSocket(symblendpoint);

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
				if(mic)
				{ let txtarea= document.getElementById("my_console")
				let mesg=document.createElement('div')
				mesg.classList.add("blue")
				let name = document.createElement('p')
				let transcript=document.createElement('p')
				name.innerHTML="agent",
				transcript.innerHTML=message.payload.content
				mesg.appendChild(name)
				mesg.appendChild(transcript)
				txtarea.appendChild(mesg)
				}
				else{
					let txtarea= document.getElementById("my_console")
					let mesg=document.createElement('div')
					mesg.classList.add("yellow")
					let name = document.createElement('p')
					let transcript=document.createElement('p')
                    name.innerHTML="prospect",
					transcript.innerHTML=message.payload.content
                    mesg.appendChild(name)
					mesg.appendChild(transcript)
					txtarea.appendChild(mesg)
				}
			
				  /*(()=>{
					const console_log = window.console.log;
					window.console.log = function(...args){
					  console_log(...args);
					  var textarea = document.getElementById('my_console');
					  if(!textarea) return;
					  args.forEach(arg=>textarea.value += `${JSON.stringify(arg)}\n`);
					}
				  })();
				  */
			  console.log( message.payload.content);
			   
			  var button = document.getElementById("btn1");
              btn1.addEventListener('click',handleStop);

			  const API_KEY = 'AIzaSyDbFLJKr8OzNdQOS1ZXvs8VArjfkRloyAM';
              const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
              const SPREADSHEET_ID = '1CFLDIzYGS8_nvSepbJQxV-FN6PONQOzUBXG7B3qcdSI'; 
//const SPREADSHEET_TAB_NAME = 'main';

function onGAPILoad() {
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    // clientId: CLIENT_ID,
    // scope: SCOPES,
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
  }, function(error) {
    console.log('error', error)
  });
}

/*chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  */  // Get token
   function handleStop(){
	    chrome.identity.getAuthToken({interactive: true}, function(token) {
      // Set token in GAPI library
      /*gapi.auth.setToken({
        'access_token': token,
      });*/
	  const token = gapi.client.getToken();
	  if (token !== null) {
		google.accounts.oauth2.revoke(token.access_token);
		gapi.client.setToken('');
		document.getElementById('my_console').innerText = message.payload.content; 

     /* const body = {values: [[
        new Date(), // Timestamp
       
      ]]};*/

      // Append values
      /*gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: SPREADSHEET_TAB_NAME,
        valueInputOption: 'USER_ENTERED',
        resource: body
      }).then((response) => {
        console.log(`${response.result.updates.updatedCells} cells appended.`)
        sendResponse({success: true});
      });
    })

    // Wait for response
   /* return true;
  }*/
				}


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
			ws.onclose = (event) => {
			 console.info("Connection to websocket closed");
			};
		  
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
			  let context = new AudioContext({sampleRate: 44100});
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
	
let button=document.getElementById("btn");
//button.addEventListener('click',Startspeaking);
 button.addEventListener('click',() => {    
	Startspeaking();
    startcapture(); 
   
});

/*var stopElem = document.getElementById('btn2');
if(stopElem){
stopElem.addEventListener('click', stopCapture, false);
}*/




