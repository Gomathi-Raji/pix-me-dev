# Portfolio

A playful, pixelated portfolio site built with Next.js, TypeScript, Tailwind CSS, NES.css, and Framer Motion. This project transforms your professional work experience and open-source projects into an interactive, retro-inspired experience with smooth animations and light/dark themes.

---

## 📺 Demo

<div align="center">
  <video src="https://github.com/user-attachments/assets/demo-video.mp4" controls width="640" poster="https://raw.githubusercontent.com/your-username/portfolio/main/demo-screenshot.png">
    Your browser does not support the video tag.
  </video>
</div>

---

## 🚀 Features

- **Light & Dark Mode**: Automatically detects user timezone for day/night and allows manual toggle.
- **Minecraft Aesthetic**: Blocky gradients emulate sky→grass→dirt→stone layers, with pixelated clouds and twinkling stars.
- **Animated Header**: Portal overlay animation opens with block ring explosion before revealing content.
- **Work Experience**: NES-style cards showing position, company, dates, summary, and expandable highlights powered by Framer Motion.
- **Projects Showcase**: Grid of project cards with fade-in, ‘Load More’ functionality, and animated reveal of tech tags.
- **Pixel Fonts & Icons**: Uses NES.css components and React Icons (FiChevronDown / FiChevronUp) for a cohesive 8-bit look.
- **Responsive & Accessible**: Mobile-first layout and ARIA-friendly semantics
- **SEO Optimized**: Meta tags, structured data, sitemap, and Open Graph support

---

## 🔍 SEO Setup

### 1. Update Domain URLs

Replace `https://your-portfolio-domain.com` in the following files with your actual domain:

- `src/app/layout.tsx` (metadata, Open Graph, Twitter cards)
- `src/app/sitemap.ts` (sitemap URLs)
- `src/app/robots.txt/route.ts` (robots.txt sitemap URL)
- `src/components/StructuredData.tsx` (structured data URLs)

### 2. Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Get your verification code and replace `your-google-site-verification-code` in `src/app/layout.tsx`

### 3. Social Media Setup

Update the following in `src/app/layout.tsx`:
- Twitter handle: Replace `@your_twitter_handle`
- Social media URLs in `src/components/StructuredData.tsx`

### 4. Open Graph Image

The OG image is auto-generated at `/og-image`. You can also create a custom `public/og-image.jpg` (1200x630px).

### 5. Submit to Search Engines

- **Google**: Submit your sitemap at `https://your-domain.com/sitemap.xml`
- **Bing**: Submit your sitemap at Bing Webmaster Tools
- **Test Rich Results**: Use [Google's Rich Results Test](https://search.google.com/test/rich-results)

---

## 🔧 Installation

1. **Clone the repo**

   ```bash
    git clone https://github.com/your-username/portfolio.git
    cd portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Navigate to `http://localhost:3000` to see your portfolio in action.

---

## 🎨 Configuration

- **Project Data**: Edit `src/data/work.json`, `src/data/projects.json`, etc. to update your work history and open-source projects.
- **Type Definitions**: Found in `/types/*.ts` to keep data strongly typed.
- **Theme Colors**: Tailwind utilities and `.minecraft-world.day` / `.night` CSS classes in `globals.css` control sky gradients.
- **Toggle Button**: Customize the pixelated toggle in `ToggleDayNight.tsx`.

---

## 🚧 Customizing Animations

All animations use Framer Motion:

- **PortalOverlay**: Block ring explosion in `PortalOverlay.tsx`.
- **Clouds & Stars**: Day/Night sky animations in `MinecraftLayout.tsx`.
- **Card & List**: WorkExperience and Projects components leverage `AnimatePresence` and variants for smooth entry/exit and stagger effects.

Modify `variants` objects or transition props to fine-tune durations, easings, and staggering.

---

## 🌐 Deployment

Build for production:

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

Deploy to Vercel, Netlify, or any static host supporting Next.js.

---

## ❤️ Contributing

Contributions, issues, and feature requests are welcome! Feel free to:

- Open an issue for bugs or ideas
- Submit pull requests for enhancements

Please read `CONTRIBUTING.md` for details.

---

## 📜 License

This project is licensed under the MIT License. See `LICENSE` for details.

---

Made with ❤️ and 8-bit nostalgia.
