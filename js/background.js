var app = {};

app.global = {
    systemState1: 'active',
    systemState2: 'active',
};

app.reminder = {
    init: function() {
        chrome.alarms.onAlarm.addListener(app.reminder.sitListener);
        app.reminder.checkSystemState();
        if (localStorage.saved) {
            userPreferences.loadDom();
            checkStatus();
        } else {
            userPreferences.init(15, 60, 20);
        }
        if (localStorage.firstRun === 'done') {
            return;
        } else {
            app.reminder.run();
            localStorage.setItem('firstRun', 'done');
        }
    },
    run: function() {
        var prefs = userPreferences.getPreferences();
        var time = prefs.timeOption;
        chrome.alarms.clearAll();
        //if reminders are disabled, turn it all off.
        if (prefs.enabledOption != 'checked') {
            userPreferences.disableQuestions(true);
            return;
        } else {
            this.timedReminder(time);
        }

    },

    timedReminder: function(time) {
        chrome.alarms.create('situp', {
            delayInMinutes: parseInt(time),
            periodInMinutes: parseInt(time)
        });
    },
    setIdleTime: function() {
        var prefs = userPreferences.getPreferences();
        var time = prefs.timeOption;
        var queryTime = 30; //seconds
        if (time > 5) {
            queryTime = (time * 60) - ((time * 60) - 240); //4 minutes
        }
        return queryTime;
    },
    sitListener: function(alarm) {
        var queryTime = app.reminder.setIdleTime();
        if (alarm.name === 'situp') {
            chrome.idle.queryState(queryTime, function(newState) {
                if (newState === 'active') {
                    app.reminder.displayMessage();
                }
            });
        }
    },

    checkSystemState: function() {
        chrome.idle.setDetectionInterval(60);
        chrome.idle.onStateChanged.addListener(function(newState) {
            if (newState === 'idle') {
                app.global.systemState2 = 'idle';
            } else if (newState === 'locked') {
                app.global.systemState2 = 'locked';
            } else {
                app.global.systemState2 = 'awake';
            }
            app.reminder.manageAlarms();
        });
    },
    manageAlarms: function() {
        if (app.global.systemState2 === 'locked') {
            chrome.alarms.clearAll();
        } else if (app.global.systemState2 === 'awake' && app.global.systemState1 === 'locked') {
            this.run();
        }
        app.global.systemState1 = app.global.systemState2;
    },
    displayQuote: function(arrOfQuotes) {
            randomInt = Math.floor(Math.random() * arrOfQuotes.length); // TODO: math.floor ?
        selectedQuote = arrOfQuotes[randomInt];
        return selectedQuote;
    },
    displayMessage: function() {
        var prefs = userPreferences.getPreferences();
        var title = '';
        var messageBody = this.displayQuote(QuoteArray);
        var fadeTime = parseInt(prefs.fadeTimeOption) * 1000;
        if (Notification.permission === "granted") {
            var notification = new Notification(title, {
                body: messageBody,
                icon: 'img/quill.png',
                tag: 'Quote Reminder'
            });
            if (prefs.closeOption == 1) {
                setTimeout(function() {
                    notification.close();
                }, fadeTime);
            }
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function(permission) {
                if (permission === 'granted') {
                    var sitNotification = new Notification(title, {
                        body: messageBody,
                        icon: 'img/quill.png'
                    });
                    if (prefs.closeOption == 1) {
                        setTimeout(function() {
                            sitNotification.close();
                        }, fadeTime);
                    }
                } else {
                    $('#tell-user').text('Desktop notifications must be allowed in order for this extension to run.');
                    return;
                }
            });
        }
    },

};

//if user decides to disable reminders, disable all other options
$('input[name="default"]').click(function() {

    var bool = false;

    if (!$(this).prop('checked')) {
        bool = true;
    }
    userPreferences.disableQuestions(bool);
    $('.savemsg').show();
});

$('#submit').click(function(e) {
    e.preventDefault();
    $('.savemsg').hide();
    if (userPreferences.validateTime() === false) {
        return;
    } else {

        userPreferences.save();
        app.reminder.run();
    }
});

$('#confirmUpload').click(function() {

});

var QuoteArray = ['Straighten up'
        // 'RUTHLESSLY Prioritize. Act fierce and ferocious about how you prioritize your time, money and life. Your time is your most valuable asset. Protect it.',
        // 'Today is NOT "just another day". It is different than eveyr other day in your life. MAKE it different.',
        // 'Think different today. Are you in the same stale mental routine? Get out of it NOW.',
        // 'Great ideas always evolve. Your first version should NOT be the final version.',
        // 'Noticing small changes early helps you adapt to the bigger changes that are yet to come.',
        // 'Old beliefs do NOT lead to new ideas/actions/situations.',
        // 'Imaging yourself enjoying new cheese leads you to it.',
        // 'Movement in a new direciton helps you find new cheese.'
    ];

$(function() { //on page load

        var fileInput = document.getElementById('uploadFile');

        fileInput.addEventListener('change', function(e) {
            var file = fileInput.files[0];
            var textType = /text.*/;
            var reader;

            if (file.type.match(textType)) {
                reader = new FileReader();
                reader.onload = function(e) {
                    var quotes = reader.result;
                    var array = quotes.toString().split("\n");
                    console.log(array);
                    console.log(QuoteArray);
                    for (var i = 0; i<array.length; i++){
                        QuoteArray.push(array[i]);
                    }
                    $('#uploadPreview').append(reader.result);
                };
            } else {
                fileDisplayArea.innerText = "File not supported!";
            }
            reader.readAsText(file);
        });
    });
    // $('input[name="close"]').change(function() {
    //   $('#fadeTime').prop('disabled', $(this).val() != 1);
    // });

app.reminder.init();

chrome.runtime.onInstalled.addListener(function() {
    chrome.alarms.onAlarm.removeListener(app.reminder.sitListener);
    chrome.alarms.onAlarm.addListener(app.reminder.sitListener);
    app.reminder.run();
});

chrome.runtime.onStartup.addListener(function() {
    chrome.alarms.onAlarm.removeListener(app.reminder.sitListener);
    chrome.alarms.onAlarm.addListener(app.reminder.sitListener);
    app.reminder.run();
});

x = document.getElementById("upload");
