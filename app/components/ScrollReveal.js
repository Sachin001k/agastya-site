'use client';

import { useEffect } from 'react';

// Fades in `.reveal` elements as they scroll into view. Also watches for
// elements added later (e.g. cards re-rendered by a filter), which would
// otherwise stay invisible.
export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      // Low threshold so very tall elements on small screens still trigger
      { threshold: 0.05 }
    );

    // Reveal straight away if already on screen (React moves filtered cards around,
    // and a moved element doesn't always produce a fresh intersection event)
    const track = (el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
      else observer.observe(el);
    };
    const watch = (root) => {
      if (root.classList?.contains('reveal') && !root.classList.contains('visible')) track(root);
      root.querySelectorAll?.('.reveal:not(.visible)').forEach(track);
    };
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => observer.observe(el));

    const mutations = new MutationObserver((records) => {
      records.forEach((r) => r.addedNodes.forEach((node) => {
        if (node.nodeType === 1) watch(node);
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
