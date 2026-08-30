# Bloque A — Port TODO the visual CSS from the mockup to `src/index.css`

Repo: /home/alexdev/proyectos/Portfolio2Final
Model: opencode/hy3-free

## HARD RULES
- Touch ONLY `src/index.css`. Do NOT create or modify any other file.
- Do NOT install npm packages. Do NOT run `npm run *`. Do NOT run `git`.
- Source of truth is `mockups/phosphor.html` lines 26-810 (the big <style> block).
- Keep the existing token block (:root, :root[data-theme='dark'], :root[data-theme='light'], --gruv-*, @theme inline). Add what's missing.
- All CSS rules must work with the existing class names that components already use
  (Tailwind utilities, plus: .id-scan, .od-flash, .id-photo, .about-id, .card, .card-tag, .card-title, .card-sub, .progress, .progress-label, .chips, .chip, .now-row, .social-row, .nav-cta, .archbar, .arch-title, .arch-x, .term, .term-body, .term-input, .term-hint, .term-prompt, .t-line, .t-cmd, .t-p, .t-out, .t-ok, .t-err, .panel, .panel-head, .panel-title, .heatmap, .hm-cell, .hm-l1..4, .heat-legend, .chart-svg, .chart-line, .chart-end, .chart-end-pulse, .bar-row, .bar-label, .bar-track, .bar-fill, .bar-val, .stat-cell, .stat-num, .stat-label, .proj, .proj-ghost, .proj-index, .proj-title, .proj-desc, .proj-meta, .proj-repo, .proj-arrow, .tl, .tl-line, .tl-progress, .tl-item, .tl-node, .tl-when, .tl-badge, .tl-title, .tl-courses, .certs-row, .cert-badge-wrap, .cert-badge, .badge-seal, .badge-beam, .badge-arc, .arc-text, .badge-core, .badge-label, .contact, .contact-title, .contact-sub, .copy-btn, .contact-links, .scroll-progress, .overdrive-flash, .grain, .scanlines, .bg-field, .f-halftone, .f-ruler, .f-ruler.r, .f-glow, .f-g1..4, .regmark, .reg-tl, .reg-br, .bg-halftone, .bg-ruler, .glow, .glow-1, .glow-2, .hero, .hero-side, .hero-grid, .hero-tag, .hero-name, .hero-first, .hero-last, .ch-wrap, .ch, .hero-sub, .caret, .hero-chips, .readout, .hero-ctas, .btn, .btn-primary, .btn-ghost, .scroll-hint, .marquee, .marquee-track, .section, .sec-head, .sec-tag, .sec-title, .sec-line, .sec-desc, .about-grid, .about-text, .about-id, .id-meta, .id-name, .id-role, .id-sub, .bento, .stack-grid, .stack-note, .act-grid, .tl-summary, .summary-bar, .summary-pct, .loader, .loader-inner, .loader-tag, .loader-name, .loader-name .tick, .loader-count, .loader-bar, .nav, .nav.is-scrolled, .nav-logo, .nav-links, .nav-right, .theme-btn, .icon-sun, .icon-moon, .tb-label, .tb-l-dia, .tb-l-noche, .sysbar, .sys, .term-live, .term-input-row, .term-status).
- Anything Tailwind already covers (layout, simple spacing) is fine to keep in Tailwind classes — do not duplicate those rules in plain CSS.

## STEP 1: ADD MISSING TOKENS to :root
Add to the existing :root block (after line 25):
  --beam-speed: 1;
  --hm0, --hm1, --hm2, --hm3, --hm4, --hm4-glow   (the 5-bucket heatmap ramp)
  --track, --bar                                    (progress bar surfaces)
  --glass                                           (scrolled-nav background)
  --gruv-* are already there.

## STEP 2: ADD EVERY SELECTOR/ANIMATION/KEYFRAME below

Mirror these sections, in this order, from mockups/phosphor.html:
1. global resets (already at top of :root, leave alone).
2. ::view-transition-old/new rules (line 54-55 of mockup).
3. .grain + @keyframes grain (line 56-65).
4. .scanlines (line 66-69).
5. .root cursor data-URIs per theme (lines 71-95). Adjust to current scheme: theme via [data-theme="dark"|"light"] on <html>.
6. .term-body, .term-input, input cursor (lines 97-99).
7. .scroll-progress (line 102-105).
8. .overdrive-flash + light override (lines 108-111).
9. #loader + .loader-inner + .loader-tag + .loader-name + .loader-name .tick + .loader-count + .loader-bar (lines 114-122). Note: real id is #loader, count text id is #loaderPct, bar id is #loaderBar, scramble text id is #loaderScramble.
10. .nav + .nav.is-scrolled + .nav-logo + .nav-links + .nav-right (lines 125-141).
11. .theme-btn + .icon-sun + .icon-moon + .tbspin keyframe + .tb-l-noche rules (lines 143-159).
12. .nav-cta + .nav-cta::before + .nav-cta::after + @keyframes beam (lines 161-173).
13. .hero + .bg-halftone + .bg-ruler + .regmark (lines 176-187).
14. .bg-field + .f-halftone + .f-ruler + .f-ruler.r + .f-glow + .f-g1..4 (lines 189-211).
15. .glow + .glow-1 + .glow-2 (lines 213-216).
16. .hero-side (lines 218-221).
17. .hero-grid + .hero-tag + .hero-name + .hero-first + .hero-last + .ch-wrap + .ch (lines 223-231).
18. .hero-sub + .caret + @keyframes blink (lines 233-235).
19. .hero-chips + .readout (lines 237-240).
20. .hero-ctas + .btn + .btn-primary + .btn-ghost + .btn svg (lines 242-248).
21. .scroll-hint + @keyframes bounce (lines 250-253).
22. .term + .archbar + .arch-logo + .arch-title + .arch-btns + .arch-x (lines 256-274).
23. .sysbar + .sys + .sys svg (lines 276-281).
24. .term-body + .term-body scrollbar (lines 283-286).
25. .t-line + .t-cmd + .t-p + .t-out + .t-ok + .t-err (lines 288-293).
26. .term-input-row + .term-prompt + .term-input (lines 295-299).
27. .term-hint (lines 301-303).
28. .marquee + .marquee-track + .marquee-track span b + @keyframes marquee (lines 306-313).
29. .section + .section::before (lines 316-319).
30. .sec-head + .sec-tag + .sec-title + .sec-line + .sec-desc (lines 321-326).
31. .about-grid + .about-id + .id-photo + .id-meta + .id-name + .id-role + .id-sub + .id-scan + @keyframes idscan (lines 329-348). Note: .id-scan already has rules in the file — keep them and ADD the light override.
32. .about-text + .about-text h3 + .about-text h3 em + .about-text p + .sig (lines 350-355).
33. .bento + .card + .card.span-2 + .card:hover + .card-tag + .card-tag i + .card-title + .card-sub (lines 357-367).
34. .progress + .progress span + .progress-label + .progress-label b (lines 369-374).
35. .chips + .chip + .chip:hover (lines 376-380).
36. .now-row + .now-row .d + .now-row span (lines 382-385).
37. .social-row + .social-row svg + .social-row span + .social-row b (lines 387-395).
38. .stack-grid + .stack-note + .stack-note b + responsive @media (lines 398-404).
39. .tl-summary + .summary-bar + .summary-bar span + .summary-pct (lines 407-411).
40. .certs-row + .cert-badge-wrap + .cert-badge + .badge-seal + .badge-beam + .arc-text + .badge-core + .badge-core .g + .badge-core .org + .badge-core .y + .badge-label + media query (lines 414-431).
41. #certOverlay + .cert-win + .cert-titlebar + .cert-body + .cert-left + .cert-pre + .cert-pre::after + .cert-right + .cert-right img + responsive (lines 434-456).
42. .panel + .panel:hover + .panel-head + .panel-title + .panel-title b (lines 459-465).
43. .heat-wrap + .heatmap + .hm-cell + .hm-l1..4 + .heat-legend (lines 467-475).
44. .act-grid + .chart-svg + .chart-line + .chart-end + .chart-end-pulse + @keyframes ping2 (lines 477-485).
45. .bar-row + .bar-label + .bar-track + .bar-fill + .bar-val (lines 487-492).
46. .stat-cell + .stat-num + .stat-num i + .stat-label (lines 494-498).
47. .proj-grid + .proj + .proj.span-2 + .proj:hover + .proj-index + .proj-title + .proj-desc + .proj-meta + .proj-repo + .proj-arrow + .proj-ghost (lines 501-514).
48. .tl + .tl-line + .tl-progress + .tl-item + .tl-node + .tl-node i + .tl-item.done + .tl-item.current + .tl-when + .tl-badge (lines 517-528).
49. .contact + .contact-title + .contact-title .p + .contact-sub + .copy-btn + .copy-btn.copied + .contact-links (lines 531-540).
50. footer + footer .p (lines 543-545).
51. responsive @media (max-width: 980px / 900px) for hero, projects, about, activity, hero-side, bg-ruler (lines 548-558).
52. .prefers-reduced-motion:reduce block (lines 561-567). Note: keep all existing .id-scan, .od-flash reduced-motion entries.

## STEP 3: VERIFY
After writing, run `wc -l src/index.css` and report. Target is 800-1000 lines. No new console.log. Do not run tests.

Reply with the final line count and a one-line summary.
