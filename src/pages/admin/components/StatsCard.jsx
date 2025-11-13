export default function StatCard({ title, value, icon, bg, color }) {
  return (
    <div className={`flex items-center bg-white rounded-xl shadow-sm p-5`}>
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full ${bg} ${color} mr-4`}
      >
        <i className={`bi ${icon} text-lg`}></i>
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h4 className="text-xl font-semibold text-gray-900 font-playfair">{value}</h4>
      </div>
    </div>
  );
}
