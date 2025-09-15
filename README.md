# Kickback Collective

Your real-time football chat and insights hub - a Base Mini App for football fans to share live match insights and banter.

## Features

- **Live Match Chat & Banter**: Real-time, topic-specific chat rooms for ongoing football matches
- **User-Generated Match Insights**: Fans can share quick insights, tactical observations, and funny takes
- **Themed Discussion Forums**: Dedicated sections for deeper discussions on tactics, transfers, and team news
- **Fan-to-Fan Networking**: Follow other fans, build profiles, and connect based on shared football allegiances

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Base network integration via MiniKit and OnchainKit
- **TypeScript**: Full type safety throughout the application
- **Components**: Modular, reusable React components

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kickback-collective
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   - `NEXT_PUBLIC_MINIKIT_API_KEY`: Your MiniKit API key
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # MiniKit and OnchainKit providers
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── AppShell.tsx       # Main app layout
│   ├── MatchChatFeed.tsx  # Live match chat interface
│   ├── UpcomingTopics.tsx # Sidebar with topics and matches
│   ├── UserAvatar.tsx     # User avatar component
│   ├── InsightCard.tsx    # Post/insight display component
│   └── PrimaryButton.tsx  # Primary button component
├── lib/                   # Utilities and types
│   ├── types.ts           # TypeScript type definitions
│   ├── utils.ts           # Utility functions
│   └── mockData.ts        # Mock data for development
└── public/                # Static assets
```

## Key Components

### AppShell
Main application layout with navigation, header, and sidebar structure.

### MatchChatFeed
Real-time chat interface for live match discussions with post creation and interaction features.

### UpcomingTopics
Sidebar component showing trending topics, upcoming matches, and live match information.

### UserAvatar
Reusable avatar component with multiple size variants and fallback support.

### InsightCard
Displays user posts and insights with engagement metrics and interaction buttons.

## Design System

The app uses a custom design system built on Tailwind CSS with:

- **Colors**: Dark theme with accent colors for football-focused UI
- **Typography**: Clear hierarchy with readable fonts
- **Spacing**: Consistent spacing scale (8px, 12px, 20px)
- **Animations**: Smooth transitions with cubic-bezier easing
- **Components**: Modular, reusable components with variants

## Base Mini App Integration

This app is built as a Base Mini App using:

- **MiniKit**: For Base network integration and wallet connectivity
- **OnchainKit**: For blockchain interactions and identity management
- **Frame Support**: Optimized for Farcaster frame interactions
- **Mobile-First**: Responsive design optimized for mobile usage

## Development

### Adding New Features

1. Create new components in the `components/` directory
2. Add TypeScript types to `lib/types.ts`
3. Update mock data in `lib/mockData.ts` for development
4. Follow the existing component patterns and design system

### Styling Guidelines

- Use Tailwind CSS classes with the custom design tokens
- Follow mobile-first responsive design principles
- Maintain consistent spacing and typography
- Use the defined color palette for brand consistency

## Deployment

The app is optimized for deployment on Vercel or similar platforms that support Next.js 15.

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel: Connect your repository for automatic deployments
   - Other platforms: Follow their Next.js deployment guides

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the existing patterns
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
