(() => {
    const root = document.documentElement;
    root.classList.remove('no-js');

    // Header border once the page scrolls.
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Mobile menu.
    const menuButton = document.querySelector('.menu-button');
    const siteNav = document.querySelector('.site-nav');
    if (menuButton && siteNav) {
        const label = menuButton.querySelector('.sr-only');
        const setOpen = open => {
            menuButton.setAttribute('aria-expanded', String(open));
            siteNav.classList.toggle('is-open', open);
            if (label) label.textContent = open ? 'Close menu' : 'Open menu';
        };
        menuButton.addEventListener('click', () => setOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
        siteNav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
        window.addEventListener('resize', () => { if (window.innerWidth > 760) setOpen(false); });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
                setOpen(false);
                menuButton.focus();
            }
        });
    }

    // Sample history: search box and type chips filter the list.
    const demoList = document.querySelector('[data-demo-list]');
    if (demoList) {
        const items = [...demoList.querySelectorAll('.app-item')];
        const search = document.querySelector('[data-demo-search]');
        const chips = [...document.querySelectorAll('[data-demo-filter]')];
        const empty = document.querySelector('[data-demo-empty]');
        let filter = 'all';

        const apply = () => {
            const query = (search?.value || '').trim().toLowerCase();
            let shown = 0;
            items.forEach(item => {
                const typeOk = filter === 'all'
                    || (filter === 'pinned' ? item.dataset.pinned === 'true' : item.dataset.type === filter);
                const textOk = !query || item.textContent.toLowerCase().includes(query);
                item.hidden = !(typeOk && textOk);
                if (!item.hidden) shown++;
            });
            if (empty) empty.hidden = shown > 0;
        };

        search?.addEventListener('input', apply);
        chips.forEach(chip => chip.addEventListener('click', () => {
            filter = chip.dataset.demoFilter;
            chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
            apply();
        }));
    }

    // Ctrl+Shift+V (or Ctrl+Alt+V) opens and closes the sample panel, like the app.
    const stage = document.querySelector('[data-stage]');
    const demoWindow = document.querySelector('[data-demo-window]');
    if (stage && demoWindow) {
        const toggleButton = stage.querySelector('[data-demo-toggle]');
        const keyCaps = {
            Control: stage.querySelectorAll('[data-key="ctrl"]'),
            Shift: stage.querySelectorAll('[data-key="shift"]'),
            v: stage.querySelectorAll('[data-key="v"]'),
        };
        const pressCaps = (key, down) => keyCaps[key]?.forEach(cap => cap.classList.toggle('is-down', down));

        const toggle = () => {
            const closed = !demoWindow.classList.contains('is-closed');
            demoWindow.classList.toggle('is-closed', closed);
            stage.classList.toggle('is-closed', closed);
            demoWindow.setAttribute('aria-hidden', String(closed));
            if (toggleButton) toggleButton.setAttribute('aria-pressed', String(!closed));
        };

        const isEditable = target => target instanceof HTMLElement
            && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

        document.addEventListener('keydown', event => {
            const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
            if (key === 'Control' || key === 'Shift') pressCaps(key, true);
            if (key === 'v' && event.ctrlKey && (event.shiftKey || event.altKey) && !isEditable(event.target)) {
                event.preventDefault();
                pressCaps('v', true);
                toggle();
            }
        });
        document.addEventListener('keyup', event => {
            const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
            pressCaps(key, false);
            if (key === 'Control') { pressCaps('Shift', false); pressCaps('v', false); }
        });
        window.addEventListener('blur', () => Object.keys(keyCaps).forEach(k => pressCaps(k, false)));

        toggleButton?.addEventListener('click', () => {
            Object.keys(keyCaps).forEach(k => pressCaps(k, true));
            setTimeout(() => Object.keys(keyCaps).forEach(k => pressCaps(k, false)), 160);
            toggle();
        });
    }

    // Copy the installer hash.
    document.querySelectorAll('[data-copy]').forEach(button => {
        const label = button.querySelector('span');
        const original = label ? label.textContent : '';
        button.addEventListener('click', async () => {
            const target = document.getElementById(button.dataset.copy);
            if (!target) return;
            try {
                await navigator.clipboard.writeText(target.textContent.trim());
                if (label) label.textContent = 'Copied';
            } catch {
                const range = document.createRange();
                range.selectNodeContents(target);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                if (label) label.textContent = 'Press Ctrl+C';
            }
            setTimeout(() => { if (label) label.textContent = original; }, 1800);
        });
    });

    // Fade sections in as they scroll into view.
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('is-visible'));
    }

    // Highlight the current section in a page's table of contents.
    const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];
    if ('IntersectionObserver' in window && tocLinks.length) {
        const byId = new Map(tocLinks.map(link => [link.getAttribute('href').slice(1), link]));
        const sections = [...byId.keys()].map(id => document.getElementById(id)).filter(Boolean);
        const setActive = id => tocLinks.forEach(link => link.classList.toggle('is-active', link === byId.get(id)));
        const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            if (visible[0]) setActive(visible[0].target.id);
        }, { rootMargin: '-15% 0px -70% 0px' });
        sections.forEach(section => observer.observe(section));
    }
})();
