export function importModules(modules, path, list) {
    for (const key in list) {
        const modulePath = `./${path}/${key}.js`;
        import(modulePath)
            .then((module) => {
                modules[key] = module;
                //console.log(`Imported ${key} from ${modulePath}`);
            })
            .catch((error) => {
                console.error(`Failed to import ${key} from ${modulePath}:`, error);
            });
    }
}

export async function applyFunc(module, functionName, ...args) {
    if (module && typeof module[functionName] === 'function') {
        return await module[functionName].apply(null, args);
    } else {
        console.error(`Unknown value or function name "${value}" - "${functionName}"`);
        return '';
    }
}

export function isValidDateString(str) {
    const date = new Date(str);
    const thisYear = date.getFullYear();
    if (typeof str !== 'string' || str.trim().length < 5) {
        return false;
    }
    if (!/^[a-z\.,-\/\d\s:]+$/i.test(str)) {
        return false;
    }
    for (const match of [...str.matchAll(/\d+/g)]) {
        if (![1, 2, 4].includes(Number(match).toString().length)) {
            return false;
        }
        if ((match > thisYear + 1) || (match > 2010 && match < thisYear - 2)) {
            return false;
        }
    }
    for (const match of [...str.matchAll(/[a-z]+/gi)]) {
        if (!/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(match)) {
            return false;
        }
    }
    return !isNaN(date.getTime()) && 
        date.toString() !== 'Invalid Date';
}

export function formatDate(date, format) {
    if (date.toString().toLowerCase() === 'invalid date') {
        return '';
    }
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const weekOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 1)) / 604800000);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const shortYear = String(year).slice(-2);
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const unixEpoch = Math.floor(date.getTime() / 1000);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Map placeholders to their corresponding values
    const replacements = {
        'd': String(day).padStart(2, '0'),
        'dd': String(day).padStart(2, '0'), // Added support for dd
        'D': shortDayNames[dayOfWeek],
        'l': dayNames[dayOfWeek],
        'j': day,
        'J': day + (day === 1 || day === 21 || day === 31 ? 'st' : (day === 2 || day === 22 ? 'nd' : (day === 3 || day === 23 ? 'rd' : 'th'))),
        'w': dayOfWeek,
        'W': weekOfYear,
        'F': monthNames[month - 1],
        'm': String(month).padStart(2, '0'),
        'mm': String(month).padStart(2, '0'), // Added support for mm
        'n': month,
        'M': shortMonthNames[month - 1],
        'mmm': shortMonthNames[month - 1], // Added support for mmm
        'U': unixEpoch,
        'y': shortYear,
        'yy': shortYear, // Added support for yy
        'Y': year,
        'yyyy': year, // Added support for yyyy
        'Z': date.toISOString(),
        'H': String(hours24).padStart(2, '0'),
        'h': String(hours12).padStart(2, '0'),
        'G': hours12,
        'i': String(minutes).padStart(2, '0'),
        'S': String(seconds).padStart(2, '0'),
        's': seconds,
        'K': hours24 < 12 ? 'AM' : 'PM',
        'hh': String(hours12).padStart(2, '0'), // Added support for hh
        'mm': String(minutes).padStart(2, '0'), // Added support for mm
        'ss': String(seconds).padStart(2, '0') // Added support for ss
    };

    // Replace all placeholders in the format string with their corresponding values
    return format.replace(/dd|d{1,2}|D|l|j|J|w|W|F|mm|m{1,3}|M|U|yy|y|yyyy|Y|Z|H|hh|h|G|i|mm|s{1,2}|S|K/g, match => replacements[match]);
}

export function getISO(content, patterns) {
    for (const [iso, pattern] of Object.entries(patterns)) {
        if (pattern.test(content)) {
            return iso;
        }
    }
    return '';
}

export function ISOtoString(regex) {
    return regex
        .toString()
        .replace(/_|\\s\+/g, ' ')
        .replace(/\/i?/g, '')
        .replace(/\\/g, '')
        .toLocaleUpperCase();
}

export function getLines(content, start_pattern, end_pattern) {
    const lines = content.replace(/\r/g, "\n").split("\n");
    const startRegex = new RegExp(start_pattern);
    const endRegex = new RegExp(end_pattern);

    let result = [];
    let collecting = false;

    for (const line of lines) {
        if (startRegex.test(line)) {
            collecting = true;
        }

        if (collecting) {
            if (endRegex.test(line)) {
                collecting = false;
                break;
            } else if (line.trim() !== '') {
                result.push(line);
            }
        }
    }

    return result;
}

export function getFmtStr(key, value) {
    if (/booking_date|closing_time|si_cut_off|etd|eta/i.test(key) && typeof value.getDate !== 'undefined') {
        return /booking_date|etd|eta/i.test(key) ? 'd-M-Y' : 'H:i d-M';
    }
    return '';
}

export function formatValue(key, value) {
    const fmtStr = getFmtStr(key, value);
    if (typeof value === 'undefined') {
        return;
    } else if (fmtStr !== '') {
        return formatDate(value, fmtStr);
    } else if (key === 'total' && !isNaN(value)) {
        return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (typeof value === 'object' && typeof value.join !== 'undefined') {
        return value.join(';');
    }
    return value;
}

export function fixstr(str) {
    if (!str) {
        return '';
    }
    return str
        .trim()
        .replace(/\s*\/\s*/g, '/')
        .replace(/\s{2,}/g, ' ');
}

export function matchFirst(content, regex) {
    const match = content.match(regex);
    return match ? fixstr(match[1]) : '';
}

export function basename(path) {
    return path.split(/\\|\//).reverse()[0];
}

export function getInvoiceDoc(content) {
    const lines = getLines(
        content, 
        /commercial\s+invoice/i, 
        'this is not a real ending of any doc file!'
    );

    return lines.
        join("\n").
        replace(/\r/g, "\n").
        replace(/commercial\s+invoice[\s\n]+/i, " ").
        replace(/\s+\(\s*1\s*\)/i, "(1)").
        replace(/\s+no\s+\&\s+date\s+of\s+invoice/i, 'No & Date of Invoice');
}

export function getPONumbers(content) {
    return [...content.matchAll(/\b\d{5}(?=\b|_)/g)].map(item => item[0]);
}

export function getVesselStr(content, regex) {
    let res = matchFirst(content, regex);
    res = res.replace(/\s+latest.+/i, '');
    res = res.replace(/\s+etd.+/i, '');
    res = res.replace(/\s+d\s+kin\s+ng.+/i, '');

    return fixstr(res);
}

export function fixPODStr(value) {
    let res = value.replace(/\s*(\/|\(|,|eta|si\s+cut-off|terminal).+/i, '');
    res = res.toUpperCase();
    res = fixstr(res);
    return res;
}

export function getPODStr(content, regex) {
    let res = matchFirst(content, regex);
    return fixPODStr(res);
}

export function strToDate(dateStr) {
    if (!isValidDateString(dateStr)) {
        return;
    }
    const date = new Date(dateStr);
    const currentYear = new Date().getFullYear();

    if (date.getFullYear() < currentYear) {
        date.setFullYear(currentYear);
    }

    return date;
}

export function getDatePrefix(content, prefix, date_time, callFix) {
    const regex = new RegExp(prefix.source + date_time.source, 'i');
    let dateStr = matchFirst(content, regex);
    if (!dateStr) {
        return '';
    }
    dateStr = dateStr.replace(/st|nd|rd|th|of/g, '');
    if (typeof callFix != 'undefined') {
        dateStr = callFix.call(this, dateStr);
    }
    return strToDate(dateStr);
}

export function getBookingET(content, prefix, date_time, compare = 'min', callFix) {
    const regex = new RegExp(prefix.source + date_time.source, 'gi');
    const dates = [...content.matchAll(regex)].map(item => {
        let dateStr = fixstr(item[1]);
        if (callFix) {
            dateStr = callFix.call(this, dateStr);
        }
        return new Date(dateStr);
    });
    return new Date(Math[compare](...dates));
}

export function getPreviousDay(etd, targetDay) {
    const etdDate = new Date(etd);
    const dayMap = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };

    // Get the target day number and validate it
    const targetDayNumber = dayMap[targetDay.toUpperCase()];
    if (targetDayNumber === undefined) throw new Error("Invalid target day");

    // Calculate the difference in days to the previous target day
    const diff = (etdDate.getDay() - targetDayNumber + 7) % 7;
    etdDate.setDate(etdDate.getDate() - diff);

    return etdDate;
}

export function getPreviousDate(etd, targetDateTime) {
    // Destructure the targetDateTime array into hours, minutes, and day
    const [targetHours, targetMinutes, targetDay] = targetDateTime;

    // Call getPreviousDay to get the previous target day
    const etdDate = getPreviousDay(etd, targetDay);

    // Convert target hours and minutes to numbers
    const hours = Number(targetHours);
    const minutes = Number(targetMinutes);
    if (isNaN(hours) || isNaN(minutes)) throw new Error("Invalid time format");

    // Set the time part to the target time
    etdDate.setHours(hours, minutes, 0, 0);

    return etdDate;
}

export function addExtraDate(etaDate, podStr) {
    let extra = 0;
    const norfolkPattern = /norfolk/i;
    const losLongPattern = /los|long/i;

    if (norfolkPattern.test(podStr)) {
        extra = 7;
    } else if (losLongPattern.test(podStr)) {
        extra = 5;
    }

    return new Date(etaDate.setDate(etaDate.getDate() + extra));
}
