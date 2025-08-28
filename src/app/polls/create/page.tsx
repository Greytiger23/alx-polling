// src/app/polls/create/page.tsx

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Create a New Poll</h1>
        
        <div className="space-y-6">
          {/* Poll creation form will be implemented here */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Poll Question
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter your question here"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Option 1"
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-2 text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Option 2"
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-2 text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
              </div>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                + Add Another Option
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create Poll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}