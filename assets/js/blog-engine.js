/**
 * Redesign Dental Clinics — Interactive Blog Engine
 * Powers live category filtering, real-time instant search, responsive card rendering,
 * pagination, and seamless multilingual switching on blog.html.
 */

(function () {
  'use strict';

  var blogData = window.__RC_BLOG_DATA__;
  if (!blogData) return;

  var currentCategory = 'all';
  var currentSearchQuery = '';
  var currentPage = 1;
  var itemsPerPage = 6;

  // DOM Elements
  var blogListEl = document.getElementById('blog-cards-container');
  var categoryNavEl = document.getElementById('blog-category-nav');
  var searchInputEl = document.getElementById('blog-search-input');
  var searchClearEl = document.getElementById('blog-search-clear');
  var searchCountEl = document.getElementById('blog-search-count');
  var paginationEl = document.getElementById('blog-pagination');
  var noResultsEl = document.getElementById('blog-no-results');

  // Helper for Translation Lookup
  function t(key, params) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key, params);
    }
    return key;
  }

  // 1. Filter Articles by Category and Search Query
  function getFilteredArticles() {
    var query = currentSearchQuery.trim().toLowerCase();
    var lang = (window.i18n && window.i18n.getLanguage) ? window.i18n.getLanguage() : 'en';

    return blogData.articles.filter(function (art) {
      // Category match
      var matchesCategory = currentCategory === 'all' || art.category === currentCategory;
      if (!matchesCategory) return false;

      // Search match
      if (!query) return true;

      var title = t(art.titleKey).toLowerCase();
      var excerpt = t(art.excerptKey).toLowerCase();
      var catName = t(art.categoryKey).toLowerCase();
      var slug = art.slug.toLowerCase();

      return (
        title.indexOf(query) !== -1 ||
        excerpt.indexOf(query) !== -1 ||
        catName.indexOf(query) !== -1 ||
        slug.indexOf(query) !== -1
      );
    });
  }

  // 2. Render Category Filter Navigation Pills
  function renderCategories() {
    if (!categoryNavEl) return;

    var html = blogData.categories.map(function (cat) {
      var isActive = cat.id === currentCategory;
      var label = t(cat.key);
      return (
        '<button type="button" class="category-pill-light' + (isActive ? ' is-active' : '') + '" data-cat="' + cat.id + '">' +
        '<span>' + label + '</span>' +
        '</button>'
      );
    }).join('');

    categoryNavEl.innerHTML = html;

    // Attach click events
    categoryNavEl.querySelectorAll('.category-pill-light').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = this.getAttribute('data-cat');
        if (currentCategory === cat) return;
        currentCategory = cat;
        currentPage = 1;
        renderCategories();
        renderBlogList();
      });
    });
  }

  // 3. Render Article Cards Grid
  function renderBlogList() {
    if (!blogListEl) return;

    var filtered = getFilteredArticles();
    var total = filtered.length;

    // Update Result Counter
    if (searchCountEl) {
      if (currentSearchQuery || currentCategory !== 'all') {
        searchCountEl.textContent = t('blog.searchCount', { count: total });
        searchCountEl.style.display = 'block';
      } else {
        searchCountEl.style.display = 'none';
      }
    }

    if (total === 0) {
      blogListEl.innerHTML = '';
      if (noResultsEl) noResultsEl.style.display = 'block';
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }

    if (noResultsEl) noResultsEl.style.display = 'none';

    // Pagination Calculation
    var totalPages = Math.ceil(total / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    var startIndex = (currentPage - 1) * itemsPerPage;
    var pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    // Build Cards HTML preserving approved design & hover effects
    var cardsHtml = pageItems.map(function (art) {
      var title = t(art.titleKey);
      var excerpt = t(art.excerptKey);
      var catName = t(art.categoryKey);
      var readMoreText = t('common.readMore');
      var readTime = t('blog.readTime', { min: art.readingTime });

      return (
        '<div role="listitem" class="w-dyn-item">' +
          '<a href="/blog/' + art.slug + '" class="blog_item w-inline-block">' +
            '<div class="blog-content_wrap">' +
              '<div class="blog-item_content">' +
                '<div class="blog-item_content-inner">' +
                  '<div class="blog-card_meta" style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 13px; font-weight: 600;">' +
                    '<span class="blog-card_badge" style="background: rgba(15, 118, 110, 0.9); color: #ffffff; padding: 4px 10px; border-radius: 99px; font-size: 12px; border: 1px solid rgba(45, 212, 191, 0.4);">' + catName + '</span>' +
                    '<span style="color: #cbd5e1;">•</span>' +
                    '<span style="color: #cbd5e1; font-size: 12px;">' + readTime + '</span>' +
                  '</div>' +
                  '<h2 class="blog-item_title" style="font-size: 20px; font-weight: 700; line-height: 1.35; margin-bottom: 10px; color: #ffffff !important; letter-spacing: normal !important; word-spacing: normal !important; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">' + title + '</h2>' +
                  '<p class="blog-card_excerpt" style="font-size: 14px; line-height: 1.6; color: #e2e8f0 !important; margin-bottom: 18px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; letter-spacing: normal !important; word-spacing: normal !important; text-shadow: 0 1px 4px rgba(0,0,0,0.4);">' + excerpt + '</p>' +
                  '<div class="blog-item_cta">' +
                    '<div>' + readMoreText + '</div>' +
                    '<div class="blog-item_icon-wrap">' +
                      '<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 20 20" fill="none" vector-effect="non-scaling-stroke" preserveAspectRatio="none">' +
                        '<path d="M9.17105 5L15 5.0002L15 10.8016M5 15L14.7593 5.24093" stroke="currentColor" stroke-width="1.5"></path>' +
                      '</svg>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="blog-item_image-wrap">' +
              '<img src="' + art.image + '" loading="lazy" alt="' + art.alt + '" class="blog-item_image" style="width: 100%; height: 100%; object-fit: cover;" />' +
            '</div>' +
          '</a>' +
        '</div>'
      );
    }).join('');

    blogListEl.innerHTML = cardsHtml;

    // Render Pagination Controls
    renderPagination(totalPages);
  }

  // 4. Render Pagination
  function renderPagination(totalPages) {
    if (!paginationEl) return;
    if (totalPages <= 1) {
      paginationEl.innerHTML = '';
      return;
    }

    var html = '<div class="pagination-wrapper" style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 48px;">';

    // Prev Button
    if (currentPage > 1) {
      html += '<button type="button" class="pagination-btn is-prev" data-page="' + (currentPage - 1) + '" style="padding: 10px 18px; border-radius: 99px; background: #ffffff; border: 1px solid #cbd5e1; font-weight: 600; color: #05262a; cursor: pointer; transition: all 0.2s;">' + t('common.prev') + '</button>';
    }

    // Numbered Buttons
    for (var i = 1; i <= totalPages; i++) {
      var isCurrent = i === currentPage;
      html += '<button type="button" class="pagination-btn' + (isCurrent ? ' is-active' : '') + '" data-page="' + i + '" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; cursor: pointer; transition: all 0.2s; ' + (isCurrent ? 'background: linear-gradient(135deg, #05262a 0%, #0f766e 100%); color: #fff; border: none; box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);' : 'background: #fff; border: 1px solid #cbd5e1; color: #05262a;') + '">' + i + '</button>';
    }

    // Next Button
    if (currentPage < totalPages) {
      html += '<button type="button" class="pagination-btn is-next" data-page="' + (currentPage + 1) + '" style="padding: 10px 18px; border-radius: 99px; background: #ffffff; border: 1px solid #cbd5e1; font-weight: 600; color: #05262a; cursor: pointer; transition: all 0.2s;">' + t('common.next') + '</button>';
    }

    html += '</div>';
    paginationEl.innerHTML = html;

    // Attach Click Events
    paginationEl.querySelectorAll('.pagination-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var page = parseInt(this.getAttribute('data-page'), 10);
        if (page && page !== currentPage) {
          currentPage = page;
          renderBlogList();
          // Smooth scroll to top of blog section
          var blogSection = document.querySelector('.section_blog');
          if (blogSection) {
            blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  // 5. Search Input Handler
  function initSearch() {
    if (!searchInputEl) return;

    searchInputEl.addEventListener('input', function () {
      currentSearchQuery = this.value;
      currentPage = 1;
      if (searchClearEl) {
        searchClearEl.style.display = currentSearchQuery ? 'block' : 'none';
      }
      renderBlogList();
    });

    if (searchClearEl) {
      searchClearEl.addEventListener('click', function () {
        searchInputEl.value = '';
        currentSearchQuery = '';
        this.style.display = 'none';
        currentPage = 1;
        renderBlogList();
        searchInputEl.focus();
      });
    }
  }

  // 6. Global Language Change Listener
  window.addEventListener('rcLanguageChanged', function () {
    renderCategories();
    renderBlogList();
  });

  // 7. Initialize
  function init() {
    renderCategories();
    initSearch();
    renderBlogList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
