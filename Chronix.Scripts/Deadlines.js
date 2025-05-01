const deadlines_section = document.querySelector('deadlines-section');
const deadlines_container = document.querySelector('.deadlines-container');
const add_deadline = document.querySelector('.add-deadline');
const remove_all_deadlines = document.querySelector('.remove-all-deadlines');
const conversionStates = new Map();

RetrieveDeadlines();
add_deadline.onclick = RequestUserInput;
remove_all_deadlines.onclick = RemoveAllDeadlines;

function RetrieveDeadlines() {
    deadlines_container.innerHTML = '';
    chrome.storage.local.get({ deadlines: [] }, function(data) {
        const deadlines = data.deadlines;

        if (deadlines.length == 0) {
            const no_deadlines = document.createElement('span');
            no_deadlines.textContent = 'No Deadlines Are At The Moment, Booyah! 😊';
            no_deadlines.classList.add('no-deadlines');
            deadlines_container.appendChild(no_deadlines);
            return;
        }

        deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));
        deadlines.forEach((deadline, index) => {
            CreateDeadline(deadline, index);
        });
    })
}

function RequestUserInput() {
    const deadline_user_info = document.createElement('div');
    const deadline_user_title = document.createElement('input');
    const deadline_user_date = document.createElement('input');
    const deadline_user_button = document.createElement('button');
    
    deadline_user_title.placeholder = 'Enter Deadline Title';
    deadline_user_title.type = 'text';
    deadline_user_date.type = 'datetime-local';
    deadline_user_button.innerHTML = 'Confirm';

    const now = new Date();
    now.setHours(24, 59, 0, 0);
    const formattedDate = now.toISOString().slice(0, 16);
    deadline_user_date.value = formattedDate;

    deadline_user_info.classList.add('deadline-user-info');
    deadline_user_title.classList.add('deadline-user-title');
    deadline_user_date.classList.add('deadline-user-date');
    deadline_user_button.classList.add('deadline-user-button');

    deadline_user_info.appendChild(deadline_user_title);
    deadline_user_info.appendChild(deadline_user_date);
    deadline_user_info.appendChild(deadline_user_button);
    deadlines_container.appendChild(deadline_user_info);
    
    deadline_user_button.onclick = function() {
        const title = deadline_user_title.value.trim(); 
        const date = deadline_user_date.value;
        const duration = CalculateDeadlineTime(date);
    
        if (!title || !date) {
            alert("Some information seems to be missing!");
            return;
        } else if (duration.weeks > 52) {
            alert('Deadline must not exceed 1 year!');
            return;
        }

        const deadline = {id: GenerateId(), title, date};
        deadlines_container.removeChild(deadline_user_info);
        chrome.storage.local.get({ deadlines: [] }, function(data) {
            const deadlines = data.deadlines;
            deadlines.push(deadline);
    
            chrome.storage.local.set({ deadlines: deadlines }, function() {
                CreateDeadline(deadline, deadlines.length + 1);
                RetrieveDeadlines();
            });
        });

        SaveHistoryEvent(`Added "${deadline.title}" deadline with the id: ${deadline.id} and the date: ${deadline.date}`);
    }
}

function CreateDeadline(deadline, index) {
    const deadline_container = document.createElement('div');
    const deadline_title = document.createElement('span');
    const deadline_timer_and_icons_container = document.createElement('div');
    const deadline_timer = document.createElement('span');
    const deadline_trash_icon = document.createElement('i');
    const date = CalculateDeadlineTime(deadline.date);
    let is_converted = conversionStates.get(deadline.id) || false;

    if (date == 'Expired') {deadline_timer.textContent = 'Expired';}
    else if (date.weeks > 0) {deadline_timer.textContent = `${date.weeks}w ${date.days}d ${date.hours}h ${date.minutes}m`;}
    else {deadline_timer.textContent = `${date.days}d ${date.hours}h ${date.minutes}m`;}

    deadline_title.innerHTML = (index + 1) + '. ' + deadline.title;
    deadline_trash_icon.setAttribute('deadline-id', deadline.id);
    deadline_trash_icon.onclick = function() {RemoveDeadline(deadline.id)};
    deadline_timer.onclick = function() {
        is_converted = ConvertDate(this, deadline.id, is_converted);
        conversionStates.set(deadline.id, is_converted);
    };

    deadline_container.classList.add('deadline-container');
    deadline_title.classList.add('deadline-title');
    deadline_timer_and_icons_container.classList.add('deadline-timer-and-icons-container');
    deadline_timer.classList.add('deadline-timer');
    deadline_trash_icon.classList.add('deadline-trash-icon', 'fa', 'fa-trash');

    deadline_timer_and_icons_container.appendChild(deadline_timer);
    deadline_timer_and_icons_container.appendChild(deadline_trash_icon);
    deadline_container.appendChild(deadline_title);
    deadline_container.appendChild(deadline_timer_and_icons_container);
    deadlines_container.appendChild(deadline_container);

    if (date == 'Expired' || (date.days < 1 && date.weeks < 1)) {
        deadline_timer.style.color = 'red';
    }
}

function RemoveDeadline(deadline_id) {
    const user_answer = confirm("Are you sure? This action can't be undone!");
    if (user_answer) {
        chrome.storage.local.get({ deadlines: [] }, function(data) {
            const deadlines_filtered = data.deadlines.filter(deadline => deadline.id !== deadline_id);
            chrome.storage.local.set({deadlines: deadlines_filtered});
            RetrieveDeadlines();
            AdjustHeight();
        });

        SaveHistoryEvent(`Removed "${deadline.title}" deadline with the id: ${deadline.id} and the date: ${deadline.date}`);
    }
}

function RemoveAllDeadlines() {
    chrome.storage.local.get({ deadlines: [] }, function(data) {
        const deadlines = data.deadlines;
        if (deadlines.length !== 0) {
            const user_answer = confirm("Are you sure? This action can't be undone!");
            if (user_answer) {
                chrome.storage.local.set({ deadlines: []}, function() {
                    RetrieveDeadlines();
                    AdjustHeight();
                });
                SaveHistoryEvent(`Removed all the ${deadlines.length} deadlines.`);
            }
        }
    });
}

function CalculateDeadlineTime(deadline_date) {
    const now = Date.now();
    const target = new Date(deadline_date).getTime();
    const diff = target - now;

    if (diff <= 0) return 'Expired';

    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor((Math.floor(diff / (1000 * 60)) % (60 * 24)) / 60);
    const days = Math.floor((Math.floor(diff / (1000 * 60)) % (60 * 24 * 7)) / (60 * 24));
    const weeks = Math.floor(Math.floor(diff / (1000 * 60)) / (60 * 24 * 7));

    return { weeks, days, hours, minutes };
}

function ConvertDate(timer_span, deadline_id, is_converted) {
    chrome.storage.local.get({ deadlines: [] }, function(data) {
        const converted_deadline_timer = data.deadlines.find(deadline => deadline.id == deadline_id);
        if (!converted_deadline_timer) return;

        if (!is_converted) {
            const d = new Date(converted_deadline_timer.date);
            timer_span.textContent = `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        } else {
            const date = CalculateDeadlineTime(converted_deadline_timer.date);
            if (date == 'Expired') timer_span.textContent = 'Expired';
            else if (date.weeks > 0) timer_span.textContent = `${date.weeks}w ${date.days}d ${date.hours}h ${date.minutes}m`;
            else timer_span.textContent = `${date.days}d ${date.hours}h ${date.minutes}m`;
        }
    });

    return !is_converted;
}

function SaveHistoryEvent(user_action) {
    chrome.storage.local.get({ history: [] }, function(data) {
        const history = data.history;
        const timestamp = Timestamp();
        const action = `${timestamp}: ${user_action}`;
        const event = {id: GenerateId(), action};
        history.push(event);
        chrome.storage.local.set({ history: history }, function() {
            RetrieveHistory();
        });
    });
}

function GenerateId() {
    return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 6);
}

function Timestamp() {
    const timestamp = new Date();

    const yyyy = timestamp.getFullYear();
    const mm = String(timestamp.getMonth() + 1).padStart(2, '0');
    const dd = String(timestamp.getDate()).padStart(2, '0');
    const hh = String(timestamp.getHours()).padStart(2, '0');
    const min = String(timestamp.getMinutes()).padStart(2, '0');
    
    return `${yyyy}:${mm}:${dd} ${hh}:${min}`;
}