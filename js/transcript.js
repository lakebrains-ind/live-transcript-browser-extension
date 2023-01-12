let speaker;
let mic;
let transObj = [];
let transcriptToShow = [];
var today = new Date();
var h = today.getHours();
var mi = today.getMinutes();
var s = today.getSeconds();
const API_KEY = "fs";
const errorElem = document.getElementById("error");
//Declare the streamConstraints object
const displayMediaOptions = {
  audio: true,
  //{ mandatory: {
  // chromeMediaSource: 'system',
  // chromeMediaSourceId:' streamId'
  // }
  //},
  video: false,
};

function Startspeaking() {
  navigator.mediaDevices
    .getUserMedia(displayMediaOptions)
    .then((stream) => {
      console.log("hello there");
      mic = stream;
      startTranscript(mic, true);
    })
    .catch((err) => {
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

//  const getapidata=async()=>{ 
//   await fetch("http://localhost:5000/api/getapi")
// .then((response) => {
//   console.log(response.json());
// });
//  }
// getapidata()



const startTranscript = async (stream, mic) => {
  console.log("from startTranscript and mic is ", mic);
  let apiCredentials;
  
  let myPromise = new Promise(function (myResolve, myReject) {
    fetch("http://localhost:7070/api/getapi")
      .then((response) => {
        return response.json();
      })
      .then(async(data) => {
        console.log(data);
        apiCredentials =await data;
         myResolve(apiCredentials); 
      })
      .catch((error) => {
        console.log(error);
        myReject(error); 
      });
      // console.log(apiCredentials);
   // when successful
    // when error
  });

  // "Consuming Code" (Must wait for a fulfilled Promise)
  var FinalApiData
 await myPromise.then(
   async function (value) {
       FinalApiData= await value
      // console.log("apid fetched",value);
      console.log(FinalApiData);
      /* code if successful */
    },
    function (error) {
      console.log("error while calling api",error);
      /* code if some error */
    }
    );
    console.log(FinalApiData);

const fetchData = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: "application",
    appId: FinalApiData.appId,
    // appId: "6e4b756a72386939394a4771777447505849696275786a736f75533467546852",
    appSecret: FinalApiData.appSecret,
    // appSecret:
    //   "7a46586f4a5a7757636258324d68444a5a5a6a692d634532656456434179384870485570425a6e57453831614b4b64633154306d3935483534634b737a37596b",
  }),
};

const res = await fetch(
  "https://api.symbl.ai/oauth2/token:generate",
  fetchData
)
// console.log(res.status)
console.log(FinalApiData.appId, FinalApiData.appSecret);




const apiexpire = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    type: "application",
    expire:true,
    appId:FinalApiData.appId,
    appSecret:FinalApiData.appSecret
  }),
};
if(res.status===401){
  fetch("http://localhost:7070/api/apiexpire", apiexpire);
}
console.log(FinalApiData);
const json = await res.json();
/**
   * The JWT token you get after authenticating with our API.
   * Check the Authentication section of the documentation for more detail
   *  */

  // calling
  // fetch("http://localhost:7070/api/login", {
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   method: "POST",
  //   body: JSON.stringify({
  //     appId:appId,
  //     appSecret:appSecret
  //   }),
  // });

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
          let txtarea = document.getElementById("my_console");
          let mesg = document.createElement("div");
          mesg.classList.add("blue");
          let name = document.createElement("p");
          let transcript = document.createElement("p");
          (name.innerHTML = "agent"),
            (transcript.innerHTML = message.payload.content);
          mesg.appendChild(name);
          mesg.appendChild(transcript);
          txtarea.appendChild(mesg);
          transObj = ["Mic", message.payload.content];
          transcriptToShow.push(transObj);
        } else {
          let txtarea = document.getElementById("my_console");
          let mesg = document.createElement("div");
          mesg.classList.add("yellow");
          let name = document.createElement("p");
          let transcript = document.createElement("p");
          (name.innerHTML = "prospect"),
            (transcript.innerHTML = message.payload.content);
          mesg.appendChild(name);
          mesg.appendChild(transcript);
          txtarea.appendChild(mesg);
          transObj = ["Speaker", message.payload.content];
          transcriptToShow.push(transObj);
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
    console.log("error from 292")
    const apiexpire = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "application",
        expire: true,
        appId: FinalApiData.appId,
        appSecret: FinalApiData.appSecret,
      }),
    };
      fetch("http://localhost:7070/api/apiexpire", apiexpire);
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
  let csvContent =
    "data:text/csv;charset=utf-8," +
    transcriptToShow.map((e) => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);
  console.log(encodedUri);
  window.open(encodedUri);
}

async function sendMail() {
  // createFolder();
  await checkFolder();
  var text = transcriptToShow.map((e) => e.join(",")).join("\n");
  // console.log("text..", text);
  if (text) {
    chrome.storage.local.get(["token", "folder_id"], function (resp) {
      console.log(resp.token);
      const blob = new Blob([text], { type: "text/csv;charset=utf-8" });

      //const parent_folder = localStorage.getItem('parent_folder');

      var metadata = {
        name: "Live-Transcript " + h + "-" + mi + "-" + s + ".csv",
        mimeType: "text/csv;charset=utf-8",
        parents: [resp.folder_id],
      };
      var formData = new FormData();
      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      formData.append("file", blob);

      fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({ Authorization: "Bearer " + resp.token }),
          body: formData,
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then(function () {
          let button3 = document.getElementById("btn3");
          button3.addEventListener("click", () => {
            let links =
              "https://drive.google.com/drive/u/1/folders/" + resp.folder_id;
            console.log("link", links);
            parent.open(links);
          });
        });
    });
  }
}

function checkFolder() {
  return new Promise((resolve, reject) => {
    let folders = [];
    chrome.storage.local.get(["token"], function (resp) {
      const phrase = "Live-Transcript";
      fetch(
        "https://www.googleapis.com/drive/v2/files?orderBy=folder&q=" +
          encodeURIComponent(`mimeType = 'application/vnd.google-apps.folder'`),

        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${resp.token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then(async function (response) {
          var data = await response.json();
          // console.log(data);
          let dataArr = data.items;
          dataArr.forEach((el) => {
            if (!el.explicitlyTrashed) {
              let obj = {
                title: el.title,
                id: el.id,
              };
              folders.push(obj);
            }
          });
          let flag = 0;
          for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            if (folder.title.includes(phrase)) {
              chrome.storage.local.set(
                { folder_id: folder.id },
                function (resp) {
                  // console.log(resp);
                  resolve();
                }
              );
              flag = 1;
              break;
            }
          }
          if (flag == 0) {
            await createFolder();
            resolve();
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  });
}
function createFolder() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["token"], function (resp) {
      fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resp.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mimeType: "application/vnd.google-apps.folder",
          name: "Live-Transcript",
        }),
      }).then(async function (response) {
        let data = await response.json();
        console.log(data);
        chrome.storage.local.set({ folder_id: data.id }, function (resp) {
          resolve();
        });
      });
    });
  });
}
// let createFolderOptions = {

// 	method: "POST",
// 	headers: {
// 	  Authorization: `Bearer ${token}`,
// 	  "Content-Type": "application/json",
// 	},
// 	body: JSON.stringify({
// 	  mimeType: "application/vnd.google-apps.folder",
// 	  name: "My new google drive folder!",
// 	}),
//   };

//   const response = await fetch("https://www.googleapis.com/drive/v3/files", createFolderOptions);
//   const json = await response.json();
let button = document.getElementById("btn");
button.addEventListener("click", () => {
  Startspeaking();
  startcapture();
});
let button1 = document.getElementById("btn1");
button1.addEventListener("click", () => {
  stopTranscript();
});
let button2 = document.getElementById("btn2");
button2.addEventListener("click", () => {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    // console.log(token);
    fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        chrome.storage.local.set(
          { email: response.email, token: token },
          function () {
            console.log("Value is set to " + response.full_name);
          }
        );
        chrome.storage.local.get(function (result) {
          console.log(result.email);
        });

        var UserEmail;
        chrome.storage.local.get(["email"], function (result) {
          UserEmail = result.email;

          fetch("http://localhost:7070/getuserinfo", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              email: UserEmail,
            }),
          })
            .then(function (res) {
              res.json({ msg: "user data saved to backend" });
            })
            .catch(function (error) {
              res.json({
                message: "Error while save user data in backend",
                error: error,
              });
            });
          sendMail();
        });
      });
  });

  $(".overlay").fadeIn("fast");
  $("#popup").show("fast");
  $(".lightbox-close").on("click", function () {
    $(this).closest(".lightbox").hide("fast");
    $(".overlay").fadeOut("fast");
  });
});
let buttonLogin = document.getElementById("btnLogin");

buttonLogin.addEventListener("click", () => {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    fetch(`http://localhost:8000/auth/google`).then((response) =>
      console.log(response.json())
    );
    //   .then((response) => {
    //     chrome.storage.local.set(
    //       { email: response.email, token: token },
    //       function () {
    //         console.log("Value is set to " + response.email);
    //       }
    //     );
    //     console.log(response);
    //     sendMail();
    //   });
  });

  $(".overlay").fadeIn("fast");
  $("#popup").show("fast");
  $(".lightbox-close").on("click", function () {
    $(this).closest(".lightbox").hide("fast");
    $(".overlay").fadeOut("fast");
  });
});
// function sendMail(){
// 	chrome.storage.local.get(['email'], function(result) {
// 		var mail= result.email;
// 		console.log('Value currently is ' + mail);
// 		let csvContnt = "data:text/csv;charset=utf-8," +transcriptToShow.map(e => e.join(",")).join("\n");
// 		let csvData=transcriptToShow.map(e => e.join(",")).join("\n");
// 		console.log(csvData);
// 	// var encodedUri = encodeURI(csvContnt);
// 	// window.open(encodedUri);
// 		fetch('https://transcript.lakebrains.com/',{
// 			method:'POST',
// 			mode: 'no-cors',
// 			headers:{
// 			  'Accept': 'application/json',
// 			  'Content-Type':'application/json',
// 			  "Access-Control-Allow-Origin": "*",
// 			},

// 		   body: JSON.stringify({
// 			  email:mail,
// 			  filename:csvContnt
// 			})
// 		}).then(res=>{

// 			return res.json()
// 				})
// 		 .then(res=>{ console.log(res)
// 		})
// 		 .catch(error=>console.log('ERROR'))

// 		//console.log('Value currently is ' + result.email);
// 	  });

// }
