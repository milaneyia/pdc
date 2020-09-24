/* eslint-disable @typescript-eslint/camelcase */
import axios, { AxiosRequestConfig } from 'axios';
import Crypto from 'crypto';
import querystring from 'querystring';
import config from '../../config.json';

interface TokenResponse {
    'token_type': 'Bearer';
    'expires_in': 86400;
    'access_token': string;
    'refresh_token': string;
}

interface RequestError {
    error: string;
}

interface OsuAuthResponse {
    id: number;
    username: string;
    ranked_and_approved_beatmapset_count: number;
    country: {
        code: string;
        name: string;
    };
}

export function generateState(): string {
    return Crypto.randomBytes(48).toString('hex');
}

export function generateAuthorizeUrl(rawState: string): string {
    const hashedState = Buffer.from(rawState).toString('base64');

    return 'https://osu.ppy.sh/oauth/authorize?response_type=code' +
        '&client_id=' + config.osuv2.id +
        '&redirect_uri=' + encodeURIComponent(config.osuv2.redirect) +
        '&state=' + hashedState +
        '&scope=identify';
}

export function decodeState(hashedState: string): string {
    return Buffer.from(hashedState, 'base64').toString('ascii');
}

export async function getToken(code: string): Promise<TokenResponse | RequestError> {
    const data = querystring.stringify({
        client_id: config.osuv2.id,
        client_secret: config.osuv2.secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.osuv2.redirect,
    });

    const options: AxiosRequestConfig = {
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'post',
        url: 'https://osu.ppy.sh/oauth/token',
    };

    try {
        const res = await axios(options);

        return res.data;
    } catch (error) {
        return { error };
    }
}

export async function refreshToken(token: string): Promise<TokenResponse | RequestError> {
    const data = querystring.stringify({
        client_id: config.osuv2.id,
        client_secret: config.osuv2.secret,
        grant_type: 'refresh_token',
        refresh_token: token,
    });

    const options: AxiosRequestConfig = {
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        url: 'https://osu.ppy.sh/oauth/token',
    };

    try {
        const res = await axios(options);

        return res.data;
    } catch (error) {
        return { error };
    }
}

export async function getUserInfo(token: string): Promise<OsuAuthResponse | RequestError> {
    const options: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: 'GET',
        url: 'https://osu.ppy.sh/api/v2/me',
    };

    try {
        const res = await axios(options);

        return res.data;
    } catch (error) {
        return { error };
    }
}

export function isRequestError<T>(errorRequest: T | RequestError): errorRequest is RequestError {
    return (errorRequest as RequestError).error !== undefined;
}
