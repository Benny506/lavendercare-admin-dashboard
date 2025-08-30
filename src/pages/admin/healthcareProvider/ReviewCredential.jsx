import { useState } from "react";


const providers = [
  { name: "Dr. Grace Bello", specialty: "OB-GYN", date: "25-07-11 ~3:45PM*" },
  {
    name: "Dr. Emeka Obi",
    specialty: "Maternal Mental Health",
    date: "25-07-11 ~3:45PM*",
  },
  {
    name: "Nurse Lillian James",
    specialty: "Postnatal Recovery",
    date: "25-07-11 ~3:45PM*",
  },
  {
    name: "Dr. David Okorie",
    specialty: "General Practitioner",
    date: "25-07-11 ~3:45PM*",
  },
  {
    name: "Doula Funke Adeyemi",
    specialty: "Birth & Labor Support",
    date: "25-07-11 ~3:45PM*",
  },
  {
    name: "Therapist Aisha Lawal",
    specialty: "Postpartum Therapy",
    date: "25-07-11 ~3:45PM*",
  },
  {
    name: "Dr. Chuka Nwosu",
    specialty: "Pelvic Health Specialist",
    date: "25-07-11 ~3:45PM*",
  },
];


function ReviewCredential() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleReview = (provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  return (
    <div className="pt-6 min-h-screen">
      {/* ...existing code... */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2 sm:mb-4">
        <span>Healthcare Providers</span>
        <span>›</span>
        <span className="text-purple-600 font-semibold">Review Credentials</span>
      </div>

      {/* review credentials */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Review Credentials</h2>
        <button className="bg-gray-100 px-4 py-2 rounded font-semibold text-xs flex items-center gap-2">
          Individual Providers
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path d="M4 6l4 4 4-4" stroke="#8B8B8A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/*  */}
      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div>
            <div className="font-semibold text-sm mb-1">All Healthcare Provider</div>
            <div className="text-xs text-gray-500">See all your Provider below</div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <input className="w-full border rounded px-3 py-2 text-xs" placeholder="Search" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5.5" stroke="#BDBDBD"/><path d="M11 11l3 3" stroke="#BDBDBD" strokeLinecap="round"/></svg>
              </span>
            </div>
            <button className="bg-gray-100 px-2 sm:px-3 py-2 rounded text-xs">Filter by: All</button>
          </div>
        </div>

        {/* review credentials table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">Provider Name</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">Specialty</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">Submitted On</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p, idx) => (
                <tr key={p.name} className="border-t border-gray-100">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{p.name}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{p.specialty}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">{p.date}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    <button className="bg-purple-600 text-white px-4 py-1 rounded-full text-xs w-full sm:w-auto transition hover:bg-purple-700" onClick={() => handleReview(p)}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && selectedProvider && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/80 px-2">

        {/* poup when clicked on review button */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 w-full overflow-y-auto max-w-lg mx-auto relative">
            <button className="absolute left-4 top-4 text-purple-600 font-semibold flex items-center gap-1" onClick={() => setShowModal(false)}>
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M12 16l-4-4 4-4" stroke="#8B8B8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </button>
            <div className="flex flex-col items-center mt-8 mb-4">
              <div className="bg-purple-100 rounded-full p-4 mb-2">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="16" fill="#E9D5FF"/><path d="M10 22V10h12v12H10zm2-2h8V12h-8v8zm2-4h4v2h-4v-2z" fill="#8B5CF6"/></svg>
              </div>
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-16 h-16 rounded-full mb-2" />
              <div className="font-semibold text-lg">{selectedProvider.name}</div>
              <div className="text-xs text-gray-500 mb-2">{selectedProvider.specialty}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-sm mb-1">Info</div>
              <div className="text-xs text-gray-500">Email: user@example.com</div>
              <div className="text-xs text-gray-500">Phone Number: +2348103828928</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-sm mb-2">Credential Document</div>
              <div className="space-y-3">
                {[1, 2].map((doc) => (
                  <div key={doc} className="border rounded-xl p-3 flex items-center gap-3 justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs">
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect width="20" height="20" rx="6" fill="#E9D5FF"/><path d="M7 15V5h6v10H7zm1-1h4V6H8v8zm1-4h2v2h-2v-2z" fill="#8B5CF6"/></svg>
                        Document {doc}
                      </div>
                      <div className="text-xs text-gray-400">200 KB</div>
                      <a href="#" className="text-xs text-purple-600 underline">View</a>
                    </div>
                    <input type="checkbox" className="w-5 h-5 accent-purple-600 rounded" checked={doc === 1} readOnly />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <button className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold w-full sm:w-1/2">Reject</button>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold w-full sm:w-1/2">Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewCredential;
