# Meme Vault - GoFundMeme App Builder

Meme Vault is a simple meme sharing platform built on the GoFundMeme (GFM) ecosystem. Users can upload and share memes, and earn tokens based on interactions (likes) that their memes receive.

## Project Overview

Meme Vault is a front-end focused application with minimal serverless backend integration for handling token minting operations through the GFM SDK.

### Key Features

- Simple, user-friendly interface for sharing and viewing memes
- Like functionality to interact with posted memes
- Integration with GFM SDK for token minting based on meme interactions
- Fully responsive design

### Technology Stack

- **Frontend**: React (Vite)
- **Backend**: Netlify Functions (Serverless)
- **Styling**: Custom CSS
- **Token Integration**: GoFundMeme SDK

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn
- Netlify CLI (for local development with serverless functions)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd meme-vault
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server with Netlify Functions:
   ```
   npm run netlify
   ```

The application will be available at http://localhost:8888 with the Netlify Functions accessible at `/.netlify/functions/`.

## Development

### Project Structure

- `src/` - React application source code
- `netlify/functions/` - Serverless functions for backend operations
- `public/` - Static assets

### Available Scripts

- `npm run dev` - Run Vite development server only (without serverless functions)
- `npm run netlify` - Run full development environment with Netlify Functions
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## Deployment

This project can be deployed on Netlify:

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect the repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

## GFM SDK Integration

The application uses a simulated version of the GFM SDK for demonstration purposes. In a production environment, you would:

1. Install the actual GFM SDK:
   ```
   npm install gfm-sdk
   ```

2. Configure environment variables for the GFM SDK:
   - Create a `.env` file with your GFM credentials
   - Add environment variables to your Netlify deployment

## License

This project is licensed under the MIT License.
