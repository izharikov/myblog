# Feature: Credly badges

## Goal

Show Sitecore MVP and certification badges from Credly on the site, without loading anything from Credly at runtime.

## Scope

- About page: "Certifications" section with every badge, linking to the Credly verification page
- Home hero: compact strip with MVP badges only, linking to `/about#certifications`
- Home JSON-LD: `hasCredential` on the Person
- Out of scope: article pages, Credly embed script, automatic refresh at build time

## Constraints

- Static export: badge data and images are committed to the repo
- Refresh manually with `npm run credly` after earning a badge
