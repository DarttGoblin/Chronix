Listen('click', 0);
Listen('scroll', 1);
Listen('keydown', 2);
Listen('mousemove', 3);

function Listen(action, action_index) {
    document.addEventListener(action, () => {
        chrome.storage.local.get({ interactions: [0, 0, 0, 0]}, function(data) {
            const interactions = data.interactions;

            interactions[action_index]++;
            chrome.storage.local.set({ interactions: interactions });
        });
    });
}

console.log('hello'); // im still testing this to see if it works!