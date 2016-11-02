/**
 * @author      Kim-Christian Meyer
 * @copyright   2016 Kim-Christian Meyer
 * @license     GPL-3.0+
 */

;"use strict";

(function (window, document, $, gv) {

  // Data fields to be stored and recovered
  var dataItems = [
    'address-overline',
    'address',
    'sidebar-text',
    'body-subject',
    'body-text',
    'attachments-bd'
  ];


  gv.createDateGerman = function() {
    var monthNames = [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
    ];

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    return day + '. ' + monthNames[month] + ' ' + year;
  }


  gv.createDateEnglishShort = function() {
    var date = new Date();
    var day = ('0' + date.getDate()).slice(-2); // with leading zero
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // with leading zero
    var year = date.getFullYear();

    return year + '-' + month + '-' + day;
  }


  gv.getDraft = function() {
    return JSON.parse(localStorage.getItem('draft'));
  }


  /**
   * @return false, if there was no data stored. true, if restored successfully
   */
  gv.restoreDraft = function() {
    var draft = gv.getDraft();
    if (draft !== null) {
      // iterate through all data fields
      for (var i = 0; i < dataItems.length; i++) {
        $('.' + dataItems[i] + ':eq(0)').html(draft[dataItems[i]]);
      }
      return true;
    }
    return false;
  }


  gv.saveDraft = function() {
    // iterate through all data fields
    var draft = {};
    for (var i = 0; i < dataItems.length; i++) {
      var data = $('.' + dataItems[i] + ':eq(0)').html();
      if (typeof data !== 'undefined') {
        draft[dataItems[i]] = data;
      }
    }
    localStorage.setItem('draft', JSON.stringify(draft));
  }


  gv.deleteDraft = function() {
    localStorage.removeItem('draft');
  }


  /**
   * If local storage is set, show info box with delete button.
   */
  gv.triggerStorageInfo = function() {
    if (gv.getDraft() == null) {
      $('.clear-storage-btn').removeClass('is-visible');
    }
    else {
      $('.clear-storage-btn').addClass('is-visible');
    }
  }


  gv.setTitleFromSubjectAndDate = function() {
    var title = $('.body-subject').text().trunc(60, true);
    document.title = gv.createDateEnglishShort() + ' ' + title;
  }


  /**
   * @see http://stackoverflow.com/a/1199420
   */
  String.prototype.trunc =
    function(n,useWordBoundary){
      var toLong = this.length > n,
          s_ = toLong ? this.substr(0, n - 1) : this;
          s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
      // return toLong ? s_ + '…' : s_;
      return s_;
    };


  if (window.applicationCache) {
    applicationCache.addEventListener('updateready', function() {
      if (confirm('Es gibt eine neue Version des Briefgenerators. Seite neu Laden?')) {
        window.location.reload();
      }
    });
  }


  $(document).ready(function() {

    // Retrieve local storage data.
    if (!gv.restoreDraft()) {
      // if there is no data stored, update date
      $('.sidebar-date').html(gv.createDateGerman());
    }

    // Check whether to show delete-storage-button or not.
    gv.triggerStorageInfo();

    // Set title.
    gv.setTitleFromSubjectAndDate();

    // Event listener
    $('[contenteditable]').on('input propertychange paste', function(e) {
      gv.saveDraft();
      gv.triggerStorageInfo();
    });

    $('.clear-storage-btn').on('click', function(e) {
      e.preventDefault();
      if (confirm('Der Entwurf wird endgültig gelöscht. Bist du dir sicher?')) {
        gv.deleteDraft();
        gv.triggerStorageInfo();
      }
    });

    $('.body-subject').on('input propertychange paste', function(e) {
      gv.setTitleFromSubjectAndDate();
    });

  });

})(window, document, jQuery.noConflict(), window.gv = window.gv || {});
