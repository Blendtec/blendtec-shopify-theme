import $ from 'jquery';
import hash from './hash';

var loginForm = {
    init: function() {
        loginForm.cacheSelectors();

        loginForm.el.$recoverPasswordLink.on('click', function(evt) {
            evt.preventDefault();
            loginForm.showRecoverPasswordForm();
        });

        loginForm.cache.$hideRecoverPasswordLink.on('click', function(evt) {
            evt.preventDefault();
            loginForm.hideRecoverPasswordForm();
        });

        if (hash.getHash() == '#recover') {
            loginForm.showRecoverPasswordForm();
        }

        loginForm.document.on('bt:password-reset-success', loginForm.resetPasswordSuccess);
    },
    cacheSelectors: function() {
        loginForm.el.$document = $(document);
        loginForm.el.$recoverPasswordLink = $('#RecoverPassword');
        loginForm.el.$hideRecoverPasswordLink = $('#HideRecoverPasswordLink');
        loginForm.el.$recoverPasswordForm = $('#RecoverPasswordForm');
        loginForm.el.$customerLoginForm = $('#CustomerLoginForm');
        loginForm.el.$passwordResetSuccess = $('#ResetSuccess');
    },
    hideRecoverPasswordForm: function() {
        loginForm.el.$recoverPasswordForm.hide();
        loginForm.el.$customerLoginForm.show();
    },
    showRecoverPasswordForm: function() {
        loginForm.el.$recoverPasswordForm.show();
        loginForm.el.$customerLoginForm.hide();
    },
    resetPasswordSuccess: function () {
        loginForm.el.$passwordResetSuccess.show();
    }
};
