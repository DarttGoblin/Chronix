const timer_progress = document.querySelector(".timer-progress");
const short_break_progress = document.querySelector(".short-break-progress");
const timer_duration_text = document.querySelector('.timer-duration');
const short_break_duration_text = document.querySelector('.short-break-duration');
const svg_buttons_minus_timer = document.querySelector('.svg-buttons-minus-timer');
const svg_buttons_add_timer = document.querySelector('.svg-buttons-add-timer');
const svg_buttons_minus_short_break = document.querySelector('.svg-buttons-minus-short-break');
const svg_buttons_add_short_break = document.querySelector('.svg-buttons-add-short-break');
const reset_timers = document.querySelector('.reset-timers');
const start_timers = document.querySelector('.start-timers');

RetrieveTimerDuration();
RetrieveShortBreakDuration();

svg_buttons_minus_timer.onclick = SubtractTimer;
svg_buttons_add_timer.onclick = AddTimer;
svg_buttons_minus_short_break.onclick = SubtractShortBreak;
svg_buttons_add_short_break.onclick = AddShortBreak;
reset_timers.onclick = ResetTimers;
start_timers.onclick = StartTimers;

UpdateTimerProgress(0);
UpdateShortBreakProgress(0);

function StartTimers() {
    const time_clicked = new Date();
    chrome.storage.local.get({ timer_duration: 40 }, function(data) {
        const timer_duration = data.timer_duration;
        const target = time_clicked.setMinutes(time_clicked.getMinutes + timer_duration);

        
    });

}

function StopTimers() {}

function ResetTimers() {
    chrome.storage.local.set({timer_duration: 40});
    chrome.storage.local.set({short_break_duration: 5});
    RetrieveShortBreakDuration();
    RetrieveTimerDuration();
}

function UpdateTimerProgress(timer_percent) {
    let circumference = 2 * Math.PI * 45;
    let offset = circumference * (1 - timer_percent / 100);
    timer_progress.style.strokeDashoffset = offset;
}

function UpdateShortBreakProgress(short_break_percent) {
    let circumference = 2 * Math.PI * 45;
    let offset = circumference * (1 - short_break_percent / 100);
    short_break_progress.style.strokeDashoffset = offset;
}

function RetrieveTimerDuration() {
    chrome.storage.local.get({ timer_duration: 40 }, function(data) {
        const timer_duration = data.timer_duration;
        hours = Math.floor(timer_duration / 60);
        minutes = timer_duration % 60;
        timer_duration_text.textContent = `${DateFormat(hours)} : ${DateFormat(minutes)}`;
    });
}

function RetrieveShortBreakDuration() {
    chrome.storage.local.get({ short_break_duration: 5 }, function(data) {
        const short_break_duration = data.short_break_duration;
        short_break_duration_text.textContent = DateFormat(short_break_duration);
    });
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

function AddShortBreak() {
    chrome.storage.local.get({ short_break_duration: 5 }, function(data) {
        let short_break_duration = data.short_break_duration;
        if (short_break_duration == 60) {return;}
        short_break_duration = short_break_duration + 5;
        chrome.storage.local.set({ short_break_duration });
        RetrieveShortBreakDuration();
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

function SubtractShortBreak() {
    chrome.storage.local.get({ short_break_duration: 5 }, function(data) {
        let short_break_duration = data.short_break_duration;
        if (short_break_duration == 5) {return;}
        short_break_duration = short_break_duration - 5;
        chrome.storage.local.set({ short_break_duration });
        RetrieveShortBreakDuration();
    });
}

function DateFormat(date) {
    if (date < 10) return `0${date}`;
    else return date;
}