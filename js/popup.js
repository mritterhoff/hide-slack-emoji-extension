/**
  This javascript is loaded by the popup view, which is shown when the user
  clicks the page action (extension icon).
*/

// We'll be storing the hiding_option locally. Might use sync in the future.
var storage = chrome.storage.local;

// Load any CSS that may have previously been saved.
loadChanges();

// When a radio button is clicked, save the corresponding option
function radioButtonListener(event) {
  saveChanges(this.value);
}

// save the indicated option by storing very simple JSON in storage
function saveChanges(hidingOption) {
  console.log('attempting to save ' + hidingOption);
  // Save it using the Chrome extension storage API.
  storage.set(createOptionJSON(hidingOption), function () {
    //send message to content script to have it change the class on body
    sendMessage(hidingOption);

    // the changes have been saved, close the popup window, after a brief delay,
    // so the user can see the radio button change state
    window.setTimeout(window.close, 180);
  });
}

// Load the option from storage so the user sees that the correct radio button is 'checked'
function loadChanges() {
  storage.get('hidingOption', function (loadedValue) {
    var hidingOption;
    if ($.isEmptyObject(loadedValue)) {
      console.log('could not load hidingOption');
      hidingOption = 'hide_none'
    } else {
      hidingOption = loadedValue.hidingOption
      console.log('loaded hidingOption: ' + hidingOption);
    }
    setCheckRadioElement(hidingOption);
    //sendMessage(hidingOption);

    // now that we've set the radio element to be checked, we can add the listeners
    addListeners()
  });
}

// Set the radio button that corresponds the given id as 'checked'
// TODO use jquery here possibly
function setCheckRadioElement(radio_id) {
  document.querySelector('input[type=radio]#' + radio_id).setAttribute("checked", "checked");
}

// Send a message to the content script to indicate that a different option has been selected
function sendMessage(hidingOption) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, createOptionJSON(hidingOption), function (response) {
      console.log('message sent successfully');
    });
  });
}

// Return JSON for the given option. Just a layer of indirection in case I want
// to get fancier later
function createOptionJSON(hidingOption) {
  return {
    'hidingOption': hidingOption
  };
}

/** Add listeners to the radio buttons. */
function addListeners() {
  // get the radio buttons and attach change-event callbacks
  var radios = document.querySelectorAll('input[type=radio][name="options"]');

  // add a listener to all of the radio buttons
  // TODO now that we're using jquerey (reluctantly), this could be simpler
  Array.prototype.forEach.call(radios, function (radio) {
    radio.addEventListener('change', radioButtonListener);
  });
}
