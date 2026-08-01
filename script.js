// search
const searchInput = document.getElementById('card-search');
if (searchInput) {
  const introCard = document.querySelector('.container > .card.frost:nth-of-type(2)');
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const cardCols = document.querySelectorAll('.card-col');
    
    if (introCard) {
      introCard.style.display = searchTerm === '' ? '' : 'none';
    }
    
    cardCols.forEach(card => {
      const nameElement = card.querySelector('.name');
      const cardName = nameElement ? nameElement.textContent.toLowerCase() : '';
      
      const tags = card.querySelectorAll('.tags span');
      const tagText = Array.from(tags).map(tag => tag.textContent.toLowerCase()).join(' ');
      
      const searchableText = cardName + ' ' + tagText;
      
      if (searchTerm === '' || searchableText.includes(searchTerm)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// copy
document.querySelectorAll('img.copy').forEach(img => {
  img.addEventListener('click', () => {
    navigator.clipboard.writeText(img.id).then(() => {
      const msg = document.createElement('div');
      msg.textContent = 'Link copied!';
      msg.style.cssText = 'position:fixed;bottom:2em;left:50%;transform:translateX(-50%);background:var(--shadow-color);padding:8px 16px;border: 2px solid var(--tertiary-color);border-radius:0px;z-index:9999';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    });
  });
});

// script below via https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/

/**
* Utility function to calculate the current theme setting.
* Look for a local storage value.
* Fall back to system setting.
* Fall back to light mode.
*/
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}

/**
* Utility function to update the button text and aria-label.
*/
function updateButton({ buttonEl, isDark }) {
  const newCta = isDark ? "Greyscale theme" : "Default theme";
  // use an aria-label if you are omitting text on the button
  // and using a sun/moon icon, for example
  buttonEl.setAttribute("aria-label", newCta);
  buttonEl.innerText = newCta;
}

/**
* Utility function to update the theme setting on the html tag
*/
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}


/**
* On page load:
*/

/**
* 1. Grab what we need from the DOM and system settings on page load
*/
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
* 2. Work out the current site settings
*/
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

/**
* 3. Update the theme setting and button text accoridng to current settings
*/
updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

/**
* 4. Add an event listener to toggle the theme
*/
button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

  localStorage.setItem("theme", newTheme);
  updateButton({ buttonEl: button, isDark: newTheme === "dark" });
  updateThemeOnHtmlEl({ theme: newTheme });

  currentThemeSetting = newTheme;
}); 