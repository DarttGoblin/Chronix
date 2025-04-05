let updating;

RetrieveInteractions();
GetMessage();

function RetrieveInteractions() {
    console.log('data retrieval...');
    chrome.storage.local.get({ interactions: [0, 0, 0, 0] }, function (data) {
        let interactions = data.interactions;
        console.log('listening...');
        Listen(interactions, 'click', 0);
        Listen(interactions, 'scroll', 1);
        Listen(interactions, 'keydown', 2);
        Listen(interactions, 'mousemove', 3);
        updating = UpdateInteractions(interactions);
    });
}

function Listen(interactions, action, action_index) {
    document.addEventListener(action, () => {
        interactions[action_index]++;
    });
}

function UpdateInteractions(interactions) {
    return setInterval(() => {
        chrome.storage.local.set({ interactions });
        console.log('data has been updated...');
    }, 5000);
}

function GetMessage() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.interactions_cleared) {
            clearInterval(updating);
            RetrieveInteractions();
        }
    });
}