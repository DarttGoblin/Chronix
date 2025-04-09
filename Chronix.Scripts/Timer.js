CheckTimer();

function CheckTimer() {
    let checking = setInterval(() => {
        chrome.storage.local.get({ timer_duration: 40, time_clicked: 0, started: false }, function(data) {
            const started = data.started;

            if (started) {
                const timer_duration = data.timer_duration;
                const time_clicked = data.time_clicked;

                const target = new Date(time_clicked + timer_duration * 60000);
                const now = new Date();
                const diff = target - now;
                
                if (diff < 0) {
                    chrome.runtime.sendMessage({ type: 'times-up', title: 'Times Up', message: "⏰ That's it! Time's up. Let's crush the next one!" });
                    clearInterval(checking);
                }
            }
        });
    }, 10000);
}