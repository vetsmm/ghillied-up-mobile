import {axiosInstance as axios} from './api'
import {EnableTotpMfaDto} from "../models/mfa/enable-totp-mfa";

const disableMfa = async (): Promise<void> => {
    await axios.delete(`/multi-factor-authentication`)
        .then((response) => response.data);
}

const regenerateBackupCodes = async (): Promise<string[]> => {
    return await axios.post(`/multi-factor-authentication/regenerate`)
        .then((response) => response.data);
}

const enableTotp = async (totp: EnableTotpMfaDto): Promise<string[]> => {
    return await axios.post(`/multi-factor-authentication/totp`, totp)
        .then((response) => response.data);
}

const requestTotpMfa = async (): Promise<{ img: string; secret: string }> => {
    return await axios.post(`/multi-factor-authentication/totp`)
        .then((response) => response.data);
}

const enableSms = async (token: string): Promise<string[]> => {
    return await axios.post(`/multi-factor-authentication/sms`, {
        token
    }).then((response) => response.data);
}

const requestSmsMfa = async (): Promise<{ success: true }> => {
    return await axios.post(`/multi-factor-authentication/sms`)
        .then((response) => response.data);
}

const enableEmailMfa = async (token: string): Promise<string[]> => {
    return await axios.post(`/multi-factor-authentication/email`, {
        token
    }).then((response) => response.data);
}

const requestEmailMfa = async (): Promise<{ success: true }> => {
    return await axios.post(`/multi-factor-authentication/email`)
        .then((response) => response.data);
}

const mfaService = {
    disableMfa,
    regenerateBackupCodes,
    enableTotp,
    requestTotpMfa,
    enableSms,
    requestSmsMfa,
    enableEmailMfa,
    requestEmailMfa
}

export default mfaService;
