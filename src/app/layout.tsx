// src/app/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">ALX Polling App</h1>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
                </li>
                <li>
                  <a href="/polls" className="text-gray-600 hover:text-blue-600">Polls</a>
                </li>
                <li>
                  <a href="/polls/create" className="text-gray-600 hover:text-blue-600">Create Poll</a>
                </li>
                <li>
                  <a href="/auth/login" className="text-gray-600 hover:text-blue-600">Login</a>
                </li>
                <li>
                  <a href="/auth/register" className="text-gray-600 hover:text-blue-600">Register</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-100 mt-12">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-gray-600">&copy; {new Date().getFullYear()} ALX Polling App</p>
          </div>
        </footer>
      </body>
    </html>
  );
}