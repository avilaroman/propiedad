# PropVista - Minimalist Property Management

[cloudflarebutton]

PropVista is a visually stunning and minimalist web application designed for property owners and managers to effortlessly oversee their real-estate portfolio. The application provides a clean, intuitive dashboard with key performance indicators, a comprehensive property list with advanced filtering and sorting, and an elegant interface for adding and editing property details. Inspired by modern real estate platforms, PropVista focuses on clarity, user experience, and visual excellence, leveraging a sophisticated design system built with shadcn/ui and Tailwind CSS. The backend is powered by Cloudflare Workers and a Durable Object, ensuring high performance and scalability.

## Key Features

- **At-a-Glance Dashboard**: A clean overview of your portfolio with key stats like total properties, occupancy rates, and total value.
- **Comprehensive Property List**: A powerful data table to view, sort, and filter all your properties.
- **Seamless CRUD Operations**: Create, read, update, and delete properties through an elegant slide-out form.
- **Minimalist & Responsive UI**: A beautiful, uncluttered interface that works flawlessly on all devices.
- **High-Performance Backend**: Built on Cloudflare Workers and Durable Objects for a fast and scalable experience.
- **Modern Tech Stack**: Leverages the best of the modern web ecosystem for a robust and maintainable application.

## Technology Stack

### Frontend

- **Framework**: React
- **Routing**: React Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod for validation
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React

### Backend

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Storage**: Cloudflare Durable Objects

### Tooling

- **Build Tool**: Vite
- **Language**: TypeScript
- **Package Manager**: Bun

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Bun](https://bun.sh/) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd propvista_property_manager
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Running in Development Mode

To start the development server for both the frontend and the Cloudflare Worker, run:

```bash
bun run dev
```

This will start the Vite development server for the React application and the Wrangler development server for the backend worker, enabling live-reloading and seamless development.

## Deployment

This project is configured for easy deployment to Cloudflare Pages.

1.  **Build the project:**
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Make sure you have the Wrangler CLI installed and configured. Then, run the deploy command:
    ```bash
    bun run deploy
    ```
    This command will build the application and deploy it to your Cloudflare account.

Alternatively, you can deploy directly from your GitHub repository using the button below.

[cloudflarebutton]

## Project Structure

-   `src/`: Contains the frontend React application code.
    -   `components/`: Shared UI components.
    -   `pages/`: Application views/pages.
    -   `lib/`: Utility functions and API client.
    -   `hooks/`: Custom React hooks.
-   `worker/`: Contains the backend Cloudflare Worker code built with Hono.
    -   `index.ts`: The main entry point for the worker.
    -   `user-routes.ts`: Where API routes are defined.
    -   `entities.ts`: Defines the data models and their interaction with Durable Objects.
-   `shared/`: Contains TypeScript types and data shared between the frontend and backend.

## License

This project is licensed under the MIT License.