TimesUp();

function TimesUp() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'times-up') {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'Chronix.Media/Chronix.png',
                title: request.title,
                message: request.message,
                requireInteraction: true
            });
        }
    });
}