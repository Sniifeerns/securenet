import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <style>{`
        :root {
          --background: 0 0% 4%;
          --foreground: 0 0% 95%;
          --card: 0 0% 7%;
          --card-foreground: 0 0% 95%;
          --popover: 0 0% 7%;
          --popover-foreground: 0 0% 95%;
          --primary: 199 89% 48%;
          --primary-foreground: 0 0% 100%;
          --secondary: 270 50% 40%;
          --secondary-foreground: 0 0% 95%;
          --muted: 0 0% 15%;
          --muted-foreground: 0 0% 65%;
          --accent: 199 89% 48%;
          --accent-foreground: 0 0% 100%;
          --destructive: 0 84% 60%;
          --destructive-foreground: 0 0% 100%;
          --border: 0 0% 15%;
          --input: 0 0% 15%;
          --ring: 199 89% 48%;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: #1e293b #0a0a0f;
        }

        *::-webkit-scrollbar {
          width: 8px;
        }

        *::-webkit-scrollbar-track {
          background: #0a0a0f;
        }

        *::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 4px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }

        html {
          scroll-behavior: smooth;
        }

        ::selection {
          background: rgba(14, 165, 233, 0.3);
          color: white;
        }
      `}</style>
      {children}
    </div>
  );
}