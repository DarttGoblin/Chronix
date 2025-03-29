const deadlines_container = document.querySelector('.deadlines-container');
const add_deadline = document.querySelector('.add-deadline');

// RetrieveDeadlines();
add_deadline.onclick = RequestUserInput;

function RetrieveDeadlines() {
    console.log('retrieving data...');
    chrome.storage.local.get({ deadlines: [] }, function(data) {
        const deadlines = data.deadlines;

        if (deadlines.length == 0) {
            const no_deadlines = document.createElement('span');
            no_deadlines = 'No Deadlines Are At The Moment, Booyah! 😊';
            deadlines_container.appendChild(no_deadlines);
            return;
        }

        deadlines.forEach(deadline => {
            CreateDeadline(deadline);
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
        console.log(title)
        console.log(date)
        if (!title || !date) {
            alert("Some information must be forgotten!");
            return;
        }

        const deadline = {
            id: GenerateId(),
            title,
            date
        };
        console.log(deadline.id)
        console.log(deadline.title)
        console.log(deadline.date)
        deadlines_container.removeChild(deadline_user_info);
        CreateDeadline(deadline);
    }
}

function CreateDeadline(deadline) {
    const deadline_container = document.createElement('div');
    const deadline_title = document.createElement('span');
    const deadline_timer_and_icons_container = document.createElement('div');
    const deadline_timer = document.createElement('span');
    const deadline_trash_icon = document.createElement('i');
    const deadline_pen_icon = document.createElement('i');

    deadline_title.innerHTML = deadline.title;
    deadline_timer.innerHTML = CalculateTime(deadline.date);
    deadline_trash_icon.setAttribute('deadline-id', deadline.id);

    deadline_container.classList.add('deadline-container');
    deadline_title.classList.add('deadline-title');
    deadline_timer_and_icons_container.classList.add('deadline-timer-and-icons-container');
    deadline_timer.classList.add('deadline-timer');
    deadline_trash_icon.classList.add('deadline-trash-icon');

    deadline_timer_and_icons_container.appendChild(deadline_timer);
    deadline_timer_and_icons_container.appendChild(deadline_trash_icon);
    deadline_timer_and_icons_container.appendChild(deadline_pen_icon);
    deadline_container.appendChild(deadline_title);
    deadline_container.appendChild(deadline_timer_and_icons_container);
    deadlines_container.appendChild(deadline_container);

    chrome.storage.local.get({ deadlines: [] }, function(data) {
        const deadlines = data.deadlines;
        deadlines.push(deadline);

        chrome.storage.local.set({ deadlines: deadlines });
    });
}

// function DeleteDeadline(deadline_id) {
//     console.log('this one will be deleted...');
// }

function CalculateTime(deadline_date) {
    const now = Date.now();
    const target = new Date(deadline_date).getTime();
    const diff = target - now;

    if (diff <= 0) {return 'Expired';}
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    
    return `${days}d ${hours}h ${minutes}m`;
}

function GenerateId() {
    return Date.now() + Math.random().toString(36).substr(2, 5);
}