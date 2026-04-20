(function () {
  'use strict';

  var page        = document.querySelector('.search-page');
  var input       = document.getElementById('search-input');
  var resultsEl   = document.getElementById('search-results');
  if (!page || !input || !resultsEl) return;

  var jsonUrl  = page.getAttribute('data-search-json');
  var posts    = [];
  var idx      = null;
  var debounce = null;

  // ── Helpers ──────────────────────────────────────────────────────────────

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Escape a string for use inside a RegExp literal.
  function escRe(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Sanitize raw user input before passing to Lunr — strip special query syntax.
  function sanitizeQuery(raw) {
    // Remove characters Lunr treats as field operators, boosts, fuzzy, presence
    return raw.replace(/[+\-:~^*]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Build a content snippet centered on the first match of any query term.
  function buildSnippet(text, terms) {
    var WINDOW = 160;
    var lower  = text.toLowerCase();
    var best   = -1;

    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (!t || t.length < 2) continue;
      var pos = lower.indexOf(t.toLowerCase());
      if (pos !== -1 && (best === -1 || pos < best)) best = pos;
    }

    var start, snippet;
    if (best === -1) {
      // No direct match — use start of text (Lunr may have stemmed it)
      snippet = text.slice(0, WINDOW * 2);
    } else {
      start   = Math.max(0, best - Math.floor(WINDOW / 2));
      snippet = (start > 0 ? '…' : '') + text.slice(start, start + WINDOW * 2);
    }

    return snippet.length < text.length ? snippet + '…' : snippet;
  }

  // Highlight matching terms inside an already-escaped HTML string.
  function highlight(escapedHtml, terms) {
    terms.forEach(function (term) {
      if (!term || term.length < 2) return;
      var re = new RegExp('(' + escRe(escHtml(term)) + ')', 'gi');
      escapedHtml = escapedHtml.replace(re, '<mark>$1</mark>');
    });
    return escapedHtml;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  function renderResults(results, terms, rawQuery) {
    if (!results.length) {
      resultsEl.innerHTML =
        '<p class="search-no-results">No results for <strong>' + escHtml(rawQuery) + '</strong>. Try a different keyword.</p>';
      return;
    }

    var countHtml =
      '<p class="search-result-count">' +
      results.length + ' result' + (results.length === 1 ? '' : 's') +
      ' for <strong>' + escHtml(rawQuery) + '</strong></p>';

    var cardsHtml = results.map(function (post) {
      var tags = post.tags
        ? post.tags.split(' ').filter(Boolean).slice(0, 3).map(function (t) {
            return '<a href="/tags#' + escHtml(t) + '" class="tag">' + escHtml(t) + '</a>';
          }).join('')
        : '';

      var sourceText = post.content || post.excerpt || '';
      var snippet    = buildSnippet(sourceText, terms);
      var snippetHtml = highlight(escHtml(snippet), terms);

      var titleHtml = highlight(escHtml(post.title), terms);

      return '<article class="search-result-card">' +
        '<div class="search-result-meta">' +
          (tags ? '<div class="post-tags">' + tags + '</div>' : '') +
          '<time class="post-date">' + escHtml(post.date) + '</time>' +
        '</div>' +
        '<h2 class="search-result-title">' +
          '<a href="' + escHtml(post.url) + '">' + titleHtml + '</a>' +
        '</h2>' +
        '<p class="search-snippet">' + snippetHtml + '</p>' +
        '<a href="' + escHtml(post.url) + '" class="read-more" aria-label="Read ' + escHtml(post.title) + '">' +
          'Read article <span aria-hidden="true">&rarr;</span>' +
        '</a>' +
      '</article>';
    }).join('');

    resultsEl.innerHTML = countHtml + '<div class="search-results-list">' + cardsHtml + '</div>';
  }

  // ── Search ────────────────────────────────────────────────────────────────

  function doSearch(rawQuery) {
    var q = rawQuery.trim();

    if (!q) {
      resultsEl.innerHTML = '<p class="search-hint">Search across all posts by topic, keyword, or phrase.</p>';
      history.replaceState(null, '', window.location.pathname);
      return;
    }

    if (!idx) {
      resultsEl.innerHTML = '<p class="search-hint">Loading search index…</p>';
      return;
    }

    history.replaceState(null, '', '?q=' + encodeURIComponent(q));

    var sanitized = sanitizeQuery(q);
    var terms     = sanitized.toLowerCase().split(/\s+/).filter(Boolean);
    var lunrResults;

    try {
      // Try exact query first, then fall back to wildcard suffix on each term
      lunrResults = idx.search(sanitized);
      if (!lunrResults.length && terms.length) {
        lunrResults = idx.search(terms.map(function (t) { return t + '*'; }).join(' '));
      }
    } catch (e) {
      lunrResults = [];
    }

    var matched = lunrResults.map(function (r) {
      return posts.find(function (p) { return p.ref === r.ref; });
    }).filter(Boolean);

    renderResults(matched, terms, q);
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────

  fetch(jsonUrl)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      posts = data;

      idx = lunr(function () {
        this.ref('ref');
        this.field('title',   { boost: 10 });
        this.field('tags',    { boost: 5  });
        this.field('excerpt', { boost: 3  });
        this.field('content', { boost: 1  });

        data.forEach(function (post) { this.add(post); }, this);
      });

      // Run initial search if ?q= is in the URL
      var params = new URLSearchParams(window.location.search);
      var initial = params.get('q') || '';
      if (initial) {
        input.value = initial;
        doSearch(initial);
      }
    })
    .catch(function () {
      resultsEl.innerHTML = '<p class="search-error">Could not load search index. Please try again.</p>';
    });

  input.addEventListener('input', function () {
    clearTimeout(debounce);
    var val = input.value;
    debounce = setTimeout(function () { doSearch(val); }, 280);
  });

  // Trigger immediately on Enter without waiting for debounce
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      clearTimeout(debounce);
      doSearch(input.value);
    }
  });

  // Auto-focus the input on page load
  input.focus();
})();
