import { 
    matchFirst
    , getVesselStr
    , getPODStr
    , getDatePrefix 
    , getBookingET 
    , getPreviousDate
} from '../common.js';

export function booking_number(content) {
    return matchFirst(
        content,
        /S\s*:\s*:\s*(\w+)/i
    );
}

export function booking_date(content) {
    return getDatePrefix(
        content,
        /ti-u\s*/i,
        /(\d{2}[a-z]{2}\s+of\s+[a-z]+\s+\d{4})/i
    );
}

export function bill_number(content) {
    return matchFirst(
        content,
        /note\s*:\s*bl([^\n]+)/i
    );
}

export function vessel(content) {
    return [getVesselStr(
        content,
        /u\/chuyn\s*([^\n]+)/i
    )];
}

export function pol(content) {
    return getPODStr(
        content,
        /cng\s+xp\s+h\+ng\s*:\s*([^\n]+)/i
    );
}

export function pod(content) {
    return getPODStr(
        content,
        /cng\s+n\s+([^\n]+)/i 
    );
}

const date_time = /(\d{2}-[a-z]{3}-\d{2,4}(\s+\d{2}:\d[^\n]*)?)/i

export function closing_time(content) {
    return getDatePrefix(
        content,
        /cy\/vgm\s+cut\s+off\s+time\s*:\s*/i,
        date_time
    );
}

export function si_cut_off(content) {
    const closing_time_date = closing_time(content);
    let regex = /international\s+te.*?service\s*:\s*([^\n]+)/i;
    let match = content.match(regex);
    if (match) {
        const term_service = match[1].replace(/\s+cy\/vgm[^\n]+/i, '').toLowerCase().trim();
        const suffix = /.*?([a-z]{3}\s+\d{2}:\d{2})\s*[ap]m\s*\n/i;
        regex = new RegExp(term_service + suffix.source, 'gi');
        const dates = [...content.matchAll(regex)].map(item => {
            const res = item[1].split(/\s+|:/);
            return getPreviousDate(closing_time_date, [res[1], res[2], res[0]]);
        });
        return new Date(Math.max(...dates));;
    }
    return '';
}

export function etd(content) {
    return getBookingET(
        content,
        /ng\+y\s+t\+u\s+ri\s+/i,
        date_time,
        'min'
    );
}

export function eta_origin(content) {
    return '';
}

export function eta(content) {
    return eta_origin(content);
}
