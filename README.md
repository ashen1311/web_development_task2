# web_development_task2

Ashen Paul — Portfolio
Personal portfolio website. Four pages, no frameworks, no build tools.
Just HTML, CSS, and a small JavaScript file — written by hand.
Built through a web development internship.

Task 2 additions: 
Advanced CSS3 & Responsive Architecture
What changed in this update
style.css was fully rebuilt with:
CSS custom properties for a complete light / dark token system (--clr-bg, --clr-text, --clr-accent, etc.)
[data-theme="dark"] and [data-theme="light"] attribute selectors for theme switching
@media (prefers-color-scheme: dark) fallback for users with no JavaScript
CSS Grid for every major two-dimensional

layout:
Hero: grid-template-columns: 1fr 420px
Skills: repeat(auto-fill, minmax(14rem, 1fr))
Projects: repeat(3, 1fr) collapsing to 2 then 1
Bio (About page): 280px 1fr

Contact: 1fr 1.6fr
Timeline: 1.5rem 1fr per item (dot + content)
Flexbox for all component-level alignment (header, footer, stats bar, buttons, nav)
Mobile-first responsive breakpoints:
≤ 63.99rem — tablet: stacks hero, bio, contact grids
≤ 47.99rem — mobile: hamburger nav, 2-col project grid
≤ 29.99rem — small phones: single column everything
≥ 80rem — large screens: wider grid columns
Scroll-reveal animations using IntersectionObserver (respects prefers-reduced-motion)
CSS keyframe entrance animation for hero text (hero-in)
Hover shimmer effect on project cards (CSS ::after pseudo-element)
transition: var(--theme-transition) on all colour-bearing elements for smooth theme switching

main.js now includes:
Theme toggle with localStorage persistence (key: ap-theme)
prefers-reduced-motion check before running IntersectionObserver
All previous nav toggle + form validation logic preserved

File Structure:
ashen-portfolio/
├── index.html          Home page
├── about.html          Bio, experience, skills
├── projects.html       Full project list with filter
├── contact.html        Accessible contact form
├── assets/
│   ├── style.css       1500+ line CSS — Grid, Flexbox, custom props, responsive
│   ├── main.js         Theme toggle, reveal, filter, form validation
│   └── favicon.svg     SVG favicon
├── .gitignore
└── README.md