import {
    matchFirst
    , getVesselStr
    , getPODStr
    , getDatePrefix
    , getBookingET
    , getPreviousDate
    , getLines
} from '../common.js';

function fixDateStr(dateStr) {
    const [day, month, year, hours, minutes] = dateStr.split(/\D+/);
    return `${year}-${month}-${day} ${hours ? hours : '00'}:${minutes ? minutes : '00'}`;
}

export function booking_number(content) {
    return matchFirst(
        content,
        /booking\s+reference\s+(\w+)/i
    );
}

export function booking_date(content) {
    return getDatePrefix(
        content,
        /\s*valid\s+for\s+gate-in\s*\(\*\)\s+number\s+/i,
        /(\d{2}\/\d{2}\/\d{4})/i,
        fixDateStr
    );
}

export function bill_number(content) {
    return matchFirst(
        content,
        /original\/sea\s+waybill\(\*\*\)\s+(\w+)/i
    );
}

export function vessel(content) {
    return [getVesselStr(
        content,
        /vessel\s+name\s*\/\s*flag\s*([^\n]+)/i
    ).replace(/\s*(\(.+?)?voyage\s+number/gi, ' - ')];
}

export function pol(content) {
    return getPODStr(
        content,
        /port\s+of\s+loading\s*([^\n]+)/i
    ).replace(/\s*est.+/gi, '')
}

export function pod(content) {
    return getPODStr(
        content,
        /port\s+of\s+discharge\s*([^\n]+)/i
    ).replace(/\s*est.+/gi, '');
}

const date_time = /(\d{2}\/\d{2}\/\d{4}(\s+\d{2}:\d[^\n]*)?)/i

export function closing_time(content) {
    const lines = getLines(content, /gate-in\s+at\s+terminal\s*\/\s*depot/i, /shipping\s+instructions\s+cut-off/i);
    for (let line of lines) {
        const parts = line.trim().split(/\s{2,}/);
        if (parts.length >= 2 && /dry/i.test(parts[0])) {
            const dateStr = parts[parts.length - 1];
            const match = dateStr.match(date_time);
            if (match) {
                return new Date(fixDateStr(match[1]));
            }
        }
    }
}

export function si_cut_off(content) {
    const lines = getLines(content, /others\s+date\s*\/\s*time/i, /msc\s+vietnam\s+company\s+limited/i);
    for (let line of lines) {
        const parts = line.trim().split(/\s{2,}/);
        if (parts.length >= 2 && /shipping\s+instructions\s+cut-off/i.test(parts[0])) {
            const dateStr = parts[parts.length - 1];
            const match = dateStr.match(date_time);
            if (match) {
                return new Date(fixDateStr(match[1]));
            }
        }
    }
}

export function etd(content) {
    let dates = matchFirst(
        content,
        /est\.\s*time\s+of\s+arrival\s*\/\s*departure([^\n]+)/i
    );
    dates = [...dates.matchAll(/(\d{2}\/\d{2}\/\d{4}(\s+\d{2}:\d{2}))/gi)].map(item => {    
        let dateStr = fixDateStr(item[1]);
        return new Date(dateStr);
    });
    return new Date(Math.max(...dates));
}

export function eta_origin(content) {
    return getDatePrefix(
        content,
        /est\.\s*time\s+of\s+arrival\s+/i,
        /(\d{2}\/\d{2}\/\d{4}(\s+\d{2}:\d{2}))/i,
        fixDateStr
    );
}

export function eta(content) {
    return eta_origin(content);
}
