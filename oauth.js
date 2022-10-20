window.onload = function() {
    document.querySelector('button').addEventListener('click', function() {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);
        fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
        .then((response)=> response.json())
        .then((response) => {
          chrome.storage.local.set({email: response.email}, function() {
            console.log('Value is set to ' + response.email);
          });
          console.log(response)
        })      
        //chrome.tabs.create({url: 'index1.html'});
        chrome.windows.create(
            {
                focused: true,
                width: 600,
                height: 1100,
                type: "popup",
                url: "index1.html",
                top: 0,
                left: 0,

            })

      });
    });
  };