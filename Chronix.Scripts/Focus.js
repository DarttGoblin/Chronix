const timer_progress = document.querySelector(".timer-progress");
const timer_duration_text = document.querySelector('.timer-duration');
const svg_buttons_minus_timer = document.querySelector('.svg-buttons-minus-timer');
const svg_buttons_add_timer = document.querySelector('.svg-buttons-add-timer');
const play_music = document.querySelector('.play-music');
const start_timer = document.querySelector('.start-timer');

RetrieveTimerDuration();

svg_buttons_minus_timer.onclick = SubtractTimer;
svg_buttons_add_timer.onclick = AddTimer;
play_music.onclick = PlayMusic;
start_timer.onclick = StartTimer;


function StartTimer() {
    const time_clicked = new Date();
    chrome.storage.local.set({ time_clicked });
    start_timer.textContent = 'Stop';
    RetrieveTimerDuration();
}

function StopTimers() {
    chrome.storage.local.set({ time_clicked: 'none' });
    start_timer.textContent = 'Start';
}

function ResetTimers() {
    chrome.storage.local.set({timer_duration: 40});
    RetrieveTimerDuration();
}

function RetrieveTimerDuration() {
    chrome.storage.local.get({ timer_duration: 40 }, function(data) {
        const timer_duration = data.timer_duration;
        chrome.storage.local.get({ time_clicked: 'none' }, function(data) {
            const time_clicked = data.time_clicked;
            if (time_clicked == 'none') {
                const hours = Math.floor(timer_duration / 60);
                const minutes = timer_duration % 60;
                timer_duration_text.textContent = `${DateFormat(hours)} : ${DateFormat(minutes)}`;
            }

            else {
                const target = new Date(new Date(time_clicked).getTime() + timer_duration * 60000);
                const now = new Date();
                const diff = target - now;
                if (diff < 0) {
                    timer_duration_text.textContent = `00 : 00`;
                }
                else {
                    const minutes_left = Math.floor((diff / 1000) / 60);
                    const hours = Math.floor(minutes_left / 60);
                    const minutes = minutes_left % 60;
                    timer_duration_text.textContent = `${DateFormat(hours)} : ${DateFormat(minutes)}`;
                }
            }
        });
    });
}

function UpdateTimerProgress(timer_percent) {
    let circumference = 2 * Math.PI * 45;
    let offset = circumference * (1 - timer_percent / 100);
    timer_progress.style.strokeDashoffset = offset;
}

function AddTimer() {
    chrome.storage.local.get({ timer_duration: 40 }, function(data) {
        let timer_duration = data.timer_duration;
        if (timer_duration == 600) {return;}
        timer_duration = timer_duration + 20;
        chrome.storage.local.set({ timer_duration });
        RetrieveTimerDuration();
    });
}

function SubtractTimer() {
    chrome.storage.local.get({ timer_duration: 5 }, function(data) {
        let timer_duration = data.timer_duration;
        if (timer_duration == 20) {return;}
        timer_duration = timer_duration - 20;
        chrome.storage.local.set({ timer_duration });
        RetrieveTimerDuration();
    });
}

function DateFormat(date) {
    if (date < 10) return `0${date}`;
    else return date;
}

function TimesUp() {
    return setInterval(() => {
        chrome.storage.local.get({})
    })
}