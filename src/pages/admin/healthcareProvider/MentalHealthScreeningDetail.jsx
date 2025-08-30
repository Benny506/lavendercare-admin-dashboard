import React from "react";
// import { useParams, useNavigate } from "react-router-dom";

// Mock data for demonstration
const details = [
  {
    name: "Chinenye Okeke",
    risk: "High",
    age: 29,
    postpartumDay: 21,
    contact: "email@example.com",
    phone: "0801 234 5678",
    pregnancyStatus: "Postpartum",
    screeningType: "Medical Consultation",
    notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et...",
    report: "Mental Health Report",
    latest: {
      score: 24,
      interpretation: "Severe Depression",
      date: "Jul 12, 2025 – 3:15PM"
    },
    history: [
      { date: "Jul12, 2025", type: "PHQ-9", score: 24, interpretation: "Severe Depression", risk: "Medium" },
      { date: "Jun30, 2025", type: "EPDS", score: 8, interpretation: "Mild Anxiety", risk: "High" },
      { date: "Jun30, 2025", type: "PHQ-9", score: 12, interpretation: "Severe Depression", risk: "Medium" },
    ]
  },
  // ...add more mock details if needed
];

const riskColor = {
  High: "text-red-500 bg-red-50",
  Medium: "text-orange-500 bg-orange-50",
  None: "text-green-500 bg-green-50"
};

function MentalHealthScreeningDetail() {
  const d = details[0]; // For demo, always show first

  return (
    <div className="pt-6 min-h-screen flex flex-col lg:flex-row gap-6">
      {/* Left: Patient Info */}
      <div className="bg-white rounded-xl p-4 w-full max-w-xs flex-shrink-0 flex flex-col items-center lg:items-start">
        <div className="flex flex-col items-center lg:items-start w-full">
          <div className="w-20 h-20 rounded-full bg-gray-200 mb-2" />
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-lg">{d.name}</span>
            <span className="px-2 py-1 rounded text-xs font-semibold text-red-500 bg-red-50">{d.risk}</span>
          </div>
        </div>
        <div className="w-full mt-2">
          <div className="text-xs text-gray-500 mb-1">Patient Information</div>
          <div className="text-xs mb-1">Age: <span className="font-semibold">{d.age}</span></div>
          <div className="text-xs mb-1">Postpartum Day: <span className="font-semibold">{d.postpartumDay}</span></div>
          <div className="text-xs mb-1">Contact: <span className="font-semibold">{d.contact}</span></div>
          <div className="text-xs mb-1">Phone no: <span className="font-semibold">{d.phone}</span></div>
          <div className="text-xs mb-1">Pregnancy Status: <span className="font-semibold">{d.pregnancyStatus}</span></div>
          <div className="text-xs mb-1">Screening Type: <span className="font-semibold">{d.screeningType}</span></div>
        </div>
        <div className="w-full mt-4">
          <div className="text-xs text-gray-500 mb-1">Session Summary & Notes</div>
          <div className="text-xs bg-gray-50 rounded p-2 min-h-[60px]">{d.notes}</div>
        </div>
        <div className="w-full mt-4">
          <div className="text-xs text-gray-500 mb-1">Attachments & Reports</div>
          <div className="text-xs mb-2">{d.report}</div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded text-xs font-semibold w-full">Download PDF</button>
        </div>
      </div>
      {/* Right: Results */}
      <div className="flex-1 bg-white rounded-xl p-4">
        <div className="mb-6">
          <div className="font-semibold text-base mb-2">Latest Result Summary</div>
          <div className="overflow-x-auto">
            <table className="min-w-[300px] w-full text-xs">
              <tbody>
                <tr>
                  <td className="py-2 pr-4 text-gray-500 font-medium">Score</td>
                  <td className="py-2">{d.latest.score}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-gray-500 font-medium">Interpretation</td>
                  <td className="py-2">{d.latest.interpretation}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-gray-500 font-medium">Submitted on</td>
                  <td className="py-2">{d.latest.date}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="font-semibold text-base mb-2">Full Screening History Table</div>
          <div className="overflow-x-auto">
            <table className="min-w-[400px] w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-2 text-left font-semibold text-gray-500 whitespace-nowrap">Date</th>
                  <th className="py-2 px-2 text-left font-semibold text-gray-500 whitespace-nowrap">Type</th>
                  <th className="py-2 px-2 text-left font-semibold text-gray-500 whitespace-nowrap">Score</th>
                  <th className="py-2 px-2 text-left font-semibold text-gray-500 whitespace-nowrap">Interpretation</th>
                  <th className="py-2 px-2 text-left font-semibold text-gray-500 whitespace-nowrap">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {d.history.map((h, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="py-2 px-2 whitespace-nowrap">{h.date}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{h.type}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{h.score}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{h.interpretation}</td>
                    <td className="py-2 px-2 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${riskColor[h.risk]}`}>{h.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentalHealthScreeningDetail;
