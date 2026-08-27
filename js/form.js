/* ────────────────────────────────────────────────────────────────────────────
   Contact form: client-side validation and background submission.

   The form posts to Web3Forms, which needs no backend of its own. If JavaScript
   is unavailable the form still submits normally and the visitor is redirected
   to thank-you.html, so nobody loses their message.
   ──────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var button = document.getElementById('submit-btn');
    var status = document.getElementById('form-status');
    var originalLabel = button ? button.innerHTML : '';

    /* Field name -> validation rule. Keeping this as data makes it easy to
       add a field later without touching the submit handler. */
    var rules = [
      { id: 'name', errorId: 'err-name', message: 'Please enter your name.',
        test: function (v) { return v.length >= 2; } },
      { id: 'email', errorId: 'err-email', message: 'Please enter a valid email address.',
        test: function (v) { return EMAIL_PATTERN.test(v); } },
      { id: 'service', errorId: 'err-service', message: 'Please choose a service.',
        test: function (v) { return v !== ''; } },
      { id: 'message', errorId: 'err-message', message: 'Please tell us a little about the project.',
        test: function (v) { return v.length >= 10; } },
      { id: 'phone', errorId: 'err-phone', message: 'Please enter a valid phone number, or leave it blank.',
        test: function (v) { return v === '' || /^[+\d][\d\s()-]{7,19}$/.test(v); } }
    ];

    function showError(rule, show) {
      var field = document.getElementById(rule.id);
      var slot = document.getElementById(rule.errorId);
      if (!field) return;

      field.setAttribute('aria-invalid', show ? 'true' : 'false');
      if (slot) slot.textContent = show ? rule.message : '';
    }

    function validateAll() {
      var firstBad = null;

      rules.forEach(function (rule) {
        var field = document.getElementById(rule.id);
        if (!field) return;

        var valid = rule.test(field.value.trim());
        showError(rule, !valid);
        if (!valid && !firstBad) firstBad = field;
      });

      return firstBad;
    }

    /* Clear a field's error as soon as the visitor starts fixing it. */
    rules.forEach(function (rule) {
      var field = document.getElementById(rule.id);
      if (!field) return;

      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') {
          if (rule.test(field.value.trim())) showError(rule, false);
        }
      });
      field.addEventListener('blur', function () {
        if (field.value.trim() !== '') showError(rule, !rule.test(field.value.trim()));
      });
    });

    function setStatus(kind, text) {
      if (!status) return;
      status.textContent = text;
      status.className = 'form-status show ' + kind;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstBad = validateAll();
      if (firstBad) {
        firstBad.focus();
        setStatus('bad', 'Please fix the highlighted fields and try again.');
        return;
      }

      if (button) {
        button.disabled = true;
        button.innerHTML = 'Sending...';
      }
      if (status) status.className = 'form-status';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            throw new Error(result.data && result.data.message ? result.data.message : 'Request failed');
          }

          form.reset();
          setStatus('ok', 'Thanks. Your message is with us and we will reply within one working day.');

          if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', { form_name: 'contact' });
          }
          if (typeof fbq === 'function') {
            fbq('track', 'Lead');
          }

          window.setTimeout(function () {
            window.location.href = 'thank-you.html';
          }, 1200);
        })
        .catch(function () {
          setStatus(
            'bad',
            'Something went wrong sending that. Please email us directly or message us on WhatsApp.'
          );
        })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.innerHTML = originalLabel;
          }
        });
    });
  });
})();
