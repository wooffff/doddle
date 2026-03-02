const walkMeCheck = document.getElementById('toggleWalkMe');
const autoOpenCheck = document.getElementById('toggleAutoOpen');
const aliasCheck = document.getElementById('toggleAliases');
const redirectCheck = document.getElementById('toggleRedirect');
const hideNoDueCheck = document.getElementById('toggleHideNoDue');
const compactCheck = document.getElementById('toggleCompact');
const priorityCheck = document.getElementById('togglePriority');

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