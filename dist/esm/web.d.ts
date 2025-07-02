import type { PublicClientApplication } from '@azure/msal-browser';
import { WebPlugin } from '@capacitor/core';

import type { BaseOptions, MsAuthPlugin } from './definitions';

interface WebBaseOptions extends BaseOptions {
    redirectUri?: string;
}
interface WebLoginOptions extends WebBaseOptions {
    scopes: string[];
}
type WebLogoutOptions = WebBaseOptions;
interface AuthResult {
    accessToken: string;
    idToken: string;
    scopes: string[];
}
export declare class MsAuth extends WebPlugin implements MsAuthPlugin {
    loginWithContext(context: PublicClientApplication, options: WebLoginOptions): Promise<AuthResult>;
    login(options: WebLoginOptions): Promise<AuthResult>;
    logout(options: WebLogoutOptions): Promise<void>;
    logoutAll(options: WebLogoutOptions): Promise<void>;
    private createContext;
    private getCurrentUrl;
    private acquireTokenInteractively;
    private acquireTokenSilently;
}
export {};
