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