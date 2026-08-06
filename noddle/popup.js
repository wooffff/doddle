const hideWalkMe = document.getElementById('toggleWalkMe');
const hideNoDueCheck = document.getElementById('toggleHideNoDue');
const hideNotifPopup = document.getElementById('toggleUnreadNotifications');
const submitNotifCheck = document.getElementById('toggleSubmitNotif');
const yearPrefixCheck = document.getElementById('toggleYearPrefix');
const autoOpenCheck = document.getElementById('toggleAutoOpen');
const backBtnCheck = document.getElementById('toggleBackButton');
const redirectCheck = document.getElementById('toggleRedirect');
const compactCheck = document.getElementById('toggleCompact');
const priorityCheck = document.getElementById('togglePriority');
const scrollBtnCheck = document.getElementById('toggleScrollBtn');
const folderBtnCheck = document.getElementById('toggleFolderBtn');
const fixClassTitleCheck = document.getElementById('toggleFixClassTitle');
const tooltipFixCheck = document.getElementById('toggleTooltipFix');
const searchNavCheck = document.getElementById('toggleSearchNav');

const updateNotice = document.getElementById('updateNotice');
const remoteVersionSpan = document.getElementById('remoteVersion');

const defaultSettings = {
    hideWalkMeActive: true,
    hideNoDueActive: true,
    hideNotifPopupActive: true,
    hideSubmitNotif: true,
    hideYearPrefixActive: true,
    autoOpenActive: true,
    backBtnActive: true,
    redirectActive: true,
    compactActive: true,
    prioritizeClassesActive: true,
    scrollBtnActive: true,
    folderBtnActive: true,
    fixClassTitleActive: true,
    fixTooltipHoverActive: true,
    searchKeyboardNavActive: true
};

// by passing defaultSettings into .get(), Chrome will automatically use 
// these fallbacks if the user's storage is empty on a fresh install.
chrome.storage.sync.get(defaultSettings, (res) => {
    hideWalkMe.checked = res.hideWalkMeActive;
    hideNoDueCheck.checked = res.hideNoDueActive;
    hideNotifPopup.checked = res.hideNotifPopupActive;
    submitNotifCheck.checked = res.hideSubmitNotif;
    yearPrefixCheck.checked = res.hideYearPrefixActive;
    autoOpenCheck.checked = res.autoOpenActive;
    backBtnCheck.checked = res.backBtnActive;
    redirectCheck.checked = res.redirectActive;
    scrollBtnCheck.checked = res.scrollBtnActive;
    compactCheck.checked = res.compactActive;
    priorityCheck.checked = res.prioritizeClassesActive;
    folderBtnCheck.checked = res.folderBtnActive;
    fixClassTitleCheck.checked = res.fixClassTitleActive;
    tooltipFixCheck.checked = res.fixTooltipHoverActive;
    searchNavCheck.checked = res.searchKeyboardNavActive;

    // save default settings immediately upon load.
    chrome.storage.sync.set(res);
});

// save settings on change
hideWalkMe.addEventListener('change', () => chrome.storage.sync.set({ hideWalkMeActive: hideWalkMe.checked }));
hideNoDueCheck.addEventListener('change', () => chrome.storage.sync.set({ hideNoDueActive: hideNoDueCheck.checked }));
hideNotifPopup.addEventListener('change', () => chrome.storage.sync.set({ hideNotifPopupActive: hideNotifPopup.checked }));
submitNotifCheck.addEventListener('change', () => chrome.storage.sync.set({ hideSubmitNotif: submitNotifCheck.checked }));
yearPrefixCheck.addEventListener('change', () => chrome.storage.sync.set({ hideYearPrefixActive: yearPrefixCheck.checked }));
autoOpenCheck.addEventListener('change', () => chrome.storage.sync.set({ autoOpenActive: autoOpenCheck.checked }));
backBtnCheck.addEventListener('change', () => chrome.storage.sync.set({ backBtnActive: backBtnCheck.checked }));
redirectCheck.addEventListener('change', () => chrome.storage.sync.set({ redirectActive: redirectCheck.checked }));
scrollBtnCheck.addEventListener('change', () => chrome.storage.sync.set({ scrollBtnActive: scrollBtnCheck.checked }));
compactCheck.addEventListener('change', () => chrome.storage.sync.set({ compactActive: compactCheck.checked }));
priorityCheck.addEventListener('change', () => chrome.storage.sync.set({ prioritizeClassesActive: priorityCheck.checked }));
folderBtnCheck.addEventListener('change', () => chrome.storage.sync.set({ folderBtnActive: folderBtnCheck.checked }));
fixClassTitleCheck.addEventListener('change', () => chrome.storage.sync.set({ fixClassTitleActive: fixClassTitleCheck.checked }));
tooltipFixCheck.addEventListener('change', () => chrome.storage.sync.set({ fixTooltipHoverActive: tooltipFixCheck.checked }));
searchNavCheck.addEventListener('change', () => chrome.storage.sync.set({ searchKeyboardNavActive: searchNavCheck.checked }));

// checks for updates
const REPO_URL = "https://raw.githubusercontent.com/wooffff/noddle/master/noddle/manifest.json";

async function checkVersion() {
  try {
    const response = await fetch(REPO_URL);
    if (!response.ok) return; // exit if 404
    const data = await response.json();
    const remoteVersion = data.version;
    const localVersion = chrome.runtime.getManifest().version;

    if (remoteVersion.localeCompare(localVersion, undefined, { numeric: true }) > 0) {
      updateNotice.style.display = 'block';
      remoteVersionSpan.textContent = remoteVersion;
    }
  } catch (e) {
    console.log("Update check failed.");
  }
}

checkVersion();

const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');

function setAllCheckboxes(state) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = state;
        checkbox.dispatchEvent(new Event('change'));
    });
}

if (selectAllBtn) selectAllBtn.addEventListener('click', () => setAllCheckboxes(true));
if (deselectAllBtn) deselectAllBtn.addEventListener('click', () => setAllCheckboxes(false));