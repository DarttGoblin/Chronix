const timer_progress = document.querySelector(".timer-progress");
const timer_duration_text = document.querySelector('.timer-duration');
const svg_buttons_minus_timer = document.querySelector('.svg-buttons-minus-timer');
const svg_buttons_minus_timer_small = document.querySelector('.svg-buttons-minus-timer-small');
const svg_buttons_add_timer = document.querySelector('.svg-buttons-add-timer');
const svg_buttons_add_timer_small = document.querySelector('.svg-buttons-add-timer-small');
const start_timer = document.querySelector('.start-timer');

RetrieveTimerDuration();

svg_buttons_minus_timer.onclick = SubtractTimerByLargeStep;
svg_buttons_add_timer.onclick = AddTimerByLargeStep;
svg_buttons_minus_timer_small.onclick = SubtractTimerBySmallStep;
svg_buttons_add_timer_small.onclick = AddTimerBySmallStep;
start_timer.onclick = StartTimer;


function StartTimer() {
    chrome.storage.local.get({ started: false }, function(data) {
        const started = data.started;

        if (!started) {
            const time_clicked = new Date().getTime();
            chrome.storage.local.set({ time_clicked: time_clicked });
            chrome.storage.local.set({ started: true });
            start_timer.textContent = 'Reset';
            RetrieveTimerDuration();
        } else {
            chrome.storage.local.set({ timer_duration: 40 });
            chrome.storage.local.set({ time_clicked: 0 });
            chrome.storage.local.set({ started: false });
            start_timer.textContent = 'Start';
            RetrieveTimerDuration();
        }
    });
}

function ResetTimers() {
    chrome.storage.local.set({timer_duration: 40});
    RetrieveTimerDuration();
}

function RetrieveTimerDuration() {
    chrome.storage.local.get({ timer_duration: 40 }, function(data) {
        const timer_duration = data.timer_duration;
        chrome.storage.local.get({ time_clicked: 0 }, function(data) {
            const time_clicked = data.time_clicked;
            if (time_clicked == 0) {
                const hours = Math.floor(timer_duration / 60);
                const minutes = timer_duration % 60;
                timer_duration_text.textContent = `${DateFormat(hours)} : ${DateFormat(minutes)}`;
                UpdateTimerProgress(0);
            }

            else {
                const target = new Date(time_clicked + timer_duration * 60000);
                const now = new Date();
                const diff = target - now;
                if (diff < 0) {
                    timer_duration_text.textContent = `00 : 00`;
                    chrome.storage.local.set({ timer_duration: 40 });
                    chrome.storage.local.set({ time_clicked: 0 });
                    chrome.storage.local.set({ started: false });
                }
                else {
                    const minutes_left = Math.floor((diff / 1000) / 60);
                    const hours = Math.floor(minutes_left / 60);
                    const minutes = minutes_left % 60;
                    const timer_percent = ((timer_duration * 60000 - diff) / (timer_duration * 60000)) * 100;
                    timer_duration_text.textContent = `${DateFormat(hours)} : ${DateFormat(minutes)}`;
                    UpdateTimerProgress(timer_percent);
                }
            }
        });
    });

    chrome.storage.local.get({ started: false }, function(data) {
        const started = data.started;

        if (started) {
            start_timer.textContent = 'Reset';
        } else {start_timer.textContent = 'Start';}
    });
}

function UpdateTimerProgress(timer_percent) {
    let circumference = 2 * Math.PI * 45;
    let offset = circumference * (1 - timer_percent / 100);
    timer_progress.style.strokeDashoffset = offset;
}

function AddTimerByLargeStep() {
    chrome.storage.local.get({ timer_duration: 40 }, function(data) {
        let timer_duration = data.timer_duration;
        if (timer_duration + 20 > 600) {return;}
        timer_duration = timer_duration + 20;
        chrome.storage.local.set({ timer_duration });
        RetrieveTimerDuration();
    });
}

function SubtractTimerByLargeStep() {
    chrome.storage.local.get({ timer_duration: 40 }, function(data) {
        let timer_duration = data.timer_duration;
        if (timer_duration - 20 < 20) {return;}
        timer_duration = timer_duration - 20;
        chrome.storage.local.set({ timer_duration });
        RetrieveTimerDuration();
    });
}

function AddTimerBySmallStep() {
    chrome.storage.local.get({ timer_duration: 40 }, function(data) {
        let timer_duration = data.timer_duration;
        if (timer_duration + 1 > 600) {return;}
        timer_duration = timer_duration + 1;
        chrome.storage.local.set({ timer_duration });
        RetrieveTimerDuration();
    });
}

function SubtractTimerBySmallStep() {
    chrome.storage.local.get({ timer_duration: 40 }, function(data) {
        let timer_duration = data.timer_duration;
        if (timer_duration - 1 < 20) {return;}
        timer_duration = timer_duration - 1;
        chrome.storage.local.set({ timer_duration });
        RetrieveTimerDuration();
    });
}

function DateFormat(date) {
    if (date < 10) return `0${date}`;
    else return date;
}

// chrome.storage.local.set({ timer_duation: 40 })
// chrome.storage.local.set({ time_clicked: 0 })
// chrome.storage.local.set({ started: false });