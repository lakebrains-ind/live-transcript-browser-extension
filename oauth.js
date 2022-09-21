    window.onload = function() {
      document.querySelector('button').addEventListener('click', function() {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
          console.log(token);
      
          chrome.tabs.create({url: 'index1.html'});
  
        });
      });
    };