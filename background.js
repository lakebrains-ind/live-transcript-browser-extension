// // chrome.action.onClicked.addListener(function() {
// //     chrome.tabs.create({url: 'index.html'});
// //   });
// console.log("hello");
// let windowId;
// chrome.action.onClicked.addListener(() => {
//     chrome.windows.create(
//       {
//         focused: true,
//         width: 600,
//         height: 1100,
//         type: "popup",
//         url: "index.html",
//         top: 0,
//         left: 0,
        
//       },
//       (window) => {
//         //   console.log(window.tabs[0].windowId);
//         windowId = window.tabs[0].windowId;
//         chrome.storage.local.set({ windowId }, function (response) {
//           if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
//           console.log(response);
//         });
//         console.log("windowId", windowId);
//       }
//     );
// });
chrome.action.onClicked.addListener(function() {
  chrome.windows.create(
    {
        focused: true,
        width: 600,
        height: 1100,
        type: "popup",
        url: "index.html",
        top: 0,
        left: 0,

    })
  //chrome.tabs.create({url: 'index.html'});
});
