const history_container = document.querySelector('.history-container');
const clear_history = document.querySelector('.clear-history');
const clicks = document.querySelector('.clicks');
const movements = document.querySelector('.movements');
const scrolls = document.querySelector('.scrolls');
const keyboard = document.querySelector('.keyboard');
const clear_interactions = document.querySelector('.clear-interactions');

RetrieveHistory();
RetrieveInteractions();
clear_history.onclick = ClearHistory;
clear_interactions.onclick = ClearInteractions;

function RetrieveHistory() {
    history_container.innerHTML = '';
    chrome.storage.local.get({ history: [] }, function(data) {
        const history = data.history;
        
        if (history.length == 0) {
            const empty = document.createElement('span');
            empty.textContent = 'History is clear. Do something! 🙂';
            empty.classList.add('no-events');
            history_container.appendChild(empty);
            return;
        }
        
        history.slice().reverse().forEach((event, index) => {
            CreateHistoryEvent(event, index);
        });
    })
}

function CreateHistoryEvent(event, index) {
    const event_container = document.createElement('div');
    const event_trash_icon = document.createElement('i');
    const event_title = document.createElement('span');
    
    event_container.classList.add('event-container');
    event_trash_icon.classList.add('event-trash-icon', 'fa', 'fa-trash');
    event_title.classList.add('event-title');

    event_trash_icon.setAttribute('event-id', event.id);
    event_trash_icon.onclick = function() {RemoveEvent(event.id)};
    event_title.textContent = (index + 1) + '. ' + event.action;

    event_container.appendChild(event_trash_icon);
    event_container.appendChild(event_title);
    history_container.appendChild(event_container);
}

function RemoveEvent(event_id) {
    const user_answer = confirm("Are you sure? This action can't be undone!");
    if (user_answer) {
        chrome.storage.local.get({ history: [] }, function(data) {
            const history_filtered = data.history.filter(event => event.id !== event_id);
            chrome.storage.local.set({history: history_filtered});
            RetrieveHistory();
        });
    }
}

function ClearHistory() {
    chrome.storage.local.get({ history: [] }, function(data) {
        const history = data.history;
        if (history.length !== 0) {
            const user_answer = confirm("Are you sure? This action can't be undone!");
            if (user_answer) {
                chrome.storage.local.set({ history: []}, function() {
                    RetrieveHistory();
                });
            }
        }
    })
}

function RetrieveInteractions() {
    chrome.storage.local.get({ interactions: [0, 0, 0, 0]}, function(data) {
        const interactions = data.interactions;
        clicks.textContent = interactions[0];
        scrolls.textContent = interactions[1];
        keyboard.textContent = interactions[2];
        movements.textContent = interactions[3];
    });
}

function ClearInteractions() {
    const user_answer = confirm("Are you sure? This action can't be undone!");
    if (user_answer) {
        chrome.storage.local.get({ interactions: [0, 0, 0, 0]}, function(data) {
            const interactions = data.interactions;

            chrome.storage.local.set({ interactions: [0, 0, 0, 0]}, function() {
                RetrieveInteractions();
                chrome.runtime.sendMessage({ interactions_cleared: true });
            });

            const sum_of_interactions = interactions.reduce((a, b) => a + b, 0);
            SaveHistoryEvent(`Removed all the ${sum_of_interactions} interactions.`);
        })
    }
}