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

chrome.storage.sync.get([
    'walkMeActive', 
    'autoOpenActive', 
    'aliasActive', 
    'redirectActive', 
    'hideNoDueActive', 
    'compactActive', 
    'prioritizeClassesActive'
], (settings) => {
    extensionSettings = settings;

    // observe only after webpage loads
    const observer = new MutationObserver(cleanPage);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    cleanPage();
});

// visual filter for search mod
function applyVisualFilter(query) {
    const courses = document.querySelectorAll('.CourseList__courseItemContainer___k7Ylq');
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
        courses.forEach(card => card.style.setProperty('display', 'flex', 'important'));
        return;
    }
    let matchedCodes = [];
    for (const [fullName, codes] of Object.entries(subjectAliases)) {
        if (fullName.startsWith(searchTerm)) {
            matchedCodes.push(...codes.map(c => c.toLowerCase()));
        }
    }
    courses.forEach(card => {
        const title = card.querySelector('.CourseList__courseTitle___acdCw')?.innerText.toLowerCase() || '';
        const isMatch = matchedCodes.some(code => title.includes(code)) || title.includes(searchTerm);
        if (isMatch) {
            card.style.setProperty('display', 'flex', 'important');
        } else {
            card.style.setProperty('display', 'none', 'important');
        }
    });
}

    function cleanPage() {
        applyCompactMode(extensionSettings.compactActive);
        applyClassPrioritization(extensionSettings.prioritizeClassesActive);

    //redirect user from igcse to ib
    if (extensionSettings.redirectActive !== false) {
        const igcseUrl = "https://web.toddleapp.com/platform/242745246163763771/courses";
        const ibUrl = "https://web.toddleapp.com/platform/242745246163763772/courses";
        if (window.location.href === igcseUrl || window.location.href === igcseUrl + "/") {
            window.location.replace(ibUrl);
            return; 
        }
    }

    // remove esf walk me button
    if (extensionSettings.walkMeActive !== false) {
        const walkMe = document.getElementById('walkme-player');
        if (walkMe) walkMe.remove();
    }

    // remove no due date assignments tab
    if (extensionSettings.hideNoDueActive !== false) {
        const noDueTab = document.querySelector('[data-test-id="consolidatedDeadlinesWidget-tabs-tab-NODUE"]');
        if (noDueTab) noDueTab.style.setProperty('display', 'none', 'important');
    }

    // open documents in new tabs
    if (extensionSettings.autoOpenActive !== false && !isProcessing) {
        const openInNewTabBtn = document.querySelector('[data-test-id="classFlow-theatreMode-openInNewTab-button"]');
        const iframe = document.querySelector('iframe[src*="toddleapp.com/viewer"], iframe[src*="google.com"]');

        if (openInNewTabBtn || (iframe && iframe.src && iframe.src !== 'about:blank')) {
            isProcessing = true;

            if (openInNewTabBtn) {
                // cick open in the new tab link button
                openInNewTabBtn.click();
            } else if (iframe) {
                // open iframe.src in new tab
                window.open(iframe.src, '_blank');
            }

            const closeBtn = document.querySelector('[data-test-id*="theatremode-close-button"]');
            if (closeBtn) {
                closeBtn.click();
            }

            setTimeout(() => { 
                isProcessing = false; 
            }, 500);
        }
    }

    // apply search mod
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
            }
        }
    }
}

function applyCompactMode(isActive) {
    let styleTag = document.getElementById('toddle-compact-mode-styles');
    if (!isActive) { if (styleTag) styleTag.remove(); return; }
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'toddle-compact-mode-styles';
        styleTag.innerHTML = `
            .StudentCourses__announcementButtonContainer___GbzI4 { gap: 10px !important; }
            .ButtonCard__containerV2____83qk { height: 50px !important; min-height: 50px !important; }
            .ButtonCard__rightContainerV2___LW1YB { padding: 0px 12px !important; display: flex !important; align-items: center !important; }
            .ButtonCard__iconContainer___Cz3Fx { width: 32px !important; min-width: 32px !important; display: flex !important; justify-content: center !important; align-items: center !important; }
            .ButtonCard__iconContainer___Cz3Fx svg { width: 24px !important; height: 24px !important; }
            .ButtonCard__subLabel___237QL { display: none !important; }
            .MyClassList__courseCardsCon___hgzZp { grid-template-columns: repeat(3, 1fr) !important; margin-top: 16px !important; }
            .CourseList__courseItemContainer___k7Ylq { margin-bottom: 8px !important; }
            .GroupedProjectGroupList__groupedContainer___F_cps { grid-gap: 12px; !important; }
            .CourseList__courseItemContainer___k7Ylq {height: auto; !important; }
        `;
        document.head.appendChild(styleTag);
    }
}

// move classes up to the top in the homepage
function applyClassPrioritization(isActive) {
    let styleTag = document.getElementById('toddle-priority-styles');
    if (!isActive) { if (styleTag) styleTag.remove(); return; }
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'toddle-priority-styles';
        styleTag.innerHTML = `
            .StudentCourses__leftInnerContainer___lETNg { display: flex !important; flex-direction: column !important; padding: 0px !important; }
            .StudentCourses__classesContainer___KylQ0 { order: 1 !important; margin-bottom: 24px !important; }
            .StudentCourses__announcementButtonContainer___GbzI4 { order: 2 !important; }
            .MyClassList__container___AwDcQ { padding-top: 0px !important; }
            .GroupedProjectGroupList__container___AhHuD {order: 3 !important; }
        `;
        document.head.appendChild(styleTag);
    }
}