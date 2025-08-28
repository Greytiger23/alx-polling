// src/app/polls/[id]/page.tsx

export default function PollDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-4">Poll Title Placeholder</h1>
        <p className="text-gray-600 mb-6">Created by: User • Created at: Date</p>
        
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Options</h2>
          {/* Poll options will be displayed here */}
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between items-center">
              <span>Option 1</span>
              <span className="text-blue-600 font-medium">0 votes (0%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>
          {/* Voting form will be implemented here */}
          <p className="text-gray-500">Voting form placeholder</p>
        </div>
      </div>
    </div>
  );
}