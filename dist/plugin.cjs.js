'use strict';

var core = require('@capacitor/core');
var msalBrowser = require('@azure/msal-browser');

class MsAuth extends core.WebPlugin {
    async loginWithContext(context, options) {
        try {
            return await this.acquireTokenSilently(context, options.scopes).catch(() => this.acquireTokenInteractively(context, options.scopes));
        }
        catch (error) {
            console.error('MSAL: Error occurred while logging in', error);
            throw error;
        }
    }
    async login(options) {
        const context = this.createContext(options);
        try {
            return await this.acquireTokenSilently(context, options.scopes).catch(() => this.acquireTokenInteractively(context, options.scopes));
        }
        catch (error) {
            console.error('MSAL: Error occurred while logging in', error);
            throw error;
        }
    }
    logout(options) {
        const context = this.createContext(options);
        if (!context.getAllAccounts()[0]) {
            return Promise.reject(new Error('Nothing to sign out from.'));
        }
        else {
            return context.logoutPopup();
        }
    }
    logoutAll(options) {
        return this.logout(options);
    }
    createContext(options) {
        const config = {
            auth: {
                clientId: options.clientId,
                domainHint: options.domainHint,
                authority: options.authorityUrl ?? `https://login.microsoftonline.com/${options.tenant ?? 'common'}`,
                knownAuthorities: options.knownAuthorities,
                redirectUri: options.redirectUri ?? this.getCurrentUrl(),
            },
            cache: {
                cacheLocation: 'localStorage',
            },
        };
        return new msalBrowser.PublicClientApplication(config);
    }
    getCurrentUrl() {
        return window.location.href.split(/[?#]/)[0];
    }
    async acquireTokenInteractively(context, scopes) {
        const { accessToken, idToken } = await context.acquireTokenPopup({
            scopes,
            prompt: 'select_account',
        });
        return { accessToken, idToken, scopes };
    }
    async acquireTokenSilently(context, scopes) {
        const { accessToken, idToken } = await context.acquireTokenSilent({
            scopes,
            account: context.getAllAccounts()[0],
        });
        return { accessToken, idToken, scopes };
    }
}

const MsAuthPlugin = core.registerPlugin('MsAuthPlugin', {
    web: () => new MsAuth(),
});

exports.MsAuthPlugin = MsAuthPlugin;
//# sourceMappingURL=plugin.cjs.js.map
