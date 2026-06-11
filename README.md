# imAIger 🎨

A modern AI-powered image manipulation platform that combines multiple AI services to provide image generation, background removal, upscaling, and intelligent image analysis capabilities.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)

## ✨ Features

- **🎨 AI Image Generation**: Create stunning images from text prompts using advanced AI models
- **🖼️ Background Removal**: Remove backgrounds from images with AI precision
- **📈 Image Upscaling**: Enhance image resolution while maintaining quality
- **🔍 Image Analysis**: Get detailed AI-powered insights about your images
- **🎙️ Voice Input**: Use voice commands to generate images (hands-free experience)
- **📜 History Tracking**: Keep track of all your image operations and results
- **🎮 Interactive Playground**: Experiment with various AI image tools in one place

## 🏗️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5 with App Router
- **UI Library**: React 19.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **Animations**: Motion (Framer Motion)
- **3D Graphics**: OGL (WebGL library)

### Backend

- **Runtime**: Node.js with Express 5.x
- **AI Services**:
  - Google AI Studio (Imagen 3 — image generation)
  - Google Gemini AI (image analysis & AI interpretation)
  - Cloudflare Workers AI (Flux Schnell — image generation)
  - OpenAI
  - Hugging Face
  - Picsart API
- **Image Processing**: Sharp
- **File Upload**: Multer
- **Storage**: ImageKit

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**

You'll also need API keys for:

- Google Gemini AI
- OpenAI (optional)
- Hugging Face (optional)
- Picsart API (optional)
- ImageKit

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YuSuBH/imAIger.git
cd imAIger
```

### 2. Install Dependencies

#### Install Server Dependencies

```bash
cd server
npm install
```

#### Install Web Dependencies

```bash
cd ../web
npm install
```

### 3. Environment Configuration

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3001

# Google Gemini AI (used for image analysis, AI interpretation, and Imagen 3 image generation)
GOOGLE_API_KEY=your_google_api_key_here

# Cloudflare Workers AI (https://dash.cloudflare.com/profile/api-tokens)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_api_key_here

# Hugging Face (Optional)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Picsart API (Optional)
PICSART_API_KEY=your_picsart_api_key_here

# Remove.bg (for background removal)
REMOVE_BG_API_KEY=your_remove_bg_api_key_here

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

#### Web Environment Variables (Optional)

Create a `.env.local` file in the `web` directory if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Run the Development Servers

#### Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:3001`

#### Start the Frontend (in a new terminal)

```bash
cd web
npm run dev
```

The web app will run on `http://localhost:3000`

### 5. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action!

## 📁 Project Structure

```
imAIger/
├── server/                 # Backend Express server
│   ├── src/
│   │   ├── server.js      # Main server file
│   │   └── routes/        # API route handlers
│   │       ├── analyze.js     # Image analysis endpoint
│   │       ├── bgRemove.js    # Background removal endpoint
│   │       ├── generate.js    # Image generation endpoint
│   │       ├── interpret.js   # AI interpretation endpoint
│   │       └── upscale.js     # Image upscaling endpoint
│   └── package.json
│
├── web/                   # Next.js frontend
│   ├── app/              # App router pages
│   │   ├── analyze/      # Image analysis page
│   │   ├── bgRemove/     # Background removal page
│   │   ├── generate/     # Image generation page
│   │   ├── history/      # History page
│   │   ├── playGround/   # Interactive playground
│   │   └── upscale/      # Image upscaling page
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── package.json
│
└── README.md
```

## 🎯 Usage

### Image Generation

1. Navigate to the **Generate** page
2. Enter a text prompt describing the image you want
3. Optionally use voice input by clicking the microphone icon
4. Click "Generate" and watch the AI create your image

### Background Removal

1. Go to the **Background Remove** page
2. Upload an image
3. Click "Remove Background"
4. Download the processed image

### Image Upscaling

1. Visit the **Upscale** page
2. Upload an image
3. Select upscaling options
4. Click "Upscale" to enhance the image

### Image Analysis

1. Navigate to the **Analyze** page
2. Upload an image
3. Get AI-powered insights and descriptions

### Playground

- Experiment with all features in one interactive space
- Switch between different AI tools seamlessly
- View and manage your operation history

## 🛠️ Development

### Build for Production

#### Build Backend

```bash
cd server
# Backend runs directly with Node.js (no build step needed)
```

#### Build Frontend

```bash
cd web
npm run build
npm start
```

### Linting

```bash
cd web
npm run lint
```

## 📝 API Endpoints

| Endpoint     | Method | Description                                         |
| ------------ | ------ | --------------------------------------------------- |
| `/generate`  | POST   | Generate images from text prompts (multi-provider)  |
| `/bgRemove`  | POST   | Remove background from images                       |
| `/upscale`   | POST   | Upscale image resolution                            |
| `/analyze`   | POST   | Analyze image content                               |
| `/interpret` | POST   | Get AI interpretation of images                     |

### `/generate` Request Body

```json
{
  "prompt": "A futuristic city at sunset",
  "provider": "google" 
}
```

- `provider`: Optional provider name (defaults to `"cloudflare"`).
- Response: `{ imageUrl: "data:image/jpeg;base64,...", prompt, provider: "cloudflare" }`

## 🏛️ Provider Architecture

Image generation is handled by a dedicated service inside `server/src/routes/generate.js`:

| Provider | Model | Notes |
|---|---|---|
| `cloudflare` | Flux Schnell (`@cf/black-forest-labs/flux-1-schnell`) | Uses `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_TOKEN` |

To add a new provider in the future:
1. Add a `generateWithXxx(prompt)` function in `generate.js`
2. Add `"xxx"` to the `validProviders` array
3. Dispatch to it in the `if/else` block
4. Add `"xxx"` to the `ImageProvider` union type in `web/hooks/useImageOperations.ts`
5. Add a new entry to the `PROVIDERS` array in `web/components/ProviderSelector.tsx`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**YuSuBH**

- GitHub: [@YuSuBH](https://github.com/YuSuBH)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Google AI Studio](https://ai.google.dev/) - Imagen 3 image generation
- [Google Gemini AI](https://ai.google.dev/) - AI analysis & interpretation
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) - Flux Schnell image generation
- [Picsart API](https://picsart.io/) - Image manipulation services
- [ImageKit](https://imagekit.io/) - Image storage and delivery
- [Hugging Face](https://huggingface.co/) - AI models and inference

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

Made with ❤️ by YuSuBH
