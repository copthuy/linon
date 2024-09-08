import { 
    matchFirst
    , getVesselStr
    , getPODStr
    , getDatePrefix 
    , getBookingET
} from '../common.js';

export function booking_number(content) {
    return matchFirst(
        content,
        /booking\s+number\s*:\s*(\w+)/i 
    );
}

export function booking_date(content) {
    return getDatePrefix(
        content,
        /date\s*:\s*/i,
        /(\d{2}\s+[a-z]{3}\s+\d{2,})/i
    );
}

export function bill_number(content) {
    return '';
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

const date_time = /(\d{2}\s+[a-z]{3}\s+\d{4}(\s+\d{2}:\d{2})?)/i

export function closing_time(content) {
    return getDatePrefix(
        content,
        /intended\s+cy\s+cut-off\s*:\s*/i,
        date_time
    );
}

export function si_cut_off(content) {
    return getDatePrefix(
        content,
        /si\/esi\s+cut-off\s*:\s*/i,
        date_time
    );
}

export function etd(content) {
    return getBookingET(
        content,
        /etd\s*:\s*/i,
        date_time,
        'min'
    );
}

export function eta_origin(content) {
    return getBookingET(
        content,
        /eta\s*:\s*/i,
        date_time,
        'max'
    );
}

export function eta(content) {
    return eta_origin(content);
}
