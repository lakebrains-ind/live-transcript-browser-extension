<<<<<<< HEAD
    window.onload = function() {
      document.querySelector('button').addEventListener('click', function() {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
          console.log(token);
      
          chrome.tabs.create({url: 'index1.html'});
  
        });
=======
window.onload = function() {
    document.querySelector('button').addEventListener('click', function() {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);
           
        chrome.tabs.create({url: 'index1.html'});

>>>>>>> 4c5d3ea36149a540bbb49d70efca893531bec4b9
      });
    };