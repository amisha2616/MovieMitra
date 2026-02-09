# MovieMitra

MovieMitra is a movie discovery web application built using React and Vite. It allows users to search for movies, view trending movies, and explore detailed information about each movie, including cast, trailers, reviews, and similar movies. The app fetches data from The Movie Database (TMDb) API and provides a seamless user experience with debounced search, dynamic content updates, and AI-powered insights.

## Features

- **Movie Search**: Users can search for movies using a debounced search bar that fetches results efficiently.
- **Trending Movies**: Displays a list of trending movies fetched from a backend service.
- **Movie Details**: Clicking on a movie opens a detailed view with information like:
  - Overview, runtime, release date, and ratings
  - Cast and crew details
  - Trailers and videos
  - Similar movies and reviews
- **Actor Discovery**: Comprehensive actor profiles featuring:
  - Detailed biography and personal information
  - Complete filmography with movies and TV shows
  - Social media integration (Instagram, Twitter, Facebook, IMDb)
  - Photo galleries and career highlights
  - Popularity metrics and career statistics
- **AI-Powered Insights**: Intelligent movie and actor summaries powered by Cerebras AI that provide:
  - Creative movie recommendations with bold one-liners
  - Thematic analysis and statistical performance insights
  - Personalized actor career summaries and recommendations
  - Smart analysis that adapts to ratings, popularity, and career trajectory
  - Dynamic, engaging content with markdown formatting and visual effects
- **Optimized Fetching**: Uses caching and debounced search to reduce unnecessary API calls.
- **User Analytics**: Tracks search queries to analyze popular searches (powered by Appwrite backend).

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Appwrite (for tracking search trends)
- **API**: The Movie Database (TMDb)
- **AI Integration**: Cerebras Cloud SDK with Llama 3.1-8B model
- **Content Processing**: Marked.js for markdown parsing, DOMPurify for sanitization
- **Deployment**: Vercel

## Installation

To run this project locally, follow these steps:

### Prerequisites

- Node.js and npm installed
- TMDb API Read Access Token
- Cerebras API Key

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/MovieMitra.git
   cd MovieMitra
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add your API keys:
   ```sh
   VITE_API_READ_ACCESS_TOKEN=your_tmdb_api_token_here
   VITE_CEREBRAS_API_KEY=your_cerebras_api_key_here
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

## Key Components

### Actor Discovery System

- **ActorCard Component**: Interactive cards displaying actor profiles with popularity scores and known works
- **ActorDetail Component**: Comprehensive actor profiles featuring:
  - Detailed biography and personal information (birth date, place of birth, age calculation)
  - Complete filmography sorted by popularity (movies and TV shows separately)
  - Social media integration with direct links to Instagram, Twitter, Facebook, and IMDb
  - Photo galleries with hover effects and responsive layouts
  - AI-powered career insights and recommendations
  - Real-time data fetching from TMDb API for credits, images, and social media info

## AI Features

The MovieMitra AI Insight feature provides intelligent analysis of movies and actors:

### Movie Summaries

- **Smart Recommendations**: AI generates personalized recommendations based on ratings (harsh for low-rated films, enthusiastic for high-rated ones)
- **Creative Analysis**: Provides imaginative takes on movie themes and storytelling
- **Statistical Insights**: Brief performance analysis including budget, revenue, and popularity metrics
- **Indirect Recommendations**: Subtle but clear guidance on whether a movie is worth watching

### Actor Summaries

- **Career Analysis**: Intelligent assessment of an actor's career trajectory and acting style
- **Performance Insights**: Analysis of popularity, notable roles, and career highlights
- **Biography Integration**: Works with comprehensive actor profiles including personal details, filmography, and social media presence
- **Recommendation Engine**: Indirect suggestions on whether to explore more of an actor's work

### Technical Implementation

- **Streaming Responses**: Real-time AI-generated content with smooth loading animations
- **Error Handling**: Graceful fallbacks when AI services are unavailable
- **Responsive Design**: Optimized for all device sizes with engaging visual effects
- **Performance Optimized**: Efficient API calls with proper caching and state management

## Deployment

To deploy on Vercel:

1. Push your code to GitHub.
2. Connect the repository to Vercel.
3. Set environment variables in Vercel (including both TMDb and Cerebras API keys).
4. Deploy and share the link.

## Environment Variables

The following environment variables are required:

- `VITE_API_READ_ACCESS_TOKEN`: Your TMDb API Read Access Token
- `VITE_CEREBRAS_API_KEY`: Your Cerebras API Key for AI features

## License

This project is licensed under the MIT License.

## Contributions

Contributions are always welcome!
