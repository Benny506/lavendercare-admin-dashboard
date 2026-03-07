import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { FaArrowLeft, FaCalendarAlt, FaMousePointer, FaEye, FaGlobe, FaMapMarkerAlt, FaChartBar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import supabase from '../../../../database/dbInit';
import { appLoadStart, appLoadStop } from '../../../../redux/slices/appLoadingSlice';
import PathHeader from '../../components/PathHeader';
import AdPreview from './components/AdPreview';

const COLORS = ['#6F3DCB', '#F9C0AB', '#4CAEA0', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

export default function AdAnalytics() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ad, setAd] = useState(null);
    const [events, setEvents] = useState([]);
    const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, all

    useEffect(() => {
        if (id) fetchAdData();
    }, [id, timeRange]);

    const fetchAdData = async () => {
        try {
            dispatch(appLoadStart());

            // Fetch Ad Details
            const { data: adData, error: adError } = await supabase
                .from('ads')
                .select('*')
                .eq('id', id)
                .single();

            if (adError) throw adError;
            setAd(adData);

            // Fetch Events
            let query = supabase
                .from('ad_events')
                .select('*')
                .eq('ad_id', id)
                .order('created_at', { ascending: true });

            const now = new Date();
            if (timeRange === '7d') {
                const date = new Date(now.setDate(now.getDate() - 7));
                query = query.gte('created_at', date.toISOString());
            } else if (timeRange === '30d') {
                const date = new Date(now.setDate(now.getDate() - 30));
                query = query.gte('created_at', date.toISOString());
            } else if (timeRange === '90d') {
                const date = new Date(now.setDate(now.getDate() - 90));
                query = query.gte('created_at', date.toISOString());
            }

            const { data: eventData, error: eventError } = await query;

            if (eventError) throw eventError;
            setEvents(eventData || []);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load analytics data");
        } finally {
            dispatch(appLoadStop());
        }
    };

    // --- Process Data for Charts ---

    // 1. Impressions vs Clicks Over Time
    const timeSeriesData = useMemo(() => {
        const map = {};
        events.forEach(e => {
            const date = new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!map[date]) map[date] = { date, impression: 0, click: 0 };
            if (e.event_type === 'impression') map[date].impression++;
            if (e.event_type === 'click') map[date].click++;
        });
        return Object.values(map);
    }, [events]);

    // 2. Events by Country
    const countryData = useMemo(() => {
        const map = {};
        events.forEach(e => {
            const country = e.country || 'Unknown';
            if (!map[country]) map[country] = { name: country, value: 0 };
            map[country].value++;
        });
        return Object.values(map).sort((a, b) => b.value - a.value).slice(0, 8);
    }, [events]);

    // 3. Events by City
    const cityData = useMemo(() => {
        const map = {};
        events.forEach(e => {
            const city = e.city || 'Unknown';
            if (!map[city]) map[city] = { name: city, value: 0 };
            map[city].value++;
        });
        return Object.values(map).sort((a, b) => b.value - a.value).slice(0, 10);
    }, [events]);

    // 4. CTR (Click Through Rate)
    const ctr = useMemo(() => {
        const imps = events.filter(e => e.event_type === 'impression').length;
        const clicks = events.filter(e => e.event_type === 'click').length;
        if (!imps) return 0;
        return ((clicks / imps) * 100).toFixed(2);
    }, [events]);

    // 5. Device/Platform (simulated since schema doesn't have it explicitly, but we can assume mostly mobile app)
    // For now we'll stick to real data from the schema.

    // 6. User Engagement Distribution (Clicks vs Impressions pie)
    const engagementPie = useMemo(() => {
        const imps = events.filter(e => e.event_type === 'impression').length;
        const clicks = events.filter(e => e.event_type === 'click').length;
        return [
            { name: 'Impressions', value: imps },
            { name: 'Clicks', value: clicks }
        ];
    }, [events]);

    const normalizeAd = (ad) => {
        if (!ad) return {};
        const destination_type = ad?.destination_type
            || (ad?.product_id ? 'product' : ad?.service_id ? 'service' : ad?.external_link ? 'external' : 'informative');
        return {
            ...ad,
            destination_type,
            color_tone: ad?.color_tone || '#6F3DCB',
        };
    };

    if (!ad) return null;

    return (
        <div className="pt-6 w-full flex flex-col pb-20">
            <PathHeader
                paths={[
                    { type: 'link', text: 'Ads', path: -1 },
                    { type: 'text', text: 'Analytics' },
                ]}
            />

            <div className="flex justify-end items-center mb-6 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
                    {['7d', '30d', '90d', 'all'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${timeRange === range
                                    ? 'bg-[#6F3DCB] text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {range === 'all' ? 'All Time' : `Last ${range.replace('d', ' Days')}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-[#6F3DCB]">
                        <FaEye size={20} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Impressions</p>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {events.filter(e => e.event_type === 'impression').length}
                        </h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#F9C0AB]">
                        <FaMousePointer size={20} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Clicks</p>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {events.filter(e => e.event_type === 'click').length}
                        </h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#4CAEA0]">
                        <FaChartBar size={20} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Click Through Rate</p>
                        <h3 className="text-2xl font-bold text-gray-800">{ctr}%</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <FaGlobe size={20} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Top Country</p>
                        <h3 className="text-2xl font-bold text-gray-800 truncate max-w-[140px]">
                            {countryData[0]?.name || 'N/A'}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Time Series Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        Performance Over Time
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timeSeriesData}>
                                <defs>
                                    <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6F3DCB" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6F3DCB" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F9C0AB" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F9C0AB" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#6F3DCB', strokeWidth: 1, strokeDasharray: '5 5' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Area type="monotone" dataKey="impression" name="Impressions" stroke="#6F3DCB" strokeWidth={3} fillOpacity={1} fill="url(#colorImp)" />
                                <Area type="monotone" dataKey="click" name="Clicks" stroke="#F9C0AB" strokeWidth={3} fillOpacity={1} fill="url(#colorClick)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Engagement Pie */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Engagement Split</h3>
                    <div className="h-[350px] w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={engagementPie}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {engagementPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" verticalAlign="bottom" align="center" />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
                            <span className="text-3xl font-bold text-gray-800">{ctr}%</span>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">CTR</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Geographic Distribution (Country) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaGlobe className="text-gray-400" />
                        Top Countries
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={countryData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="value" name="Events" fill="#6F3DCB" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Geographic Distribution (City) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        Top Cities
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={cityData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="value" name="Events" fill="#F9C0AB" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Ad Preview Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-6 border-b pb-4">Ad Creative Preview</h3>
                <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="w-full max-w-sm mx-auto md:mx-0 shadow-2xl rounded-[3rem] overflow-hidden border-8 border-gray-900 bg-gray-900">
                        <div className="bg-white h-full min-h-[600px] relative">
                            {/* Status Bar Fake */}
                            <div className="h-7 bg-black w-full absolute top-0 z-20 flex justify-between px-6 items-center">
                                <span className="text-white text-[10px] font-bold">9:41</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                                    <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                                </div>
                            </div>
                            <div className="pt-10 pb-4 h-full overflow-y-auto hide-scrollbar">
                                <AdPreview data={normalizeAd(ad)} />
                            </div>
                            {/* Home Bar Fake */}
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full z-20"></div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</span>
                                <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-sm font-bold ${ad.is_paused ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {ad.is_paused ? 'Paused' : 'Active'}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Created At</span>
                                <p className="text-gray-800 font-medium mt-1">
                                    {new Date(ad.created_at).toLocaleDateString('en-US', {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl sm:col-span-2">
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Description</span>
                                <p className="text-gray-800 mt-2 leading-relaxed">{ad.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
