// src/app/page.tsx


import Link from 'next/link';

const polls = [
  {
    title: 'Favorite Programming Language',
    description: 'What programming language do you prefer to use?',
    options: 5,
    votes: 42,
    created: '10/15/2023',
  },
  {
    title: 'Best Frontend Framework',
    description: 'Which frontend framework do you think is the best?',
    options: 4,
    votes: 38,
    created: '10/10/2023',
  },
  {
    title: 'Preferred Database',
    description: 'What database do you prefer to work with?',
    options: 5,
    votes: 27,
    created: '10/5/2023',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header */}
      <header className="w-full border-b bg-white px-8 py-4 flex items-center justify-between ">
        <div className="font-bold text-xl">ALX Polly</div>
        <nav className="flex items-center space-x-8">
          <Link href="/polls" className="text-gray-700 font-medium hover:text-black">My Polls</Link>
          <Link href="/polls/create" className="text-gray-700 font-medium hover:text-black">Create Poll</Link>
        </nav>
        <div className="flex items-center space-x-2">
          <button className="hidden md:block px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition">Create Poll</button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 border"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Polls</h1>
          <button className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition">Create New Poll</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {polls.map((poll, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <div className="text-lg font-semibold mb-1">{poll.title}</div>
              <div className="text-gray-600 mb-4">{poll.description}</div>
              <div className="text-sm text-gray-500 mb-1">{poll.options} options</div>
              <div className="text-sm text-gray-500 mb-1">{poll.votes} total votes</div>
              <div className="text-xs text-gray-400 mt-4">Created on {poll.created}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-4 text-center text-gray-400 text-sm mt-auto">
      </footer>
    </div>
  );
}