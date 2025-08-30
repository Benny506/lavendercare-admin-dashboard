
import React from 'react';

const promotions = [
	{ img: '/vite.svg', link: 'healthplus.com/flu-shots', status: 'Active' },
	{ img: '/vite.svg', link: 'healthplus.com/checkups', status: 'Active' },
	{ img: '/src/assets/banner.png', link: 'healthplus.com/mental-health', status: 'Active' },
	{ img: '/vite.svg', link: 'healthplus.com/diabetes', status: 'Active' },
	{ img: '/vite.svg', link: 'healthplus.com/pediatrics', status: 'Inactive' },
];

function Promotions() {
	return (
		<div className="w-full px-2 md:px-8 py-6">
			{/* Breadcrumbs */}
			<div className="flex items-center gap-1 mb-4">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M6.66667 14.1663H13.3333M9.18141 2.30297L3.52949 6.6989C3.15168 6.99276 2.96278 7.13968 2.82669 7.32368C2.70614 7.48667 2.61633 7.67029 2.56169 7.86551C2.5 8.0859 2.5 8.32521 2.5 8.80384V14.833C2.5 15.7664 2.5 16.2331 2.68166 16.5896C2.84144 16.9032 3.09641 17.1582 3.41002 17.318C3.76654 17.4996 4.23325 17.4996 5.16667 17.4996H14.8333C15.7668 17.4996 16.2335 17.4996 16.59 17.318C16.9036 17.1582 17.1586 16.9032 17.3183 16.5896C17.5 16.2331 17.5 15.7664 17.5 14.833V8.80384C17.5 8.32521 17.5 8.0859 17.4383 7.86551C17.3837 7.67029 17.2939 7.48667 17.1733 7.32368C17.0372 7.13968 16.8483 6.99276 16.4705 6.69891L10.8186 2.30297C10.5258 2.07526 10.3794 1.9614 10.2178 1.91763C10.0752 1.87902 9.92484 1.87902 9.78221 1.91763C9.62057 1.9614 9.47418 2.07526 9.18141 2.30297Z" stroke="#8B8B8A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
				<span className="text-xs text-gray-400">Content</span>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<g clipPath="url(#clip0_1918_35894)"><path d="M6.66656 4L5.72656 4.94L8.7799 8L5.72656 11.06L6.66656 12L10.6666 8L6.66656 4Z" fill="#8B8B8A" /></g>
					<defs><clipPath id="clip0_1918_35894"><rect width="16" height="16" fill="white" /></clipPath></defs>
				</svg>
				<span className="text-xs text-gray-400">Promotions</span>
			</div>

			<h2 className="text-xl md:text-2xl font-bold mb-2">Content Promotions</h2>

			<div className="bg-white rounded-lg shadow-sm p-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
					<div>
						<h3 className="font-semibold text-lg">All Promotion</h3>
					</div>
					<div className="flex gap-2 w-full md:w-auto">
						<input
							type="text"
							placeholder="Search doctor or mother"
							className="w-full md:w-64 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary-200)"
						/>
						<select className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700">
							<option>Filter by: All</option>
							<option>Active</option>
							<option>Inactive</option>
						</select>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="bg-gray-50">
								<th className="py-2 px-2 text-left font-medium">Banner Image</th>
								<th className="py-2 px-2 text-left font-medium">Link Destination</th>
								<th className="py-2 px-2 text-left font-medium">Status</th>
								<th className="py-2 px-2 text-left font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{promotions.map((p, idx) => (
								<tr key={p.link} className="border-b last:border-b-0 hover:bg-gray-50">
									<td className="py-2 px-2">
										<img src={p.img} alt="banner" className="w-12 h-12 rounded object-contain bg-gray-100" />
									</td>
									<td className="py-2 px-2">{p.link}</td>
									<td className="py-2 px-2">
										<span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{p.status}</span>
									</td>
									<td className="py-2 px-2 flex gap-2">
										<button title="View" className="text-(--primary-500) hover:underline">
											<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#8B8B8A" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3" stroke="#8B8B8A" strokeWidth="2"/></svg>
										</button>
										<button title="Delete" className="text-red-500 hover:underline">
											<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#F87171" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{/* Pagination */}
				<div className="flex justify-between items-center mt-4">
					<button className="text-(--primary-500) font-semibold">&larr; Previous</button>
					<div className="flex gap-1">
						{[1,2,3,'...',10].map((n, i) => (
							<button key={i} className={`px-2 py-1 rounded ${n===1 ? 'bg-(--primary-100) text-(--primary-500)' : 'text-gray-700'}`}>{n}</button>
						))}
					</div>
					<button className="text-(--primary-500) font-semibold">Next &rarr;</button>
				</div>
			</div>
		</div>
	);
}

export default Promotions;
