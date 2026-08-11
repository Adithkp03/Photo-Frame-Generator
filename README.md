# HH Goa 2026 - Identity Generator

A fast, mobile-first web application for attendees and builders of HH Goa 2026 to generate branded social graphics (PFP Frames & Builder IDs) in seconds.

## Features

- **Two Output Formats:** Generate a branded PFP Frame or a custom Builder ID.
- **Client-Side Processing:** All image cropping, masking, and canvas rendering happens directly in the browser for maximum speed and privacy. No backend required.
- **HEIC Support:** Seamlessly handles iPhone HEIC photos automatically.
- **Responsive Design:** A touch-friendly Coastal Cyber-Brutalism UI that scales flawlessly from mobile to desktop.
- **Frictionless Sharing:** Uses the Web Share API on mobile to directly share to X (Twitter), with a seamless download + intent fallback for desktop users.
- **Zero Login:** No account creation or OAuth required to use the tool.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Custom Brutalist CSS
- **Icons:** `lucide-react`
- **Image Processing:** HTML5 Canvas API + `heic2any`

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment to Vercel

Since the application is 100% client-side, it is incredibly cheap and fast to host on Vercel.

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Leave the default Next.js build settings (`npm run build`).
5. Click **Deploy**.

Within 2 minutes, your HH Goa 2026 Identity Generator will be live and ready for the world! 🌴🚀
