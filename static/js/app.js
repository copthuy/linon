import { prepareLayout, hideProgressBar, updateProgressBar, updateLayout, loadItem } from './ui.js';
import { loadBookingContent } from './bookings.js';
import { loadDocContent } from './docs.js';
import { loadNewContent } from './new.js';
import { basename } from './common.js';
window.__files = [];

function prepareData() {
    document.querySelectorAll('pre').forEach(pre => {
        window.__files.push({
            file_path: pre.getAttribute('data-file'),
            file_content: pre.textContent
        });
        pre.parentNode.removeChild(pre);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    prepareData();
    prepareLayout();
    if (typeof __files !== 'object' || __files.length < 1) {
        return;
    }
    const arr = ( __files.length 
        ? __files 
        : [__files]
    ).sort((a, b) => 
        a.file_path.localeCompare(b.file_path)
    );
    
    for (const item of arr) {
        if (
            typeof item.file_path === 'undefined' || 
            typeof item.file_content === 'undefined'
        ) {
            continue
        }

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
