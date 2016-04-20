/**
  This javascript is loaded by each slack tab, and is responsible for listening
  for messages from the popup, and setting the corresponding classes to activate
  the appropriate styles.
*/

var storage = chrome.storage.local;

console.log('content.js is loaded' + new Date())

// add a listener so that we know when the popup has sent this script a message
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    //console.log('message ' + sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
    console.log('content ' + request.hidingOption);
    setBodyClass(request.hidingOption);
  });

// load the hidingOption from storage and apply that option to the page
storage.get('hidingOption', function (loadedValue) {
  var hidingOption;
  if (loadedValue) {
    hidingOption = loadedValue.hidingOption
    console.log('loaded hidingOption: ' + hidingOption);
  } else {
    console.log('could not load hidingOption');
    hidingOption = 'hide_none'
  }
  setBodyClass(hidingOption)
});

// Given the selected hidingOption, change the class on the <body> element of the
// page to toggle the css rule application
// TODO with jquery this could probbaly be cleaner
function setBodyClass(hidingOption) {
  if (hidingOption == 'hide_parrot') {
    $('body').removeClass('hide_all');
    $('body').addClass('hide_parrot');
  } else if (hidingOption == 'hide_all') {
    $('body').removeClass('hide_parrot');
    $('body').addClass('hide_all');
  } else {
    $('body').removeClass('hide_parrot');
    $('body').removeClass('hide_all');
  }
}
