/**
 * SConnect UI helpers
 * - "Jump to a page" search in the top bar, built from the sidebar links.
 *   Press "/" anywhere (outside a text field) to focus it.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var input = document.getElementById('sc-jump-input');
    var results = document.getElementById('sc-jump-results');
    if (!input || !results) return;

    // Collect every real link in the sidebar, with the group it belongs to.
    var pages = [];
    document.querySelectorAll('#layout-menu a.menu-link[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.indexOf('javascript:') === 0) return;
      var label = (link.textContent || '').trim();
      var group = '';
      var parentItem = link.closest('.menu-sub');
      if (parentItem) {
        var toggle = parentItem.parentElement.querySelector(':scope > .menu-link > div');
        group = toggle ? toggle.textContent.trim() : '';
      } else {
        var item = link.closest('.menu-item');
        var prev = item ? item.previousElementSibling : null;
        while (prev && !prev.classList.contains('menu-header')) prev = prev.previousElementSibling;
        group = prev ? prev.textContent.trim() : '';
      }
      var icon = link.querySelector('.menu-icon');
      pages.push({ label: label, group: group, href: href, icon: icon ? icon.className.replace('menu-icon', '').trim() : 'ri-file-list-3-line' });
    });

    var activeIndex = -1;
    var current = [];

    function render(query) {
      var q = query.trim().toLowerCase();
      results.innerHTML = '';
      activeIndex = -1;
      if (!q) {
        results.classList.remove('show');
        return;
      }
      current = pages.filter(function (p) {
        return p.label.toLowerCase().indexOf(q) !== -1 || p.group.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 8);

      if (!current.length) {
        var empty = document.createElement('span');
        empty.className = 'dropdown-item-text text-muted small px-3 py-2 d-block';
        empty.textContent = 'No pages match "' + query.trim() + '"';
        results.appendChild(empty);
      } else {
        current.forEach(function (p, i) {
          var a = document.createElement('a');
          a.className = 'dropdown-item';
          a.href = p.href;
          a.setAttribute('role', 'option');
          var icon = document.createElement('i');
          icon.className = p.icon;
          var text = document.createElement('span');
          text.textContent = p.label;
          var group = document.createElement('small');
          group.textContent = p.group;
          a.appendChild(icon);
          a.appendChild(text);
          a.appendChild(group);
          a.addEventListener('mouseenter', function () { setActive(i); });
          results.appendChild(a);
        });
        setActive(0);
      }
      results.classList.add('show');
    }

    function setActive(i) {
      var items = results.querySelectorAll('a.dropdown-item');
      items.forEach(function (el) { el.classList.remove('active'); });
      if (items[i]) {
        items[i].classList.add('active');
        activeIndex = i;
      }
    }

    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('focus', function () { if (input.value) render(input.value); });
    input.addEventListener('keydown', function (e) {
      var items = results.querySelectorAll('a.dropdown-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(Math.min(activeIndex + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(Math.max(activeIndex - 1, 0));
      } else if (e.key === 'Enter') {
        if (items[activeIndex]) {
          e.preventDefault();
          window.location.href = items[activeIndex].href;
        }
      } else if (e.key === 'Escape') {
        input.value = '';
        render('');
        input.blur();
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.sc-jump')) results.classList.remove('show');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag) || (document.activeElement && document.activeElement.isContentEditable)) return;
      e.preventDefault();
      input.focus();
      input.select();
    });
  });
})();
