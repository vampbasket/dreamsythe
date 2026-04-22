const itemsPerPage = 48;
const searchInput = document.getElementById('card-search');
const cards = Array.from(document.querySelectorAll('.card-col'));
const cardData = cards.map(card => ({ element: card, text: card.textContent.toLowerCase() }));
const paginationControls = document.getElementById('pagination-controls');
const pageInfo = document.getElementById('page-info');
const noResults = document.getElementById('no-results');
let currentPage = 1;
let filteredCards = cardData;

function getPageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get('page'), 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function updateUrlPage(page) {
  const params = new URLSearchParams(window.location.search);
  if (page > 1) {
    params.set('page', page);
  } else {
    params.delete('page');
  }
  history.replaceState(null, '', window.location.pathname + (params.toString() ? '?' + params.toString() : ''));
}

function buildPageButton(label, page, isActive = false, isDisabled = false) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-sm btn-outline-light page-btn';
  btn.textContent = label;
  if (isActive) btn.classList.add('active');
  if (isDisabled) {
    btn.disabled = true;
    btn.classList.add('disabled');
  }
  btn.addEventListener('click', () => onPageChange(page));
  return btn;
}

function updatePagination(totalPages) {
  paginationControls.innerHTML = '';
  if (totalPages <= 1) {
    paginationControls.style.display = 'none';
    return;
  }
  paginationControls.style.display = 'flex';
  paginationControls.appendChild(buildPageButton('Prev', Math.max(currentPage - 1, 1), false, currentPage === 1));

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationControls.appendChild(buildPageButton('1', 1, currentPage === 1));
    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'page-ellipsis';
      ellipsis.textContent = '…';
      paginationControls.appendChild(ellipsis);
    }
  }

  for (let page = startPage; page <= endPage; page += 1) {
    paginationControls.appendChild(buildPageButton(String(page), page, page === currentPage));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'page-ellipsis';
      ellipsis.textContent = '…';
      paginationControls.appendChild(ellipsis);
    }
    paginationControls.appendChild(buildPageButton(String(totalPages), totalPages, currentPage === totalPages));
  }

  paginationControls.appendChild(buildPageButton('Next', Math.min(currentPage + 1, totalPages), false, currentPage === totalPages));
}

function renderCards() {
  const totalMatches = filteredCards.length;
  const totalPages = Math.max(1, Math.ceil(totalMatches / itemsPerPage));
  currentPage = Math.min(Math.max(currentPage, 1), totalPages);
  cards.forEach(card => {
    card.style.display = 'none';
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleCount = filteredCards.slice(startIndex, startIndex + itemsPerPage).length;
  filteredCards.slice(startIndex, startIndex + itemsPerPage).forEach(item => {
    item.element.style.display = '';
  });

  noResults.style.display = totalMatches === 0 ? '' : 'none';
  const endIndex = Math.min(startIndex + itemsPerPage, totalMatches);
  pageInfo.textContent = totalMatches === 0 ? '' : `Showing ${startIndex + 1}—${endIndex} of ${totalMatches}`;
  updatePagination(totalPages);
  updateUrlPage(currentPage);
}

function onPageChange(page) {
  if (page === currentPage) return;
  currentPage = page;
  renderCards();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applySearch(query) {
  const normalized = query.toLowerCase().trim();
  filteredCards = cardData.filter(item => item.text.includes(normalized));
  currentPage = 1;
  renderCards();
}

searchInput.addEventListener('input', ({ target }) => applySearch(target.value));

(function init() {
  currentPage = getPageFromUrl();
  applySearch(searchInput.value);
})();

document.querySelectorAll('img.copy').forEach(img => {
  img.addEventListener('click', () => {
    navigator.clipboard.writeText(img.src).then(() => {
      const msg = document.createElement('div');
      msg.textContent = 'Link copied!';
      msg.style.cssText = 'position:fixed;bottom:2em;left:50%;transform:translateX(-50%);background:var(--shadow-color);padding:8px 16px;border: 2px solid var(--tertiary-color);border-radius:0px;z-index:9999';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    });
  });
});