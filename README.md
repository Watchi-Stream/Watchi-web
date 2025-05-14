# Watchi - Anime Streaming Platform

Watchi is a modern anime streaming platform built with Next.js and Supabase where users can browse, watch, and track their favorite anime series.

## Features

- **Content Discovery**: Browse and search anime titles
- **Video Streaming**: Watch episodes via Streamtape integration
- **User Accounts**: Register, login, and manage your profile
- **Personalization**: Save favorites and track watch history
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Video Hosting**: Streamtape

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/watchi.git
   cd watchi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

Create the following tables in your Supabase project:

1. **animes**: Stores anime metadata
2. **episodes**: Stores episode information and video links
3. **favorites**: Manages user favorites
4. **watch_history**: Tracks user viewing history

See the database schema in the project documentation for detailed structure.

## Deployment

1. Deploy to Vercel:
   ```bash
   vercel
   ```

2. Set the environment variables in your Vercel project settings.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Streamtape](https://streamtape.com/)
