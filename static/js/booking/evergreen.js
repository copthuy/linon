import { 
    matchFirst
    , getVesselStr
    , getPODStr
    , getDatePrefix
    , getBookingET
    , addExtraDate
} from '../common.js';

export function booking_number(content) {
    return matchFirst(
        content,
        /booking\s+no\s*:\s*(\w+)/i
    );
}

export function booking_date(content) {
    return getDatePrefix(
        content,
        /date\s*:\s*/i,
        /(\d{4}\/\d{2}\/\d{2})/i
    );
}

export function bill_number(content) {
    return 'EGLV' + booking_number(content);
}

export function vessel(content) {
    return [getVesselStr(
        content,
        /vessel\/voyage\s*:\s*([^\n]+)/i
    )];
}

export function pol(content) {
    return getPODStr(
        content,
        /port\s+of\s+loading\s*:\s*([^\n]+)/i
    );
}

export function pod(content) {
    return getPODStr(
        content,
        /port\s+of\s+discharge\s*:\s*([^\n]+)/i
    );
}

const date_time = /(\d{4}\/\d{2}\/\d{2}(\s+\d{2}:\d{2})?)/i;

export function closing_time(content) {
    return getDatePrefix(
        content,
        /cut\s+off\s+date\s*\/\s*time\s*:\s*/i,
        date_time
    );
}

export function si_cut_off(content) {
    return getDatePrefix(
        content,
        /si\s+cut\s+off\s+date\s*:\s*/i,
        date_time
    );
}


export function etd(content) {
    return getBookingET(
        content,
        /etd\s+date\s*:\s*/i,
        date_time,
        'min'
    );
}

export function eta_origin(content) {
    return getBookingET(
        content,
        /eta\s+date\s*:\s*/i,
        date_time,
        'max'
    );
}

export function eta(content) {
    return addExtraDate(eta_origin(content), pod(content));
}
