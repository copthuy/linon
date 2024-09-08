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
        /booking\s+confirmation\s*:\s*(\w+)/i
    );
}

export function booking_date(content) {
    return '';
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

const date_time = /(\d{2}\/\d{2}\/\d{4}(\s+\d{2}:\d{2})?)/i
function fixDMYDate(dateStr) {
    const [datePart, timePart] = dateStr.split(/\s+/);
    const [day, month, year] = datePart.split('/');
    const res = `${year}-${month}-${day} ${timePart ? timePart : ''}`;

    return res;
}

export function closing_time(content) {
    return getDatePrefix(
        content,
        /closing\s+date\s*:\s*/i,
        date_time,
        fixDMYDate
    );
}

export function si_cut_off(content) {
    return getDatePrefix(
        content,
        /si\s+closing\s+time\s*:\s*/i,
        date_time,
        fixDMYDate
    );
}


export function etd(content) {
    return getBookingET(
        content,
        /sailing\s+date\s*:\s*/i,
        date_time,
        'min',
        fixDMYDate
    );
}

export function eta_origin(content) {
    return '';
}

export function eta(content) {
    return eta_origin(content);
}
