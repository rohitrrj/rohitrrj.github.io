/* Algolia Search Configuration */
const searchClient = algoliasearch(
  'FRJFIDF38Z',
  'a44c4901ef1b50dcdc1d2c5874c80b61'
);

const search = instantsearch({
  indexName: 'bioinfo_hub',
  searchClient,
  searchFunction(helper) {
    // Only search when query is not empty
    const searchResults = document.querySelector('#search-results');
    if (helper.state.query === '') {
      searchResults.style.display = 'none';
    } else {
      searchResults.style.display = 'block';
      helper.search();
    }
  }
});

// Configure search widgets
search.addWidgets([
  // Search Box
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'Search articles, tutorials, and resources...',
    showSubmit: false,
    showReset: true,
    showLoadingIndicator: true,
    cssClasses: {
      input: 'search-input',
      submit: 'search-submit',
      reset: 'search-reset'
    }
  }),

  // Search Results
  instantsearch.widgets.hits({
    container: '#search-hits',
    templates: {
      item: (hit) => `
        <div class="search-hit">
          ${hit.image ? `
            <div class="search-hit-image">
              <img src="${hit.image}" alt="${hit.title}" />
            </div>
          ` : ''}
          <div class="search-hit-content">
            <h3 class="search-hit-title">
              <a href="${hit.url}">${hit._highlightResult.title.value}</a>
            </h3>
            <p class="search-hit-description">
              ${hit._highlightResult.description?.value || ''}
            </p>
            <div class="search-hit-metadata">
              <span class="search-hit-category">${hit.category}</span>
              ${hit.tags ? hit.tags.map(tag => 
                `<span class="search-hit-tag">#${tag}</span>`
              ).join('') : ''}
            </div>
          </div>
        </div>
      `,
      empty: 'No results found for <em>"{{query}}"</em>'
    },
    cssClasses: {
      root: 'search-hits-root',
      list: 'search-hits-list',
      item: 'search-hits-item'
    }
  }),

  // Refinement List for Categories
  instantsearch.widgets.refinementList({
    container: '#category-filters',
    attribute: 'category',
    sortBy: ['name:asc'],
    cssClasses: {
      root: 'filter-root',
      list: 'filter-list',
      item: 'filter-item',
      selectedItem: 'filter-item-selected',
      count: 'filter-count',
      searchBox: 'filter-search'
    }
  }),

  // Pagination
  instantsearch.widgets.pagination({
    container: '#search-pagination',
    cssClasses: {
      root: 'pagination-root',
      list: 'pagination-list',
      item: 'pagination-item',
      selectedItem: 'pagination-item-selected',
      disabledItem: 'pagination-item-disabled'
    }
  })
]);

// Initialize search
search.start();
