const deadlines_container = document.querySelector('.deadlines-container');
const add_deadline = document.querySelector('.add-deadline');

add_deadline.onclick = RequestUserInput;

function RetrieveDeadlines() {
    chrome.storage.local.get()
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

    deadline_user_title.classList.add('deadline-user-title');
    deadline_user_date.classList.add('deadline-user-date');
    deadline_user_info.classList.add('deadline-user-info');
    deadline_user_button.classList.add('deadline-user-button');

    deadline_user_info.appendChild(deadline_user_title);
    deadline_user_info.appendChild(deadline_user_date);
    deadline_user_info.appendChild(deadline_user_button);
    deadlines_container.appendChild(deadline_user_info);
    
    deadline_user_button.onclick = function() {
        const title = deadline_user_title.value.trim(); 
        const date = deadline_user_date.value;
        if (!title || !date) {
            alert("Some information must be forgotten!");
            return;
        }

        const deadline_data = {
            id: GenerateId(),
            type: 'deadline',
            title,
            date
        };
        CreateDeadline(deadline_data);
    }
}

function CreateDeadline(deadline_data) {
    const deadline_container = document.createElement('div');
    const deadline_title = document.createElement('span');
    const deadline_timer_and_icons_container = document.createElement('div');
    const deadline_timer = document.createElement('span');
    const deadline_trash_icon = document.createElement('i');
    const deadline_pen_icon = document.createElement('i');

    deadline_title.innerHTML = deadline_data.title;
    deadline_timer.innerHTML = CalculateTime(deadline_data.date);

    deadline_container.classList.add('deadline-container');
    deadline_title.classList.add('deadline-title');
    deadline_timer_and_icons_container.classList.add('deadline-timer-and-icons-container');
    deadline_timer.classList.add('deadline-timer');
    deadline_trash_icon.classList.add('deadline-trash-icon');
    deadline_pen_icon.classList.add('deadline-pen-icon');

    deadline_timer_and_icons_container.appendChild(deadline_timer);
    deadline_timer_and_icons_container.appendChild(deadline_trash_icon);
    deadline_timer_and_icons_container.appendChild(deadline_pen_icon);
    deadline_container.appendChild(deadline_title);
    deadline_container.appendChild(deadline_timer_and_icons_container);
    deadlines_container.appendChild(deadline_container);

    chrome.storage.local.set({ deadline: deadline_data });
}

function EditDeadline() {

}

function DeleteDeadline() {

}

function CalculateTime() {
    
}

function GenerateId() {
    return Date.now() + Math.random().toString(36).substr(2, 5);
}