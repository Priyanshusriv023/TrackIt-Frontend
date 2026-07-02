import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import axiosInstance from "../api/axios.js";

const STATUS_COLORS = {
    "Applied": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "OA": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Interview Round 1": "bg-violet-500/10 text-violet-400 border-violet-500/20",
    "Interview Round 2": "bg-violet-500/10 text-violet-400 border-violet-500/20",
    "HR Round": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Offer": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Rejected": "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_OPTIONS = ["Applied", "OA", "Interview Round 1", "Interview Round 2", "HR Round", "Offer", "Rejected"];

// Add Application Modal
const AddApplicationModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        companyName: "",
        role: "",
        currentStatus: "Applied",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axiosInstance.post("/applications", formData);
            onAdd(res.data.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-gray-100">Add Application</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Company Name *</label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            placeholder="Google"
                            required
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Role *</label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            placeholder="SDE Intern"
                            required
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Status</label>
                        <select
                            value={formData.currentStatus}
                            onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                        >
                            {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg py-2.5 text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                        >
                            {loading ? "Adding..." : "Add Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Application Card
const ApplicationCard = ({ application, onStatusChange, onClick }) => {
    const [updating, setUpdating] = useState(false);

    const handleStatusChange = async (e) => {
        e.stopPropagation();
        const newStatus = e.target.value;
        setUpdating(true);
        try {
            await axiosInstance.patch(`/applications/${application._id}`, {
                currentStatus: newStatus
            });
            onStatusChange(application._id, newStatus);
        } catch (err) {
            console.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div
            onClick={() => onClick(application._id)}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-gray-700 hover:bg-gray-900/80 transition-all"
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-gray-100 font-medium">{application.companyName}</h3>
                    <p className="text-gray-400 text-sm mt-0.5">{application.role}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[application.currentStatus]}`}>
                    {application.currentStatus}
                </span>
            </div>

            <div className="flex items-center justify-between mt-4">
                <p className="text-gray-600 text-xs">
                    {application.appliedDate
                        ? new Date(application.appliedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"
                    }
                </p>
                <select
                    value={application.currentStatus}
                    onChange={handleStatusChange}
                    disabled={updating}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300 text-xs focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                >
                    {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

// Main Dashboard
export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await axiosInstance.get("/applications");
            setApplications(res.data.data);
        } catch (err) {
            console.error("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleAdd = (newApp) => {
        setApplications([newApp, ...applications]);
    };

    const handleStatusChange = (id, newStatus) => {
        setApplications(applications.map(app =>
            app._id === id ? { ...app, currentStatus: newStatus } : app
        ));
    };

    // stats
    const total = applications.length;
    const offers = applications.filter(a => a.currentStatus === "Offer").length;
    const rejected = applications.filter(a => a.currentStatus === "Rejected").length;
    const inProgress = applications.filter(a => !["Offer", "Rejected"].includes(a.currentStatus)).length;
    const successRate = total > 0 ? ((offers / total) * 100).toFixed(1) : 0;

    // filter
    const filtered = filter === "All" ? applications : applications.filter(a => a.currentStatus === filter);

    return (
        <div className="min-h-screen bg-gray-950">

            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <h1 className="text-indigo-400 font-bold text-xl tracking-tight">TrackIt</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm hidden sm:block">
                            {user?.username || user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Applied", value: total, color: "text-gray-100" },
                        { label: "In Progress", value: inProgress, color: "text-indigo-400" },
                        { label: "Offers", value: offers, color: "text-emerald-400" },
                        { label: "Success Rate", value: `${successRate}%`, color: "text-amber-400" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                            <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Header Row */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {["All", ...STATUS_OPTIONS].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                                    filter === s
                                        ? "bg-indigo-500 text-white"
                                        : "bg-gray-800 text-gray-400 hover:text-gray-200"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="ml-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                        <span>+</span> Add
                    </button>
                </div>

                {/* Applications Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-gray-500 text-sm">Loading applications...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-gray-500 text-sm">No applications yet.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                        >
                            Add your first application →
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(app => (
                            <ApplicationCard
                                key={app._id}
                                application={app}
                                onStatusChange={handleStatusChange}
                                onClick={(id) => navigate(`/applications/${id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <AddApplicationModal
                    onClose={() => setShowModal(false)}
                    onAdd={handleAdd}
                />
            )}
        </div>
    );
}