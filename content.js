var storage = chrome.storage.local;

console.log("content.js " + new Date())

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    console.log("content " + request.whattohide);
    setBodyClass(request.whattohide);
  });

  storage.get('whattohide', function(loadedValue) {
    var whattohide;
    if (loadedValue) {
      whattohide = loadedValue.whattohide
      console.log('loaded whattohide: ' + whattohide);
    }
    else {
      console.log('could not load whattohide');
      whattohide = 'hide_none'
    }
    setBodyClass(whattohide)
  });

function setBodyClass(whattohide) {
  if (whattohide == "hide_parrot") {
    $('body').removeClass('hide_all');
    $('body').addClass('hide_parrot');
  }
  else if (whattohide == "hide_all") {
    $('body').removeClass('hide_parrot');
    $('body').addClass('hide_all');
  }
  else {
    $('body').removeClass('hide_parrot');
    $('body').removeClass('hide_all');
  }
}
