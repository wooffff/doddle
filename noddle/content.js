let extensionSettings = {};
let isProcessing = false;

chrome.storage.sync.get([
    'hideWalkMeActive', 
    'hideNoDueActive', 
    'hideNotifPopupActive',
    'hideSubmitNotif',
    'hideYearPrefixActive',
    'autoOpenActive', 
    'backBtnActive',
    'redirectActive', 
    'compactActive', 
    'prioritizeClassesActive',
    'scrollBtnActive',
    'folderBtnActive',
    'fixClassTitleActive',
    'fixTooltipHoverActive',
    'searchKeyboardNavActive'
], (settings) => {
    extensionSettings = settings;

    // observe only after webpage loads
    const observer = new MutationObserver(cleanPage);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    cleanPage();
});

function cleanPage() {
    removeWalkMe(extensionSettings.hideWalkMeActive);
    removeNoDueTab(extensionSettings.hideNoDueActive);
    removeNotifPopup(extensionSettings.hideNotifPopupActive);
    hideSubmitNotification(extensionSettings.hideSubmitNotif);
    removeYearPrefix(extensionSettings.hideYearPrefixActive);
    autoOpenDocuments(extensionSettings.autoOpenActive);
    fixBackButton(extensionSettings.backBtnActive); 
    redirectIgcseToIb(extensionSettings.redirectActive);
    applyCompactMode(extensionSettings.compactActive);
    applyClassPrioritization(extensionSettings.prioritizeClassesActive);
    injectScrollButton(extensionSettings.scrollBtnActive);
    injectFolderButton(extensionSettings.folderBtnActive);
    fixClassTitle(extensionSettings.fixClassTitleActive);
    fixTooltipHover(extensionSettings.fixTooltipHoverActive);
    searchKeyboardNav(extensionSettings.searchKeyboardNavActive)
}

function redirectIgcseToIb(isActive) {
    if (isActive !== false) {
        const igcseUrl = "https://web.toddleapp.com/platform/242745246163763771/courses";
        const ibUrl = "https://web.toddleapp.com/platform/242745246163763772/courses";
        if (window.location.href === igcseUrl || window.location.href === igcseUrl + "/") {
            window.location.replace(ibUrl);
        }
    }
}

function removeWalkMe(isActive) {
    if (isActive !== false) {
        const walkMe = document.getElementById('walkme-player');
        if (walkMe) walkMe.remove();
    }
}

function removeNoDueTab(isActive) {
    if (isActive !== false) {
        const noDueTab = document.querySelector('[data-test-id="consolidatedDeadlinesWidget-tabs-tab-NODUE"]');
        if (noDueTab) noDueTab.remove();
    }
}

function removeNotifPopup(isActive) {
    if (isActive !== false) {
        const notifPopup = document.querySelector('[id^="walkme-visual-design"]');
        if (notifPopup) notifPopup.remove(); 
    }
}

function autoOpenDocuments(isActive) {
    if (isActive !== false && !isProcessing) {
        const openInNewTabBtn = document.querySelector('[data-test-id="classFlow-theatreMode-openInNewTab-button"]');
        const iframe = document.querySelector('iframe[src*="toddleapp.com/viewer"], iframe[src*="google.com"]:not([src*="docs.google.com/picker"])');
        
        if (openInNewTabBtn || (iframe && iframe.src && iframe.src !== 'about:blank')) {
            isProcessing = true;

            // open in new tab
            if (openInNewTabBtn) {
                openInNewTabBtn.click();
            } else if (iframe) {
                window.open(iframe.src, '_blank');
            }

            // close the viewer
            setTimeout(() => {
                const allButtons = document.querySelectorAll('.UIButton__button___c_Dxi');
                const saveExitBtn = Array.from(allButtons).find(btn => 
                    btn.textContent.includes('Save & Exit')
                );

                if (saveExitBtn) {
                    saveExitBtn.click();
                } else {
                    const closeBtn = document.querySelector('[data-test-id*="theatremode-close-button"]');
                    if (closeBtn) closeBtn.click();
                }

                setTimeout(() => { 
                    isProcessing = false; 
                }, 1000);
            }, 500);
        }
    }
}

function injectScrollButton(isActive) {
    const existingBtn = document.getElementById('custom-scroll-to-bottom-btn');
    
    if (!isActive) {
        if (existingBtn) {
            existingBtn.parentElement.remove(); 
        }
        return; 
    }
    if (existingBtn) return;

    // Target the new search input using its data-test-id
    const searchInput = document.querySelector('[data-test-id="learningCourse-filterHeader-search-input"]');
    if (!searchInput) return; 
    
    // Find the outer container using .closest()
    const targetWrapper = searchInput.closest('.FilterHeader__searchInputContainer___Tw9TD') || searchInput.parentElement.parentElement;
    
    const btnDiv = document.createElement('div');
    const scrollBtn = document.createElement('button');
    
    scrollBtn.id = 'custom-scroll-to-bottom-btn'; 

    btnDiv.style.marginRight = 'auto'; 
    btnDiv.style.marginLeft = '16px'; 
    btnDiv.style.display = 'flex';
    btnDiv.style.alignItems = 'center';

    scrollBtn.textContent = 'Scroll to Bottom'; 
    scrollBtn.style.padding = '0 16px';
    scrollBtn.style.height = '36px'; 
    scrollBtn.style.minWidth = 'max-content'; 
    scrollBtn.style.flexShrink = '0'; 
    scrollBtn.style.border = '1px solid #dcdcdc';
    scrollBtn.style.borderRadius = '6px';
    scrollBtn.style.background = '#fff';
    scrollBtn.style.color = '#333';
    scrollBtn.style.cursor = 'pointer';
    scrollBtn.style.fontWeight = '500';
    scrollBtn.style.whiteSpace = 'nowrap';
    
    scrollBtn.style.transition = 'background 0.2s';
    scrollBtn.onmouseover = () => scrollBtn.style.background = '#f5f5f5';
    scrollBtn.onmouseout = () => scrollBtn.style.background = '#fff';

    scrollBtn.onclick = () => {
        const virtuosoScroller = document.querySelector('[data-virtuoso-scroller="true"]');
        
        if (!virtuosoScroller) {
            console.error("Scroll box hunt failed. Page structure is likely inside an iframe or not loaded yet.");
            return;
        }

        let scrollTarget = virtuosoScroller;
        let isWindowScroll = true;

        while (scrollTarget && scrollTarget !== document.body) {
            const style = window.getComputedStyle(scrollTarget);
            const overflowY = style.getPropertyValue('overflow-y');
            
            if (overflowY === 'auto' || overflowY === 'scroll') {
                isWindowScroll = false;
                break;
            }
            scrollTarget = scrollTarget.parentElement;
        }

        if (isWindowScroll) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            scrollTarget.scrollTo({
                top: scrollTarget.scrollHeight, 
                behavior: 'smooth'
            });
        }
    };

    btnDiv.appendChild(scrollBtn);
    
    targetWrapper.parentNode.insertBefore(btnDiv, targetWrapper);
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
            .ButtonCard__iconContainer___Cz4Fx { width: 32px !important; min-width: 32px !important; display: flex !important; justify-content: center !important; align-items: center !important; }
            .ButtonCard__iconContainer___Cz3Fx svg { width: 24px !important; height: 24px !important; }
            .ButtonCard__subLabel___237QL { display: none !important; }
            .MyClassList__courseCardsCon___hgzZp { grid-template-columns: repeat(3, 1fr) !important; margin-top: 16px !important; }
            .GroupedProjectGroupList__groupedContainer___F_cps { grid-gap: 12px; !important; }
            .CourseList__courseItemContainer___k7Ylq { margin-bottom: 8px !important; height: 40px !important; }
        `;
        document.head.appendChild(styleTag);
    }
}

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

function injectFolderButton(isActive) {
    if (!isActive) {
        const existingBtn = document.getElementById('custom-folder-toggle-btn');
        if (existingBtn) existingBtn.remove();
        return;
    }

    if (document.getElementById('custom-folder-toggle-btn')) return;

    const statusBtn = document.querySelector('[data-test-id="classFlow-filterHeader-studentStatus-button"]');
    if (!statusBtn) return; 
    const statusWrapper = statusBtn.parentElement.parentElement;
    
    const folderBtn = document.createElement('button');
    folderBtn.id = 'custom-folder-toggle-btn';
    
    folderBtn.style.padding = '0 10px';
    folderBtn.style.height = '36px'; 
    folderBtn.style.flexShrink = '0'; 
    folderBtn.style.border = '1px solid #dcdcdc';
    folderBtn.style.borderRadius = '6px';
    folderBtn.style.background = '#fff';
    folderBtn.style.color = '#333';
    folderBtn.style.cursor = 'pointer';
    folderBtn.style.display = 'flex';
    folderBtn.style.alignItems = 'center';
    folderBtn.style.justifyContent = 'center';
    folderBtn.style.transition = 'background 0.2s';
    folderBtn.onmouseover = () => folderBtn.style.background = '#f5f5f5';
    folderBtn.onmouseout = () => folderBtn.style.background = '#fff';

    const svgFolderOpen = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3a3a3a"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>`;
    const svgFolderClosed = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3a3a3a"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z"/></svg>`;

    let isShowingOpenIcon = true;
    folderBtn.innerHTML = svgFolderOpen;

    folderBtn.onclick = async () => {
        const targetAction = isShowingOpenIcon ? 'open' : 'close';
        
        isShowingOpenIcon = !isShowingOpenIcon;
        folderBtn.innerHTML = isShowingOpenIcon ? svgFolderClosed : svgFolderOpen;

        const allFolderButtons = document.querySelectorAll('[data-test-id*="-accordionToggle-button"]');
        
        for (let i = 0; i < allFolderButtons.length; i++) {
            const btnId = allFolderButtons[i].getAttribute('data-test-id');
            const freshBtn = document.querySelector(`[data-test-id="${btnId}"]`);
            
            if (freshBtn) {
                const isClosed = freshBtn.className.includes('AccordionItem__toggleButtonCollapsed');
                const isOpen = !isClosed;

                if ((targetAction === 'open' && isClosed) || (targetAction === 'close' && isOpen)) {
                    freshBtn.click();
                    await new Promise(resolve => setTimeout(resolve, 0)); 
                }
            }
        }
    };

    const allButtons = Array.from(document.querySelectorAll('button'));
    const scrollBtnNode = allButtons.find(btn => btn.textContent.includes('Scroll'));

    if (scrollBtnNode) {
        scrollBtnNode.parentNode.insertBefore(folderBtn, scrollBtnNode.nextSibling);
        folderBtn.style.marginLeft = '8px'; 
        folderBtn.style.marginRight = '16px'; 
    } else {
        statusWrapper.parentNode.insertBefore(folderBtn, statusWrapper);
        folderBtn.style.marginRight = '16px'; 
    }
}

function fixBackButton(isActive) {
    if (isActive === false) return;

    const backButton = document.querySelector('button[aria-label="go back"]');
    
    if (backButton && !backButton.dataset.fixed) {
        backButton.dataset.fixed = "true";

        backButton.addEventListener('click', function(e) {
            
            // check if user came from toddle or url
            if (!document.referrer.includes(window.location.host)) {
                const currentUrl = window.location.href;
            
                // regex to find the course url
                const courseMatch = currentUrl.match(/(.*\/courses\/\d+)/);
                
                if (courseMatch) {
                    e.preventDefault();
                    e.stopPropagation(); // stops Toddle's broken router from firing
                    
                    const fallbackUrl = courseMatch[1] + '/class-flow'; 
                    window.location.href = fallbackUrl; 
                }
            }
        }, true);
    }
}

function hideSubmitNotification(isActive) {
    if (isActive === true) {
        const allButtons = document.querySelectorAll('button');
        const leaveBtn = Array.from(allButtons).find(btn => 
            btn.textContent.trim() === 'Leave without marking'
        );

        if (leaveBtn && !leaveBtn.dataset.autoClicked) {
            leaveBtn.dataset.autoClicked = "true";
            leaveBtn.click();
        }
    }
}

function removeYearPrefix(isActive) {
    if (isActive === false) return;

    const selectors = [
        '.ClassCardV2__labelV2___B2ZiG',
        '.SideBar__courseSwitcherNameText___GlxPD',
        '.CourseList__courseTitle___acdCw'
    ].join(', ');

    const classTitles = document.querySelectorAll(selectors);
    
    for (let i = 0; i < classTitles.length; i++) {
        const el = classTitles[i];
        
        if (el.textContent && el.textContent.includes('Year 13 - ')) {
            el.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('Year 13 - ')) {
                    node.nodeValue = node.nodeValue.replace('Year 13 - ', '');
                }
            });
        }
    }
}

function fixClassTitle(isActive) {
    if (isActive === false) return;

    // Regex matches numbers 7-13, immediately followed by N, E, D, F, W, or R (case-insensitive)
    const regexPattern = /^(7|8|9|10|11|12|13)[NEDFWR]$/i;

    const targets = [
        {
            selector: '.CourseList__courseInfoSubText___trizA',
            newClass: 'CourseList__courseTitle___acdCw CourseList__courseTitleWithoutPin___HTgbF'
        },
        {
            selector: '.SideBar__courseInfoSubText___WHk05',
            newClass: 'SideBar__courseSwitcherNameText___GlxPD'
        }
    ];

    targets.forEach(({ selector, newClass }) => {
        const elements = document.querySelectorAll(selector);

        elements.forEach(el => {
            const text = el.textContent ? el.textContent.trim() : '';

            // Check if it's "Higher Education" OR matches the homeroom/class regex pattern
            if (text.includes('Higher Education') || regexPattern.test(text)) {
                el.className = newClass;

                if (regexPattern.test(text)) {
                    el.textContent = text.toUpperCase();
                }
            }
        });
    });
}

function fixTooltipHover(isActive) {
    if (isActive === false) return; 
    let styleTag = document.getElementById('toddle-tooltip-fix-styles');
    
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'toddle-tooltip-fix-styles';
        styleTag.innerHTML = `
            .rc-tooltip, 
            .rc-tooltip * { 
                pointer-events: none !important; 
            }
        `;
        document.body.appendChild(styleTag);
    }
}

let searchNavInitialized = false;
let currentSearchFocus = -1;

function searchKeyboardNav(isActive) {
    if (isActive === false) return;
    
    // Prevent attaching multiple listeners if React re-renders the page
    if (searchNavInitialized) return; 
    searchNavInitialized = true;

    const style = document.createElement('style');
    style.id = 'toddle-search-nav-styles';
    style.innerHTML = `
        .toddle-search-active {
            background-color: rgba(0, 0, 0, 0.08) !important;
            border-radius: 8px; 
            outline: 2px solid #b0b0b0; /* Adds a visual focus ring */
        }
    `;
    document.body.appendChild(style);

    document.addEventListener('keydown', function(e) {
        const searchInput = document.querySelector('.CourseList__searchIputBox___XJGG9');
        const items = document.querySelectorAll('.CourseList__courseItemContainer___k7Ylq');
        
        // Only run if the search box actually exists on the screen
        if (!searchInput || !items.length) return;
        
        const isSearchFocused = document.activeElement === searchInput;
        const isNavigating = currentSearchFocus > -1;

        // Only hijack the keys if we are actively using the search bar
        if (!isSearchFocused && !isNavigating) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault(); // Stop the whole page from scrolling
            currentSearchFocus++;
            updateActiveSearchItem(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault(); // Stop the whole page from scrolling
            currentSearchFocus--;
            updateActiveSearchItem(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentSearchFocus > -1 && items[currentSearchFocus]) {
                items[currentSearchFocus].click(); // Click the highlighted item
            } else if (items[0]) {
                items[0].click(); // Default to clicking the first item if none are highlighted
            }
        }
    });

    // 3. Reset the selection highlight whenever you type a new letter
    document.addEventListener('input', function(e) {
        if (e.target && e.target.classList.contains('CourseList__searchIputBox___XJGG9')) {
            currentSearchFocus = -1; // Reset focus to top
            const items = document.querySelectorAll('.CourseList__courseItemContainer___k7Ylq');
            removeActiveSearchItems(items);
        }
    });
}

function updateActiveSearchItem(items) {
    removeActiveSearchItems(items);
    
    // Wrap around logic (e.g., hitting Up on the first item takes you to the bottom)
    if (currentSearchFocus >= items.length) currentSearchFocus = 0; 
    if (currentSearchFocus < 0) currentSearchFocus = (items.length - 1); 

    // Add highlight class
    items[currentSearchFocus].classList.add('toddle-search-active');
    
    // Automatically scroll the sidebar so the highlighted item stays in view
    items[currentSearchFocus].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function removeActiveSearchItems(items) {
    items.forEach(item => item.classList.remove('toddle-search-active'));
}