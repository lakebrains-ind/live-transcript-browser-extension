window.onload = function() {
    document.querySelector('button').addEventListener('click', function() {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);
        fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
        .then((response)=> response.json())
        .then((response) => {
          chrome.storage.local.set({email: response.email , Username: response.name}, function() {
            console.log('User E-mail ' + response.email);
            console.log('Username ' + response.name);

          });
          console.log(response)
        })      
        button.style.display="block";
        //chrome.tabs.create({url: 'index1.html'});
        // chrome.windows.create(
        //     {
        //         focused: true,
        //         width: 600,
        //         height: 1100,
        //         type: "popup",
        //         url: "index1.html",
        //         top: 0,
        //         left: 0,

        //     })
      });
    });
  };