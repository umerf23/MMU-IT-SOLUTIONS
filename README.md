# MMU IT Solutions website

A static site. No build step, no database, no dependencies to install. Open
`index.html` in a browser and it runs.

---

## 1. Replace these placeholders before you launch

Everything below is fake. The site will work without changing them, but it will
look unfinished and your form will not deliver anything.

### Find and replace across all `.html` files

| Placeholder | Where it appears | Replace with |
|---|---|---|
| `https://www.mmuitsolutions.com` | canonical and Open Graph tags, sitemap, robots | Your real domain |
| `hello@mmuitsolutions.com` | footer, contact page, legal pages | Your real email |
| `910000000000` | every WhatsApp link | Your number in international format, digits only, no `+` |
| `+91 00000 00000` | schema markup on the home page | Your number as you want it displayed |
| `YOUR-WEB3FORMS-ACCESS-KEY` | `contact.html` | See section 2 |
| `mmuitsolutions/30min` | `contact.html` | Your Cal.com or Calendly link |
| `Founder name` | `about.html`, appears 3 times | Your three real names |
| `Chandigarh` | footer, legal pages, schema | Your actual city |

On Mac or Linux you can do the domain in one command from the site folder:

```bash
grep -rl "www.mmuitsolutions.com" . | xargs sed -i '' 's|www.mmuitsolutions.com|yourdomain.com|g'
```

Drop the `''` after `-i` if you are on Linux.

### Photos still needed

- **Three founder photos.** In `about.html` each founder currently shows a
  letter in a circle. Replace each `<div class="team-avatar">X</div>` with
  `<img src="assets/founder-name.jpg" alt="Full name" class="team-avatar">`.
  Square images, at least 400 by 400 pixels.
- This matters more than anything else on the site. You are a new agency, and
  faces are what make a stranger believe three real people are behind it.

---

## 2. Make the contact form actually deliver

The form posts to Web3Forms, which is free and needs no backend.

1. Go to web3forms.com and enter your email address.
2. They email you an access key. Copy it.
3. In `contact.html`, replace `YOUR-WEB3FORMS-ACCESS-KEY`.
4. Submit a test message and confirm it arrives.

If you prefer Formspree or Netlify Forms, only the `action` attribute on the
`<form>` tag changes. The validation in `js/form.js` works either way.

**Test the form after every deployment.** A silently broken contact form is the
most expensive bug an agency site can have.

---

## 3. Turn on analytics

Both snippets are already written and sitting commented out in the `<head>` of
every page. You need to do two things:

1. Replace `G-XXXXXXXXXX` with your Google Analytics 4 measurement ID.
2. Replace `000000000000` with your Meta Pixel ID from Events Manager.
3. Delete the `<!--` and `-->` around both blocks.

`js/form.js` already fires a `generate_lead` event in GA4 and a `Lead` event in
the Meta Pixel on successful submission. Those fire automatically once the
snippets are live, so your own ad campaigns become measurable from day one.

You sell Meta Ads. Running your own site without a Pixel is the first thing a
sharp prospect will check.

---

## 4. Deploy

Any static host works. All three below are free for a site this size and give
you HTTPS automatically.

**Cloudflare Pages, Netlify, or Vercel.** Drag the folder into their dashboard,
or connect a Git repository. Point your domain at them and you are live.

Two things to configure after the first deploy:

- Set `404.html` as your custom error page.
- Force HTTPS and redirect `www` to non-www, or the reverse. Pick one and stay
  consistent, because canonical tags assume `www`.

---

## 5. After launch

- Submit `sitemap.xml` in Google Search Console.
- Test your share preview at `developers.facebook.com/tools/debug` by pasting
  your homepage URL. It should show the dark card with your logo.
- Run Lighthouse in Chrome DevTools. Inner pages currently transfer about
  121 KB and load in under 200 ms locally.
- Create a Google Business Profile if you serve local clients.

---

## File structure

```
index.html              Home
services.html           Services hub
meta-ads.html           Service detail
web-development.html    Service detail
ai-automation.html      Service detail
ai-agents.html          Service detail
ugc-video.html          Service detail
work.html               Demos and case studies
about.html              The three founders
pricing.html            Published starting prices
contact.html            Form, WhatsApp, booking link
privacy.html            Privacy policy
terms.html              Terms of service
thank-you.html          Post-submission page (noindex)
404.html                Error page (noindex)

css/style.css           All styles
js/script.js            Navigation, animations, Three.js hero
js/form.js              Contact form validation and submission

assets/                 Logo variants, favicons, share image
robots.txt              Search engine directives
sitemap.xml             Page index for search engines
site.webmanifest        Mobile home screen metadata
```

---

## Notes on decisions made

**The logo was replaced.** Your original `logo.png` was dark navy on
transparency, which was nearly invisible against the dark background. There are
now two variants: `logo-light.png` and `logo-light.webp` for the dark site, and
`logo-dark.png` for invoices, documents, or anything on a white background. File
size dropped from 118 KB to 20 KB in WebP.

**Tailwind CDN was removed.** It is a development tool. It shipped a compiler to
every visitor and caused a visible flash of unstyled content on load.

**Three.js now loads only on the home page.** It was previously loading on all
five pages while only the home page used a canvas.

**Colours were darkened slightly.** The button gradient changed from
`#3b82f6/#8b5cf6` to `#2563eb/#7c3aed` because white text on the lighter pair
only reached 3.68:1 contrast, below the WCAG AA minimum of 4.5:1. It now reaches
5.17:1 and looks nearly identical.

**Legal pages are a solid starting point, not legal advice.** They cover the
standard ground and are written to be readable. Have a lawyer review them before
you sign your first significant contract, particularly the liability section.

**The pricing numbers are placeholders with realistic structure.** Change them
to whatever you actually intend to charge. The important part is that they are
published at all, which is unusual and builds trust.
