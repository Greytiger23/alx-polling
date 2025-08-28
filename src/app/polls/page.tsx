// src/app/polls/page.tsx

export default function PollsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">All Polls</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Poll cards will be displayed here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Poll Title Placeholder</h2>
          <p className="text-gray-600 mb-4">Created by: User</p>
          <p className="text-gray-500">10 votes • 3 options</p>
          <div className="mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              View Poll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}