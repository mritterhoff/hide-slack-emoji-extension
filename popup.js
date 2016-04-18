// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Store CSS data in the "local" storage area.
//
// See note in options.js for rationale on why not to use "sync".
var storage = chrome.storage.local;

console.log("popup.js " + new Date())


// get the radio buttons and attach change-event callbacks
var radios = document.querySelectorAll('input[type=radio][name="options"]');

Array.prototype.forEach.call(radios, function(radio) {
   radio.addEventListener('change', changeHandler);
});

// Load any CSS that may have previously been saved.
loadChanges();



function changeHandler(event) {
  saveChanges(this.value);
}

function saveChanges(whattohide) {
  console.log('attempting to save ' + whattohide);
  // Save it using the Chrome extension storage API.
  storage.set({'whattohide': whattohide}, function() {
    // Notify that we saved.
    console.log('Settings saved ' + whattohide);
    //send message to content script to have it change the class on body
    sendMessage(whattohide);
  });
}

function loadChanges() {
  storage.get('whattohide', function(loadedValue) {
    var whattohide;
    if (loadedValue) {
      whattohide = loadedValue.whattohide
      console.log('loaded whattohide: ' + whattohide);
    }
    else {
      console.log('could not load whattohide');
      whattohide = 'hide_none'
      //sendMessage(whattohide);
      // set default checked box
    }
    setCheckRadioElement(whattohide);
    sendMessage(whattohide);
  });
}

function setCheckRadioElement(radio_id) {
  document.querySelector('input[type=radio]#' + radio_id).setAttribute("checked", "checked");
}

function sendMessage(whattohide) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {whattohide: whattohide}, function(response) {
      //console.log("sent " + whattohide);
    });
  });
}
