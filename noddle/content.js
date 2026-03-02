// 1. Update your aliases to use arrays
const subjectAliases = {
    'chemistry': ['CH'],
    'math': ['MA', 'MI'],
    'computer science': ['CP'],
    'psychology': ['PS'],
    'philosophy': ['PP'],
    'english': ['EU'],
    'tok': ['TK'],
    'chinese': ['CY'],
    'french': ['FR'],
    'japanese': ['JA'],
    'history': ['HI'],
    'biology': ['BI'],
    'physics': ['PH'],
    'spanish': ['SA'],
    'economics': ['EC'],
    'dt': ['TE'],
    // buisness
    // ess
    // sports science
    // geography
    // visual art
    // theatre
    // music
    // global politics
    
    // Houses
    'nansen': ['N'],
    'wilberforce': ['W'],
    'rutherford': ['R'],
    'einstein': ['E'],
    'da vinci': ['D'],
    'fleming': ['F'],
};

let extensionSettings = {};
let isProcessing = false;

// fetch settings
chrome.storage.sync.get(['walkMeActive', 'autoOpenActive', 'aliasActive', 'redirectActive', 'hideNoDueActive'], (settings) => {
    extensionSettings = settings;
    
    // start observer after page load
    const observer = new MutationObserver(cleanPage);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    
    cleanPage();
});

// listen for changes when user opens popup.js
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        for (let [key, { newValue }] of Object.entries(changes)) {
            extensionSettings[key] = newValue;
        }
    }
});

function applyVisualFilter(query) {
    const courses = document.querySelectorAll('.CourseList__courseItemContainer___k7Ylq');
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
        courses.forEach(card => card.style.setProperty('display', 'flex', 'important'));
        return;
    }

    let matchedCodes = [];
    
    // 2. Adjust the loop to handle the arrays
    for (const [fullName, codes] of Object.entries(subjectAliases)) {
        if (fullName.startsWith(searchTerm)) {
            // Push all codes in the array to our matchedCodes list
            matchedCodes.push(...codes.map(c => c.toLowerCase()));
        }
    }

    courses.forEach(card => {
        const title = card.querySelector('.CourseList__courseTitle___acdCw')?.innerText.toLowerCase() || '';
        
        // Check if the title includes any of the matched codes OR the literal search term
        const isMatch = matchedCodes.some(code => title.includes(code)) || title.includes(searchTerm);

        if (isMatch) {
            card.style.setProperty('display', 'flex', 'important');
        } else {
            card.style.setProperty('display', 'none', 'important');
        }
    });
}

function cleanPage() {
    // redirect from IGCSE to IB
    if (extensionSettings.redirectActive !== false) {
        const igcseUrl = "https://web.toddleapp.com/platform/242745246163763771/courses";
        const ibUrl = "https://web.toddleapp.com/platform/242745246163763772/courses";

        if (window.location.href === igcseUrl || window.location.href === igcseUrl + "/") {
            window.location.replace(ibUrl);
            return; 
        }
    }

    // remove WalkMe button
    if (extensionSettings.walkMeActive !== false) {
        const walkMe = document.getElementById('walkme-player');
        if (walkMe) walkMe.remove();
    }

    // remove "No due date" tab
    if (extensionSettings.hideNoDueActive !== false) {
        const noDueTab = document.querySelector('[data-test-id="consolidatedDeadlinesWidget-tabs-tab-NODUE"]');
        if (noDueTab) {
            noDueTab.style.setProperty('display', 'none', 'important');
        }
    }

    // auto open to new tab
    if (extensionSettings.autoOpenActive !== false && !isProcessing) {
        const iframe = document.querySelector('iframe[src*="google.com"], iframe[src*="toddleapp.com/viewer"]');
        if (iframe && iframe.src) {
            isProcessing = true;
            window.open(iframe.src, '_blank');
            const closeBtn = document.querySelector('[data-test-id*="theatremode-close-button"]');
            if (closeBtn) closeBtn.click();
            setTimeout(() => { isProcessing = false; }, 1000);
        }
    }

    // replace search with our own recreation
    if (extensionSettings.aliasActive !== false) {
        const searchBar = document.querySelector('.CourseList__searchIputBox___XJGG9');
        
        if (searchBar && !searchBar.dataset.hijacked) {
            searchBar.dataset.hijacked = "true";
            const ghostBar = searchBar.cloneNode(true);
            searchBar.style.display = 'none';
            searchBar.parentNode.insertBefore(ghostBar, searchBar.nextSibling);
            const innerInput = ghostBar.tagName.toLowerCase() === 'input' ? ghostBar : ghostBar.querySelector('input');
            
            if (innerInput) {
                innerInput.addEventListener('input', (e) => applyVisualFilter(e.target.value));
                // innerInput.focus(); // this can steal user focus
            }
        }
    }
}