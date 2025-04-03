Listen('click', 0);
Listen('scroll', 1);
Listen('keydown', 2);
Listen('mousemove', 3);

let interactions = [0, 0, 0, 0];

RetrieveInteractions(() => {
    setInterval(() => {
        UpdateInteractions(interactions);
    }, 2000);
});

function Listen(action, action_index) {
    document.addEventListener(action, () => {
        interactions[action_index]++;
    });
}

function UpdateInteractions() {
    chrome.storage.local.set({ interactions });
}

function RetrieveInteractions(callback) {
    chrome.storage.local.get({ interactions: [0, 0, 0, 0] }, function (data) {
        interactions = data.interactions;
        callback();
    });
}