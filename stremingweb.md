# Watchi: Next.js Anime Streaming Platform

## Project Overview

Watchi is a modern anime streaming platform built with Next.js and Supabase, offering users the ability to browse, watch, and track their favorite anime series. Videos are hosted via Streamtape integration for reliable playback.

## Core Features

- **Content Discovery**: Browse and search for anime titles with advanced filtering
- **Video Streaming**: Watch episodes through Streamtape integration
- **User Accounts**: Registration, authentication, and profile management
- **Personalization**: Save favorites and track watch history
- **Responsive Design**: Mobile-friendly interface with modern UI components

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI or Radix UI
- **Video Player**: Streamtape iframe embed or React Player

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Video Hosting**: Streamtape

### DevOps & Tools
- **Hosting**: Vercel
- **Development**: Cursor AI for code generation
- **Version Control**: GitHub
- **Environment**: `.env.local` for configuration

## Project Structure

```
/watchi
├── /app                      # App Router pages and routes
│   ├── page.tsx              # Home page
│   ├── /anime/[id]/page.tsx  # Single anime view with episodes
│   ├── /auth/login/page.tsx  # Login page
│   ├── /auth/signup/page.tsx # Signup page
│   └── /profile/page.tsx     # User profile page
├── /components               # Reusable UI components
│   ├── /layout               # Layout components
│   │   ├── Navbar.tsx        # Site navigation
│   │   └── Footer.tsx        # Page footer
│   ├── /anime                # Anime-related components
│   │   ├── AnimeCard.tsx     # Anime thumbnail card
│   │   ├── AnimeGrid.tsx     # Grid layout for anime cards
│   │   └── EpisodeList.tsx   # Episode listing component
│   ├── /ui                   # UI components
│   │   ├── VideoPlayer.tsx   # Video playback component
│   │   ├── SearchBar.tsx     # Search functionality
│   │   └── Button.tsx        # Custom button component
│   └── /auth                 # Auth-related components
│       └── AuthProvider.tsx  # Authentication context provider
├── /lib                      # Utility functions and services
│   ├── supabase.ts           # Supabase client configuration
│   ├── api.ts                # API interaction methods
│   └── utils.ts              # Helper functions
├── /types                    # TypeScript type definitions
├── /styles                   # Global styles and Tailwind config
│   └── globals.css           # Global CSS styles
├── /public                   # Static assets
└── /supabase                 # Supabase-related files
    └── schema.sql            # Database schema definition
```

## Database Schema

### `animes` Table
| Column        | Type       | Description                   |
|---------------|------------|-------------------------------|
| `id`          | uuid (PK)  | Primary key for anime entries |
| `title`       | text       | Title of the anime series     |
| `description` | text       | Series description/synopsis   |
| `cover_image` | text (URL) | URL to cover image            |
| `genres`      | text[]     | Array of genre tags           |
| `rating`      | float      | Average user rating           |
| `release_year`| integer    | Year of original release      |
| `created_at`  | timestamp  | Record creation timestamp     |
| `updated_at`  | timestamp  | Record update timestamp       |

### `episodes` Table
| Column        | Type      | Description                      |
|---------------|-----------|----------------------------------|
| `id`          | uuid (PK) | Primary key for episode entries  |
| `anime_id`    | uuid (FK) | Foreign key to `animes.id`       |
| `title`       | text      | Episode title                    |
| `description` | text      | Episode description              |
| `episode_num` | integer   | Episode number                   |
| `season_num`  | integer   | Season number                    |
| `video_url`   | text      | Streamtape embed link or MP4 URL |
| `thumbnail`   | text      | URL to episode thumbnail         |
| `duration`    | integer   | Duration in seconds              |
| `created_at`  | timestamp | Record creation timestamp        |
| `updated_at`  | timestamp | Record update timestamp          |

### `users` Table (auto-generated by Supabase Auth)
Extended with custom fields as needed.

### `favorites` Table
| Column       | Type      | Description                     |
|--------------|-----------|----------------------------------|
| `id`         | uuid (PK) | Primary key for favorite entries |
| `user_id`    | uuid (FK) | Reference to Supabase auth user  |
| `anime_id`   | uuid (FK) | Reference to `animes.id`         |
| `created_at` | timestamp | When the anime was favorited     |

### `watch_history` Table
| Column       | Type      | Description                     |
|--------------|-----------|----------------------------------|
| `id`         | uuid (PK) | Primary key for history entries  |
| `user_id`    | uuid (FK) | Reference to Supabase auth user  |
| `episode_id` | uuid (FK) | Reference to `episodes.id`       |
| `watched_at` | timestamp | When the episode was watched     |
| `progress`   | float     | Playback progress (0-1)          |
| `completed`  | boolean   | Whether episode was completed    |

## Key Components

### Video Player Implementation

The video player component supports both Streamtape embeds and direct video files:

```tsx
// Streamtape Embed
<iframe
  src={episode.video_url}
  width="100%"
  height="500px"
  frameBorder="0"
  allowFullScreen
  allow="autoplay"
/>

// Alternative: React Player
<ReactPlayer
  url={episode.video_url}
  controls
  width="100%"
  height="100%"
  config={{
    file: {
      attributes: {
        controlsList: 'nodownload'
      }
    }
  }}
/>
```

### Authentication Flow

1. **Setup**: Use Supabase Auth for user management
2. **Implementation**: Create AuthProvider context to manage user sessions
3. **Protection**: Add middleware to protect routes requiring authentication
4. **UI**: Create login/signup forms connected to Supabase Auth
5. **OAuth**: Enable social login via Google, GitHub, or other providers

Example middleware:
```tsx
export function middleware(request: NextRequest) {
  const { supabase, response } = createServerSupabaseClient(request);
  const session = supabase.auth.getSession();
  
  if (!session && request.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return response;
}
```

## User Flows

### Visitor Experience
1. Browse featured anime on the homepage
2. Search for specific titles or filter by genre
3. View anime details and available episodes
4. Watch episodes without requiring an account
5. Be prompted to create an account for enhanced features

### Registered User Experience
1. Log in with email/password or OAuth provider
2. Access personalized homepage with recommendations
3. Save favorite anime series to profile
4. Track watch history across episodes
5. Resume playback from where they left off
6. Manage profile settings and preferences

## Environment Setup

### Local Development
```env
# .env.local example
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Supabase Configuration
1. Create new Supabase project
2. Set up database tables according to schema
3. Configure authentication providers
4. Set up row-level security policies
5. Generate API keys for frontend/backend

## Deployment Strategy

1. **Development**: Local testing with Next.js development server
2. **Staging**: Deploy to Vercel preview environments for testing
3. **Production**: Deploy to Vercel production environment
4. **Monitoring**: Set up error tracking and analytics

## Implementation Tips

- Use server components where possible for improved performance
- Implement incremental static regeneration for anime catalog pages
- Use client components for interactive elements like the video player
- Leverage Supabase RLS (Row Level Security) for data protection
- Implement proper error handling and loading states
- Use TypeScript interfaces for all data models

## Development Workflow with Cursor AI

Ask Cursor AI to help with:
- Setting up the Supabase client and API functions
- Creating reusable UI components with proper TypeScript typing
- Implementing authentication flows with Supabase Auth
- Building the video player component with proper error handling
- Designing responsive layouts with Tailwind CSS
- Implementing state management for complex interactions
