const tasks_container = document.querySelector('.tasks-container');
const add_task = document.querySelector('.add-task');
const remove_all_tasks = document.querySelector('.remove-all-tasks');

RetrieveTasks();
add_task.onclick = RequestUserInput;
remove_all_tasks.onclick = RemoveAllTasks;

function RetrieveTasks() {
    tasks_container.innerHTML = '';
    chrome.storage.local.get({ tasks: [] }, function(data) {
        const tasks = data.tasks;

        if (tasks.length == 0) {
            const no_tasks = document.createElement('span');
            no_tasks.textContent = 'No Tasks Yet. Time to Get Things Done! 🚀';
            no_tasks.classList.add('no-tasks');
            tasks_container.appendChild(no_tasks);
            return;
        }

        tasks.forEach(task => {
            CreateTask(task);
        });
    })
}

function RequestUserInput() {
    const task_user_info = document.createElement('div');
    const task_user_title = document.createElement('input');
    const task_user_button = document.createElement('button');
    
    task_user_title.placeholder = 'Enter Task Title';
    task_user_title.type = 'text';
    task_user_button.innerHTML = 'Confirm';
    
    task_user_info.classList.add('task-user-info');
    task_user_title.classList.add('task-user-title');
    task_user_button.classList.add('task-user-button');

    task_user_info.appendChild(task_user_title);
    task_user_info.appendChild(task_user_button);
    tasks_container.appendChild(task_user_info);
    
    task_user_button.onclick = function() {
        const title = task_user_title.value.trim(); 
        if (!title) {
            alert("Some information must be forgotten!");
            return;
        }

        const task = {id: GenerateId(), title, checked: false};
        tasks_container.removeChild(task_user_info);
        chrome.storage.local.get({ tasks: [] }, function(data) {
            const tasks = data.tasks;
            tasks.push(task);
    
            chrome.storage.local.set({ tasks: tasks }, function() {
                CreateTask(task);
                RetrieveTasks();
            });

            SaveHistoryEvent(`Added "${task.title}" task with the id: ${task.id}`);
        });
    }
}

function CreateTask(task) {
    const task_container = document.createElement('div');
    const task_check_box = document.createElement('div');
    const task_title = document.createElement('span');
    const task_icons_container = document.createElement('div');
    const task_trash_icon = document.createElement('i');

    task_title.innerHTML = task.title;
    task_check_box.setAttribute('task-id', task.id);
    task_trash_icon.setAttribute('task-id', task.id);
    task_check_box.onclick = function() {CheckTask(task_check_box ,task.id)};
    task_trash_icon.onclick = function() {RemoveTask(task.id)};
    
    task_container.classList.add('task-container');
    task_check_box.classList.add('task-check-box');
    task_title.classList.add('task-title');
    task_icons_container.classList.add('task-icons-container');
    task_trash_icon.classList.add('task-trash-icon', 'fa', 'fa-trash');

    task_icons_container.appendChild(task_trash_icon);
    task_container.appendChild(task_check_box);
    task_container.appendChild(task_title);
    task_container.appendChild(task_icons_container);
    tasks_container.appendChild(task_container);

    if (task.checked == true) {
        const task_check_icon = document.createElement('i');
        task_check_icon.classList.add('task-check-icon', 'fa', 'fa-check');
        task_check_box.appendChild(task_check_icon);
        task_check_box.style.border = '5px solid rgb(43, 134, 18)';
    }
}

function RemoveTask(task_id) {
    const user_answer = confirm("Are you sure? This action can't be undone!");
    if (user_answer) {
        chrome.storage.local.get({ tasks: [] }, function(data) {
            const removed_task = data.tasks.find(task => task.id == task_id);
            const tasks_filtered = data.tasks.filter(task => task.id !== task_id);
            chrome.storage.local.set({tasks: tasks_filtered}, function() {
                RetrieveTasks();
                AdjustHeight();
            });

            SaveHistoryEvent(`Removed "${removed_task.title}" task with the id: ${removed_task.id}`);
        });
    }
}

function RemoveAllTasks() {
    chrome.storage.local.get({ tasks: [] }, function(data) {
        const tasks = data.tasks;
        if (tasks.length !== 0) {
            const user_answer = confirm("Are you sure? This action can't be undone!");
            if (user_answer) {
                chrome.storage.local.set({ tasks: []}, function() {
                    RetrieveTasks();
                    AdjustHeight();
                });
                SaveHistoryEvent(`Removed all the ${tasks.length} tasks.`);
            }
        }
    })
}

function CheckTask(check_box, task_id) {
    chrome.storage.local.get({tasks: []}, function(data) {
        const tasks = data.tasks;
        tasks.forEach(task => {
            if (task.id == task_id) {
                if (!task.checked) {
                    const task_check_icon = document.createElement('i');
                    task_check_icon.classList.add('task-check-icon', 'fa', 'fa-check');
                    check_box.appendChild(task_check_icon);
                    check_box.style.border = '5px solid rgb(43, 134, 18)';
                    task.checked = true;

                    SaveHistoryEvent(`Checked "${task.title}" task with the id: ${task.id}`);
                }
                else {
                    check_box.innerHTML = '';
                    check_box.style.border = '5px solid rgb(203, 243, 197)';
                    task.checked = false;

                    SaveHistoryEvent(`Unchecked "${task.title}" task with the id: ${task.id}`);
                }
            }
        });
        chrome.storage.local.set({ tasks: tasks });
    })
}