// Listen('click', 0);
// Listen('scroll', 1);
// Listen('keydown', 2);
// Listen('mousemove', 3);
GetMessage();

function Listen(action, action_index) {
    console.log('listening...')
    document.addEventListener(action, () => {
        localInteractions[action_index]++;
    });
}

function RetrieveInteractions(callback) {
    console.log('data retrieval...')
    chrome.storage.local.get({ interactions: [0, 0, 0, 0] }, function (data) {
        if (callback) callback(data.interactions);
    });
}

function UpdateInteractions() {
    console.log('data has been updated...')
    setInterval(() => {
        chrome.storage.local.set({ interactions: localInteractions });
    }, 3000);
}

function GetMessage() {
    console.log('clear message gotten...')
    chrome.runtime.onMessage.addListener((message) => {
        if (message.interactions_cleared) {
            console.log('got it');
        }
    });
}