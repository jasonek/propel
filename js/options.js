var userPreferences = {
  enableQuestion: $('#default'),
  timeQuestion: $('#time'),
  // closeQuestion: $('input[name="close"]'),
  // walkQuestion: $('#walk'),
  fadeTimeQuestion: $('#fadeTime'),

  init: function(time, walkTime, fadeTime) { //remove walkTime
    localStorage.setItem('enabled', 'checked');
    localStorage.setItem('time', time);
    localStorage.setItem('fadeTime', fadeTime);
    // localStorage.setItem('close', '1');
    // localStorage.setItem('walk', 'not checked');
    localStorage.setItem('saved', 'true');

    this.enableQuestion.prop('checked', true);
    this.timeQuestion.val(time);
    this.fadeTimeQuestion.val(fadeTime);
    // this.closeQuestion.filter('[value="1"]').attr('checked', 'checked');
    // this.walkQuestion.prop('checked', false);
  },

  getPreferences: function() {
    var allPrefs = {
      enabledOption: localStorage.enabled,
      timeOption: localStorage.time,
      fadeTimeOption: localStorage.fadeTime,
      // closeOption: localStorage.close,
      // walkOption: localStorage.walk
    };
    return allPrefs;
  },

  loadDom: function() {
    var preferences = this.getPreferences();
    if(preferences.enabledOption === 'checked') {
      this.enableQuestion.prop('checked', 'checked'); // TODO: what is .prop?
    } else {
      userPreferences.disableQuestions(true);
    }
    this.timeQuestion.val(preferences.timeOption);
    this.fadeTimeQuestion.val(preferences.fadeTimeOption);
    // $.each(this.closeQuestion, function() {
      // if($(this).val() == preferences.closeOption) {
        // $(this).attr('checked', 'checked');
      // }
    // });

    // this.fadeTimeQuestion.prop('disabled', preferences.closeOption != 1);
    // if(preferences.walkOption == 'checked') {
      // this.walkQuestion.prop('checked', 'checked');
    // }
  },

  disableQuestions: function(bool) {
      this.timeQuestion.prop('disabled', bool);
      // this.closeQuestion.prop('disabled', bool);
      // this.walkQuestion.prop('disabled', bool);
      this.fadeTimeQuestion.prop('disabled', bool);
      $('li:not(.primary)').toggleClass('gray', bool);
  },

  save: function() {
      localStorage.setItem('time', this.timeQuestion.val());
      localStorage.setItem('fadeTime', this.fadeTimeQuestion.val());
      // localStorage.setItem('close', $('input[name="close"]:checked').val());

      if(this.enableQuestion.is(':checked')) {
        localStorage.setItem('enabled', 'checked');
      } else {
        localStorage.setItem('enabled', 'not checked');
      }

      // if(this.walkQuestion.is(':checked')) {
      //   localStorage.setItem('walk', 'checked');
      // } else {
      //   localStorage.setItem('walk', 'not checked');
      // }

      updateStatus();
      // setTimeout(function() { checkStatus(); }, 1000);
    },

  validateTime: function() {
    $('.hideTime').hide();
    $('input').removeClass('error-highlight');
    var postureTimeVal = this.timeQuestion.val();
    var fadeTimeVal = this.fadeTimeQuestion.val();
    var validation = true;

    if(!postureTimeVal.match(/\d/) || postureTimeVal <= 0 || postureTimeVal > 59) {
      this.timeQuestion.addClass('error-highlight');
      validation = false;
    }
    if(!fadeTimeVal.match(/\d/) || fadeTimeVal <= 0 || fadeTimeVal > 59) {
      this.fadeTimeQuestion.addClass('error-highlight');
      validation = false;
    }

    if(!validation) {
      $('.hideTime').show();
      return false;
    } else {
      return true;
    }
  }
};

function updateStatus() {
  $('#tell-user').html('Changes saved');
}

// function checkStatus() {
//   var currentStatus = localStorage.enabled;
//   if(currentStatus == 'not checked') {
//     $('#tell-user').html('Notifications are <strong>off</strong>');
//   } else {
//     $('#tell-user').html('Notifications are <strong>on</strong>');
//   }
// }
