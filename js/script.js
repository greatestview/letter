/**
 * @author      Kim-Christian Meyer
 * @copyright   2016 Kim-Christian Meyer
 * @license     GPL-3.0+
 */

; "use strict";

(function (window, document, gv) {

  // Data fields to be stored and recovered
  var dataItems = [
    'address-overline',
    'address',
    'sidebar-text',
    'body-subject',
    'body-text',
    'attachments-bd'
  ];


  gv.createDateGerman = function () {
    return new Date().toLocaleDateString('de', { day: 'numeric', month: 'long', year: 'numeric' });
  }


  gv.createDateEnglishShort = function () {
    return new Date().toISOString().slice(0, 10)
  }


  gv.getDraft = function () {
    return JSON.parse(localStorage.getItem('draft'));
  }


  /**
   * @return false, if there was no data stored. true, if restored successfully
   */
  gv.restoreDraft = function () {
    var draft = gv.getDraft();
    if (draft !== null) {
      // iterate through all data fields
      dataItems.forEach(e => document.getElementById(e).innerHTML = draft[e]);
      return true;
    }
    return false;
  }


  gv.saveDraft = function () {
    // iterate through all data fields
    var draft = {};
    dataItems.forEach(e => {
      let data = document.getElementById(e).innerHTML;
      if (typeof data !== 'undefined') {
        draft[e] = data;
      }
    });
    localStorage.setItem('draft', JSON.stringify(draft));
  }


  gv.deleteDraft = function () {
    localStorage.removeItem('draft');
  }


  /**
   * If local storage is set, show info box with delete button.
   */
  gv.triggerStorageInfo = function () {
    if (gv.getDraft() == null) {
      document.getElementById('clear-storage-btn').classList.remove('is-visible');
    }
    else {
      document.getElementById('clear-storage-btn').classList.add('is-visible');
    }
  }


  gv.setTitleFromSubjectAndDate = function () {
    var title = document.getElementById('body-subject').innerHTML.trunc(60, true);
    document.title = gv.createDateEnglishShort() + ' ' + title;
  }


  /**
   * @see http://stackoverflow.com/a/1199420
   */
  String.prototype.trunc =
    function (n, useWordBoundary) {
      var toLong = this.length > n,
        s_ = toLong ? this.substr(0, n - 1) : this;
      s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
      // return toLong ? s_ + '…' : s_;
      return s_;
    };


  if (window.applicationCache) {
    applicationCache.addEventListener('updateready', function () {
      if (confirm('Es gibt eine neue Version des Briefgenerators. Seite neu Laden?')) {
        window.location.reload();
      }
    });
  }


  document.addEventListener('DOMContentLoaded', function () {

    // Retrieve local storage data.
    if (!gv.restoreDraft()) {
      // if there is no data stored, update date
      document.getElementById('sidebar-date').innerHTML = gv.createDateGerman();
    }

    // Check whether to show delete-storage-button or not.
    gv.triggerStorageInfo();

    // Set title.
    gv.setTitleFromSubjectAndDate();

    // Event listener

    document.querySelectorAll('[contenteditable="true"]').forEach(e => e.addEventListener('input', function (_) {
      gv.saveDraft();
      gv.triggerStorageInfo();
    }));

    document.getElementById('clear-storage-btn').addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('Der Entwurf wird endgültig gelöscht. Bist du dir sicher?')) {
        gv.deleteDraft();
        gv.triggerStorageInfo();
      }
    });

    document.getElementById('body-subject').addEventListener('input', e =>
      gv.setTitleFromSubjectAndDate()
    );

  });

})(window, document, window.gv = window.gv || {});
