import { HeadContent, Outlet, Scripts, createRootRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "palantir" },
      { name: "theme-color", content: "#ffffff" },
      { name: "description", content: "agent-first knowledge corpus" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-paper text-ink">
        <PreviewHostBridge />
        <AuthProvider>
          <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 pb-16 pt-6 sm:px-6">
            <header className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
              <Link
                to="/"
                className="font-mono text-sm font-medium tracking-widest text-ink lowercase no-underline"
              >
                palantir
              </Link>
              <nav className="flex flex-wrap gap-1">
                <NavLink to="/">entries</NavLink>
                <NavLink to="/topics">topics</NavLink>
                <NavLink to="/new">new</NavLink>
                <a
                  href="/api/v1"
                  className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft lowercase no-underline transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  api
                </a>
                <a
                  href="/llms.txt"
                  className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft lowercase no-underline transition-colors hover:bg-paper-2 hover:text-ink"
                >
                  llms.txt
                </a>
              </nav>
            </header>
            <Outlet />
          </div>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft lowercase no-underline transition-colors hover:bg-paper-2 hover:text-ink [&.active]:bg-ink [&.active]:text-paper"
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}
