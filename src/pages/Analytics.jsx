import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.js";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

const STATUS_COLORS_MAP = {
    "Applied": "#6366f1",
    "OA": "#f59e0b",
    "Interview Round 1": "#8b5cf6",
    "Interview Round 2": "#7c3aed",
    "HR Round": "#a855f7",
    "Offer": "#10b981",
    "Rejected": "#ef4444",
};

export default function Analytics() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axiosInstance.get("/analytics/dashboard");
            setStats(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch analytics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading analytics...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-red-400 text-sm">{error}</p>
        </div>
    );

    // prepare pie chart data
    const pieData = Object.entries(stats.byStatus || {}).map(([name, value]) => ({
        name,
        value
    }));

    // prepare bar chart data
    const barData = stats.monthlyTrend || [];

    return (
        <div className="min-h-screen bg-gray-950">

            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
                        >
                            ← Back
                        </button>
                        <h1 className="text-indigo-400 font-bold text-xl">TrackIt</h1>
                    </div>
                    <span className="text-gray-500 text-sm">Analytics</span>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: "Total Applications",
                            value: stats.totalApplications,
                            color: "text-gray-100"
                        },
                        {
                            label: "Offers",
                            value: stats.byStatus?.["Offer"] || 0,
                            color: "text-emerald-400"
                        },
                        {
                            label: "Success Rate",
                            value: `${stats.successRate}%`,
                            color: "text-indigo-400"
                        },
                        {
                            label: "Avg Days to Response",
                            value: stats.averageDaysToResponse || "—",
                            color: "text-amber-400"
                        },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                    {/* Pie Chart — Status Distribution */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-gray-100 font-semibold mb-6">Applications by Status</h2>

                        {pieData.length === 0 ? (
                            <p className="text-gray-500 text-sm">No data yet.</p>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={STATUS_COLORS_MAP[entry.name] || "#6366f1"}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#111827",
                                                border: "1px solid #1f2937",
                                                borderRadius: "8px",
                                                color: "#f3f4f6"
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* Legend */}
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {pieData.map((entry) => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: STATUS_COLORS_MAP[entry.name] || "#6366f1" }}
                                            />
                                            <span className="text-gray-400 text-xs">{entry.name}</span>
                                            <span className="text-gray-300 text-xs font-medium ml-auto">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bar Chart — Monthly Trend */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-gray-100 font-semibold mb-6">Monthly Applications</h2>

                        {barData.length === 0 ? (
                            <p className="text-gray-500 text-sm">No data yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                        axisLine={{ stroke: "#1f2937" }}
                                    />
                                    <YAxis
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                        axisLine={{ stroke: "#1f2937" }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#111827",
                                            border: "1px solid #1f2937",
                                            borderRadius: "8px",
                                            color: "#f3f4f6"
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Applications" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Weekly Trend */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-gray-100 font-semibold mb-6">Weekly Trend</h2>

                    {stats.weeklyTrend?.length === 0 ? (
                        <p className="text-gray-500 text-sm">No data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={stats.weeklyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                <XAxis
                                    dataKey="week"
                                    tick={{ fill: "#6b7280", fontSize: 11 }}
                                    axisLine={{ stroke: "#1f2937" }}
                                />
                                <YAxis
                                    tick={{ fill: "#6b7280", fontSize: 12 }}
                                    axisLine={{ stroke: "#1f2937" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#111827",
                                        border: "1px solid #1f2937",
                                        borderRadius: "8px",
                                        color: "#f3f4f6"
                                    }}
                                />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Applications" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}