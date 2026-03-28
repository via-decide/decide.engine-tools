# UI/UX Fix Tracker - Decide Engine Tools
**Start Date:** March 29, 2026
**Target Completion:** April 5, 2026 (1 week)

---

## TIER 1: CRITICAL FIXES (Must Do First)
### Expected Time: 2-3 hours
### These block core functionality on mobile

#### [ ] 1. Add Responsive Breakpoints to ALL Files
- [ ] reality-check.html - Add 375px/768px/1024px breakpoints
- [ ] decision-matrix.html - Replace 480px with standard breakpoints
- [ ] opportunity-radar.html - Replace 500px with standard breakpoints
- [ ] tool-router.html - Verify existing breakpoints (likely OK)
- [ ] cta.html - Add mobile breakpoint
- [ ] index.html - Verify breakpoints work
- [ ] mars.html - ADD FIRST TIME (critical)

**Template to use:**
```css
@media (max-width: 767px) { /* mobile */ }
@media (min-width: 768px) and (max-width: 1023px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
```

**Commit message:** `fix: standardize responsive breakpoints to 375px/768px/1024px`

---

#### [ ] 2. Increase Touch Targets to 44x44px
- [ ] reality-check.html - Update .chip-opt padding
- [ ] decision-matrix.html - Update .chip-opt padding
- [ ] opportunity-radar.html - Update .chip-opt padding
- [ ] tool-router.html - Update .option-btn
- [ ] index.html - Update all buttons
- [ ] mars.html - Update all interactive elements

**Template to use:**
```css
button, a, [role="button"], .chip-opt {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

**Testing:** Open DevTools → Responsive Design Mode → 375px → Try tapping each button

**Commit message:** `fix: increase touch targets to 44x44px minimum (WCAG AAA)`

---

#### [ ] 3. Add Safe Area Support to Fixed Elements
- [ ] reality-check.html - Add safe-area-inset to fixed nav
- [ ] decision-matrix.html - Add safe-area-inset to fixed elements
- [ ] opportunity-radar.html - Add safe-area-inset to fixed elements
- [ ] index.html - Add safe-area-inset to fixed nav/footer
- [ ] mars.html - Add safe-area-inset to fixed elements

**Template to use:**
```css
.fixed-element {
  position: fixed;
  padding-top: max(12px, env(safe-area-inset-top));
  padding-left: max(12px, env(safe-area-inset-left));
  padding-right: max(12px, env(safe-area-inset-right));
}
```

**Testing:** Safari iPhone (or iPhone simulator) → Notch should not hide content

**Commit message:** `fix: add safe-area-inset support for notched devices`

---

#### [ ] 4. Add Form Labels for Accessibility
- [ ] decision-matrix.html - Add labels to all inputs
- [ ] opportunity-radar.html - Add labels to all inputs

**Template to use:**
```html
<label for="unique-id">Label Text</label>
<input id="unique-id" type="text" placeholder="...">
```

**Testing:** NVDA screen reader → Tab through form → Should read labels

**Commit message:** `fix: add associated form labels (WCAG 3.3.2)`

---

#### [ ] 5. Add Alt Text/ARIA to SVG Icons
- [ ] All 7 files - Review SVG icons and add aria-label or title

**Template to use:**
```html
<!-- Option 1: Title element -->
<svg aria-label="Delete" viewBox="0 0 24 24">
  <title>Delete this item</title>
  <path d="..."/>
</svg>

<!-- Option 2: ARIA label -->
<svg aria-label="Settings" role="img" viewBox="0 0 24 24">
  <path d="..."/>
</svg>

<!-- Option 3: Decorative (hidden from screen readers) -->
<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="..."/>
</svg>
```

**Testing:** NVDA screen reader → Icons should read as intended meaning

**Commit message:** `fix: add aria-labels and alt text to SVG icons`

---

## TIER 2: HIGH PRIORITY FIXES
### Expected Time: 3-4 hours
### These improve mobile UX and accessibility compliance

#### [ ] 6. Fix Color Contrast Issues
- [ ] index.html - Change #858aaa to #c7c7d9
- [ ] decision-matrix.html - Change #858aaa to #c7c7d9
- [ ] All files - Verify text colors meet 4.5:1 ratio

**Template to use:**
```css
/* BEFORE: 3.3:1 (FAIL) */
.stat-label { color: #858aaa; }

/* AFTER: 5.5:1 (PASS) */
.stat-label { color: #c7c7d9; }

/* OR use token */
.stat-label { color: var(--text); }
```

**Testing:** axe DevTools → Color Contrast checker → All text ≥ 4.5:1

**Commit message:** `fix: improve color contrast to meet WCAG AA (4.5:1)`

---

#### [ ] 7. Import Design Tokens in cta.html
- [ ] cta.html - Add link to _design-tokens.css
- [ ] cta.html - Replace hardcoded colors with var(--saffron) etc.

**Template to use:**
```html
<head>
  <link rel="stylesheet" href="./_design-tokens.css">
  <link rel="stylesheet" href="./_ux-patterns.css">
</head>

<style>
  .title {
    background: linear-gradient(135deg, var(--saffron) 0%, var(--green) 50%, var(--teal) 100%);
  }
</style>
```

**Commit message:** `fix: import design tokens in cta.html for consistency`

---

#### [ ] 8. Remove Zoom Restrictions
- [ ] index.html - Remove maximum-scale=1.0, user-scalable=no

**Current:**
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
```

**Fixed:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Testing:** Pinch-to-zoom should work on mobile device

**Commit message:** `fix: remove zoom restrictions (allow user pinch-to-zoom)`

---

#### [ ] 9. Fix Heading Hierarchy
- [ ] mars.html - Ensure only one h1, proper h2/h3 nesting
- [ ] opportunity-radar.html - Verify heading hierarchy

**Testing:** WebAIM WAVE tool → No "skipped heading levels" errors

**Commit message:** `fix: correct heading hierarchy for accessibility`

---

#### [ ] 10. Add Prefers Reduced Motion Support
- [ ] reality-check.html - Add @media (prefers-reduced-motion: reduce)
- [ ] decision-matrix.html - Add prefers-reduced-motion rule
- [ ] opportunity-radar.html - Add prefers-reduced-motion rule
- [ ] cta.html - Add prefers-reduced-motion rule
- [ ] index.html - Add prefers-reduced-motion rule
- [ ] mars.html - Add prefers-reduced-motion rule
- [ ] tool-router.html - Verify already has it

**Template to use:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Testing:** macOS System Preferences → Accessibility → Display → Reduce motion → ON

**Commit message:** `fix: add prefers-reduced-motion support (vestibular disorder support)`

---

#### [ ] 11. Test on Real iPhone
- [ ] Borrow iPhone 12 mini (375px) or use iPhone simulator
- [ ] Test each tool at 375px width
- [ ] Check: no horizontal scroll, buttons tappable, fonts readable
- [ ] Check: notch doesn't hide content, pinch-zoom works
- [ ] Document any issues found

**Checklist per tool:**
```
Tool: ________________
Device: iPhone 12 mini (375px)
Date: ______________

- [ ] No horizontal scroll
- [ ] All buttons tappable (44x44px)
- [ ] Text readable (≥14px)
- [ ] Navigation works
- [ ] Fixed elements don't overlap content
- [ ] Pinch-to-zoom works
- [ ] Focus outline visible (Tab key)

Issues found: ________________________________
```

**Commit message:** `test: verified mobile responsiveness on iPhone 12 mini`

---

## TIER 3: MEDIUM PRIORITY FIXES
### Expected Time: 4-5 hours
### These optimize performance and improve user experience

#### [ ] 12. Minify mars.html
- [ ] Use online CSS minifier (138KB → target: 85KB)
- [ ] Use online JS minifier if applicable
- [ ] Remove duplicate rules

**Tools:**
- CSS Minifier: https://cssminifier.com/
- JS Minifier: https://www.minifycode.com/javascript-minifier/

**Commit message:** `perf: minify mars.html CSS/JS (138KB → 85KB)`

---

#### [ ] 13. Performance Audit with Lighthouse
- [ ] Chrome DevTools → Lighthouse
- [ ] Run on each tool
- [ ] Target scores: Performance ≥ 90, Accessibility ≥ 90

**Files to test:**
- [ ] index.html
- [ ] tool-router.html
- [ ] reality-check.html
- [ ] decision-matrix.html
- [ ] opportunity-radar.html
- [ ] cta.html
- [ ] mars.html

**Document results:**
```
Tool: ________________
Lighthouse Scores:
  Performance: ____ /100
  Accessibility: ____ /100
  Best Practices: ____ /100
  SEO: ____ /100
  LCP: ____ ms (target: <2.5s)
  CLS: ____ (target: <0.1)

Issues to fix: ________________________________
```

**Commit message:** `perf: lighthouse optimization (target 90+ all scores)`

---

#### [ ] 14. Accessibility Audit with axe DevTools
- [ ] Chrome: Install axe DevTools extension
- [ ] Run on each tool
- [ ] Fix all violations

**Files to test:**
- [ ] All 7 primary tools
- [ ] Scan for violations
- [ ] Document and fix

**Commit message:** `a11y: axe DevTools audit - fixed all violations`

---

#### [ ] 15. Screen Reader Testing
- [ ] Test with NVDA (Windows), JAWS (if available), or VoiceOver (Mac)
- [ ] Tab through each page
- [ ] Verify all content is readable
- [ ] Verify interactive elements are accessible

**Checklist:**
- [ ] All headings announced correctly
- [ ] Form labels read with inputs
- [ ] Buttons announce as buttons
- [ ] Icons have alt text
- [ ] Focus order is logical
- [ ] No duplicate announcements

**Commit message:** `a11y: screen reader testing - verified with NVDA/VoiceOver`

---

## COMPLETION CHECKLIST

### Week 1 (TIER 1)
- [ ] All 5 TIER 1 critical fixes completed
- [ ] Responsive design works at 375px/768px/1024px
- [ ] All tools tested on iPhone 12 mini
- [ ] Pull request created and merged

**Expected Date:** March 31, 2026

---

### Week 2 (TIER 2)
- [ ] All 5 TIER 2 high-priority fixes completed
- [ ] Color contrast ≥ 4.5:1 for all text
- [ ] Form labels accessible
- [ ] Screen reader testing complete
- [ ] Pull request created and merged

**Expected Date:** April 2, 2026

---

### Week 3 (TIER 3)
- [ ] Performance optimization complete
- [ ] Lighthouse scores ≥ 90 on all tools
- [ ] axe DevTools shows 0 violations
- [ ] Documentation updated
- [ ] Final audit complete

**Expected Date:** April 5, 2026

---

## COMMIT MESSAGE TEMPLATE

Use this format for all commits:

```
type: description

Details about what was fixed, why it matters, what spec/standard it addresses.

Files changed:
- file1.html
- file2.css

Testing:
- Tested on 375px viewport
- Tested with axe DevTools
- Tested with screen reader

Fixes #<issue-number> (if applicable)
```

**Examples:**

```
fix: add responsive breakpoints across all tools

Standardizes breakpoints to 375px, 768px, 1024px for consistent mobile UX.
Previously: Each tool had different breakpoints (400px, 480px, 500px)
Now: All tools use same standard breakpoints

Files changed:
- reality-check.html
- decision-matrix.html
- opportunity-radar.html
- cta.html
- mars.html

Testing: Verified at 375px, 768px, 1024px using responsive design mode
```

---

## PROGRESS TRACKING

### TIER 1 Progress: ___/5
- [ ] Breakpoints (1/1)
- [ ] Touch targets (1/1)
- [ ] Safe area support (1/1)
- [ ] Form labels (1/1)
- [ ] Icon alt text (1/1)

### TIER 2 Progress: ___/5
- [ ] Color contrast (1/1)
- [ ] Design tokens (1/1)
- [ ] Zoom restrictions (1/1)
- [ ] Heading hierarchy (1/1)
- [ ] Reduced motion (1/1)

### TIER 3 Progress: ___/4
- [ ] Mars minification (1/1)
- [ ] Lighthouse audit (1/1)
- [ ] axe audit (1/1)
- [ ] Screen reader test (1/1)

---

## NOTES

- **Desktop-first to Mobile-first:** The codebase was built for desktop first. Converting to mobile-first approach will significantly improve UX.
- **Accessibility:** Most critical accessibility issues are in TIER 1 & 2. Prioritize these for WCAG compliance.
- **Design System:** Excellent design tokens system - just need to use them consistently (especially cta.html).
- **Performance:** mars.html needs optimization but functionality is good.
- **Testing:** Real device testing is CRITICAL - viewport resize in browser doesn't test everything (safe-area-inset, pinch-to-zoom, notch, etc.)

---

**Questions?** See UI_UX_AUDIT_REPORT_2026.md for detailed explanations and code examples.
