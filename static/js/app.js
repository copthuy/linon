import { prepareLayout, hideProgressBar, updateProgressBar, updateLayout, loadItem } from './ui.js';
import { loadBookingContent } from './bookings.js';
import { loadDocContent } from './docs.js';
import { loadNewContent } from './new.js';
import { basename } from './common.js';

document.addEventListener('DOMContentLoaded', async () => {
    prepareLayout();
    if (typeof __files !== 'object' || __files.length < 1) {
        return;
    }
    for (const item of __files.sort((a, b) => a.file_path.localeCompare(b.file_path))) {
        const name = basename(item.file_path);
        if (/^booking/i.test(name)) {
            await loadBookingContent(item);
            updateLayout(item);
        } else if (/^doc/i.test(name)) {
            await loadDocContent(item);
            updateLayout(item);
        } else if (/^new\s+version/i.test(name)) {
            const items = await loadNewContent(item);
            items.forEach(el => {
                updateLayout(el);
            })
        }
        updateProgressBar();
    }
    loadItem();
    hideProgressBar();
});
