const walkMeCheck = document.getElementById('toggleWalkMe');
const autoOpenCheck = document.getElementById('toggleAutoOpen');
const aliasCheck = document.getElementById('toggleAliases');
const redirectCheck = document.getElementById('toggleRedirect');
const hideNoDueCheck = document.getElementById('toggleHideNoDue');
const compactCheck = document.getElementById('toggleCompact');
const priorityCheck = document.getElementById('togglePriority');
const updateNotice = document.getElementById('updateNotice');
const remoteVersionSpan = document.getElementById('remoteVersion');

chrome.storage.sync.get([
  'walkMeActive', 
  'autoOpenActive', 
  'aliasActive', 
  'redirectActive', 
  'hideNoDueActive', 
  'compactActive', 
  'prioritizeClassesActive'
], (res) => {
  walkMeCheck.checked = res.walkMeActive !== false;
  autoOpenCheck.checked = res.autoOpenActive !== false;
  aliasCheck.checked = res.aliasActive !== false;
  redirectCheck.checked = res.redirectActive !== false;
  hideNoDueCheck.checked = res.hideNoDueActive !== false;
  compactCheck.checked = res.compactActive !== false;
  priorityCheck.checked = res.prioritizeClassesActive !== false;
});

walkMeCheck.addEventListener('change', () => chrome.storage.sync.set({ walkMeActive: walkMeCheck.checked }));
autoOpenCheck.addEventListener('change', () => chrome.storage.sync.set({ autoOpenActive: autoOpenCheck.checked }));
aliasCheck.addEventListener('change', () => chrome.storage.sync.set({ aliasActive: aliasCheck.checked }));
redirectCheck.addEventListener('change', () => chrome.storage.sync.set({ redirectActive: redirectCheck.checked }));
hideNoDueCheck.addEventListener('change', () => chrome.storage.sync.set({ hideNoDueActive: hideNoDueCheck.checked }));
compactCheck.addEventListener('change', () => chrome.storage.sync.set({ compactActive: compactCheck.checked }));
priorityCheck.addEventListener('change', () => chrome.storage.sync.set({ prioritizeClassesActive: priorityCheck.checked }));

const REPO_URL = "https://raw.githubusercontent.com/wooffff/noddle/refs/heads/main/noddle/manifest.json";

async function checkVersion() {
  try {
    const response = await fetch(REPO_URL);
    const data = await response.json();
    const remoteVersion = data.version;
    const localVersion = chrome.runtime.getManifest().version;

    // compare versions
    if (remoteVersion.localeCompare(localVersion, undefined, { numeric: true, sensitivity: 'base' }) > 0) {
      updateNotice.style.display = 'block';
      remoteVersionSpan.textContent = remoteVersion;
    }
  } catch (e) {
    console.log("Could not check for updates.");
  }
}

checkVersion();