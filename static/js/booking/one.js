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
        /booking\s+date\s*:\s*/i,
        /(\d{2}\s*[a-z]{3}\s*\d{2,})/i
    );
}

export function bill_number(content) {
    return 'ONEY' + booking_number(content);
}

export function vessel(content) {
    return [getVesselStr(
        content,
        /trunk\s+vessel\s*:\s*([^\n]+)/i 
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
        /port\s+of\s+discharging\s*:\s*([^\n]+)/i
    );
}

const date_time = /(\d{2}[a-z]{3}\d{2}(\s+\d{2}:\d{2})?)/i

export function closing_time(content) {
    return getDatePrefix(
        content,
        /port\s+cargo\s+cut-off\s*:\s*/i,
        date_time
    );
}

export function si_cut_off(content) {
    return getDatePrefix(
        content,
        /doc\s+cut-off\s*:\s*/i,
        date_time
    );
}

export function etd(content) {
    return getBookingET(
        content,
        /proforma\s+1st\s+vessel\s+etd\s*:\s*/i,
        date_time,
        'min'
    );
}

export function eta_origin(content) {
    return getBookingET(
        content,
        /pod\s+\/\s+del\s+eta\s*:\s*/i,
        date_time,
        'max'
    );
}

export function eta(content) {
    return addExtraDate(eta_origin(content), pod(content));
}
