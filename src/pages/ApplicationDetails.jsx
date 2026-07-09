import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.js";

const OUTCOME_COLORS = {
    "cleared": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "rejected": "bg-red-500/10 text-red-400 border-red-500/20",
    "waiting": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const AddRoundModal = ({ appId, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        roundName: "",
        roundDate: "",
        questionsAsked: "",
        performanceRating: "",
        outcome: "waiting",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
        const payload = {
            ...formData,
            performanceRating: formData.performanceRating 
                ? parseInt(formData.performanceRating) 
                : undefined
        }
        const res = await axiosInstance.post(`/applications/${appId}/rounds`, payload);
        onAdd(res.data.data);
        onClose();
    } catch (err) {
        setError(err.response?.data?.message || "Failed to add round");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-gray-100">Add Interview Round</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">✕</button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Round Name *</label>
                            <input
                                type="text"
                                value={formData.roundName}
                                onChange={(e) => setFormData({ ...formData, roundName: e.target.value })}
                                placeholder="Technical Round 1"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Round Date</label>
                            <input
                                type="date"
                                value={formData.roundDate}
                                onChange={(e) => setFormData({ ...formData, roundDate: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Outcome</label>
                            <select
                                value={formData.outcome}
                                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="waiting">waiting</option>
                                <option value="cleared">cleared</option>
                                <option value="rejected">rejected</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Performance Rating (1-5)</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={formData.performanceRating}
                                onChange={(e) => setFormData({ ...formData, performanceRating: e.target.value })}
                                placeholder="4"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Questions Asked</label>
                        <textarea
                            value={formData.questionsAsked}
                            onChange={(e) => setFormData({ ...formData, questionsAsked: e.target.value })}
                            placeholder="DSA problems, system design questions..."
                            rows={3}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Interviewer was friendly..."
                            rows={2}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
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
                            {loading ? "Adding..." : "Add Round"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function ApplicationDetail() {
    const { appId } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [rounds, setRounds] = useState([]);
    const [showRoundModal, setShowRoundModal] = useState(false);
    const [reminderDate, setReminderDate] = useState("");
    const [reminderLoading, setReminderLoading] = useState(false);
    const [reminderSuccess, setReminderSuccess] = useState(false);

    useEffect(() => {
        fetchApplicationDetails();
        fetchRounds();
    }, []);

    const fetchApplicationDetails = async () => {
    try {
        const res = await axiosInstance.get(`/applications/${appId}`);
        setDetails(res.data.data);
        setFormData(res.data.data);
        // set reminder date if exists
        if (res.data.data.reminder?.date) {
            setReminderDate(res.data.data.reminder.date.split("T")[0]);
        }
    } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch application");
    } finally {
        setLoading(false);
    }
};

    const fetchRounds = async () => {
    try {
        const res = await axiosInstance.get(`/applications/${appId}/rounds`);
        setRounds(res.data.data);
    } catch (err) {
        console.error("Failed to fetch rounds");
    }
   };

   const handleSetReminder = async () => {
    if (!reminderDate) return;
    setReminderLoading(true);
    setReminderSuccess(false);
    try {
        await axiosInstance.patch(`/applications/${appId}`, {
            reminder: {
                date: reminderDate,
                sent: false
            }
        });
        setReminderSuccess(true);
        setTimeout(() => setReminderSuccess(false), 3000);
    } catch (err) {
        console.error("Failed to set reminder");
    } finally {
        setReminderLoading(false);
    }
};

   const handleUpdate = async () => {
    try {
        const res = await axiosInstance.patch(`/applications/${appId}`, {
            companyName: formData.companyName,
            role: formData.role,
            location: formData.location,
            ctc: formData.ctc,
            jobUrl: formData.jobUrl,
            notes: formData.notes,
            currentStatus: formData.currentStatus, // add this
        });
        setDetails(res.data.data);
        setEditMode(false);
    } catch (err) {
        setError(err.response?.data?.message || "Failed to update application");
    }
};

    const handleDelete = async () => {
        if (!window.confirm("Delete this application?")) return;
        try {
            await axiosInstance.delete(`/applications/${appId}`);
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to delete application");
        }
    };

    const handleDeleteStatusEntry = async (entryId) => {
    if (!window.confirm("Remove this status entry from timeline?")) return;
    try {
        const res = await axiosInstance.delete(`/applications/${appId}/status-history/${entryId}`);
        setDetails(res.data.data);
    } catch (err) {
        setError("Failed to delete status entry");
    }
};

const handleDeleteRound = async (roundId) => {
    if (!window.confirm("Delete this interview round?")) return;
    try {
        await axiosInstance.delete(`/applications/${appId}/rounds/${roundId}`);
        setRounds(rounds.filter(r => r._id !== roundId));
    } catch (err) {
        console.error("Failed to delete round");
    }
};

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-red-400 text-sm">{error}</p>
        </div>
    );

    return (
        
        <div className="min-h-screen bg-gray-950">

            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-gray-400 hover:text-gray-200 text-sm flex items-center gap-2 transition-colors"
                    >
                        ← Back
                    </button>
                    <div className="flex items-center gap-3">
                        {editMode ? (
                            <>
                                <button
                                    onClick={() => { setEditMode(false); setFormData(details); }}
                                    className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
                                >
                                    Cancel
                                </button>   
                                <button
                                    onClick={handleUpdate}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            {editMode ? (
                                <input
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-xl font-semibold w-full focus:outline-none focus:border-indigo-500 mb-2"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold text-gray-100">{details.companyName}</h1>
                            )}
                            {editMode ? (
                                <input
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 w-full focus:outline-none focus:border-indigo-500 mt-2"
                                />
                            ) : (
                                <p className="text-gray-400 mt-1">{details.role}</p>
                            )}
                        </div>
                       {/* Status section in header */}
<div className="flex items-center gap-2 ml-4">
    {editMode ? (
        <select
            value={formData.currentStatus}
            onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        >
            {["Applied", "OA", "Interview Round 1", "Interview Round 2", "HR Round", "Offer", "Rejected"].map(s => (
                <option key={s} value={s}>{s}</option>
            ))}
        </select>
    ) : (
        <span className="text-xs px-3 py-1.5 rounded-full border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-medium whitespace-nowrap">
            {details.currentStatus}
        </span>
    )}
</div>
                    </div>

                    {/* Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "Location", key: "location", placeholder: "Bangalore" },
                            { label: "CTC / Stipend", key: "ctc", placeholder: "30,000/month" },
                            { label: "Job URL", key: "jobUrl", placeholder: "https://careers.google.com" },
                            { label: "Applied Date", key: "appliedDate", placeholder: "", type: "date" },
                        ].map(({ label, key, placeholder, type }) => (
                            <div key={key}>
                                <p className="text-gray-500 text-xs mb-1">{label}</p>
                                {editMode && key !== "appliedDate" ? (
                                    <input
                                        value={formData[key] || ""}
                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                        placeholder={placeholder}
                                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm w-full focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                ) : (
                                    <p className="text-gray-300 text-sm">
                                        {key === "appliedDate" && details[key]
                                            ? new Date(details[key]).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                            : details[key] || "—"
                                        }
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Notes */}
                    <div className="mt-4">
                        <p className="text-gray-500 text-xs mb-1">Notes</p>
                        {editMode ? (
                            <textarea
                                value={formData.notes || ""}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Add notes about this application..."
                                rows={3}
                                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm w-full focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            />
                        ) : (
                            <p className="text-gray-300 text-sm">{details.notes || "—"}</p>
                        )}
                    </div>
                </div>

                {/* Status Timeline */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-gray-100 font-semibold mb-5">Application Journey</h2>

    {details.statusHistory && details.statusHistory.length > 0 ? (
        <div className="relative">
            {/* vertical line */}
            <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-700" />

            <div className="space-y-5">
                {details.statusHistory.map((entry, index) => (
    <div key={index} className="flex items-start gap-4 relative group">
        {/* dot */}
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
            index === details.statusHistory.length - 1
                ? "border-indigo-500 bg-indigo-500/20"
                : "border-gray-600 bg-gray-900"
        }`}>
            <div className={`w-2 h-2 rounded-full ${
                index === details.statusHistory.length - 1
                    ? "bg-indigo-400"
                    : "bg-gray-600"
            }`} />
        </div>

        {/* content */}
        <div className="flex items-center justify-between w-full pt-0.5">
            <span className={`text-sm font-medium ${
                index === details.statusHistory.length - 1
                    ? "text-indigo-400"
                    : "text-gray-300"
            }`}>
                {entry.status}
            </span>
            <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs">
                    {new Date(entry.changedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    })}
                </span>
                {/* delete button — only show if more than 1 entry */}
                {details.statusHistory.length > 1 && (
                    <button
                        onClick={() => handleDeleteStatusEntry(entry._id)}
                        className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-m"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    </div>
))}
            </div>
        </div>
    ) : (
        <p className="text-gray-500 text-sm">No status history found.</p>
    )}
</div>


      {/* Interview Rounds */}
<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
    <div className="flex items-center justify-between mb-5">
        <h2 className="text-gray-100 font-semibold">Interview Rounds</h2>
        <button
            onClick={() => setShowRoundModal(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
        >
            + Add Round
        </button>
    </div>

    {rounds.length === 0 ? (
        <p className="text-gray-500 text-sm">No interview rounds added yet.</p>
    ) : (
        <div className="space-y-4">
            {rounds.map((round) => (
                <div key={round._id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-gray-100 font-medium">{round.roundName}</h3>
                            {round.roundDate && (
                                <p className="text-gray-500 text-xs mt-0.5">
                                    {new Date(round.roundDate).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "short", year: "numeric"
                                    })}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {round.outcome && (
                                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${OUTCOME_COLORS[round.outcome]}`}>
                                    {round.outcome}
                                </span>
                            )}
                            {round.performanceRating && (
                                <span className="text-amber-400 text-sm font-medium">
                                    {"★".repeat(round.performanceRating)}{"☆".repeat(5 - round.performanceRating)}
                                </span>
                            )}
                            <button
                                onClick={() => handleDeleteRound(round._id)}
                                className="text-gray-600 hover:text-red-400 transition-colors text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {round.questionsAsked && (
                        <div className="mb-2">
                            <p className="text-gray-500 text-xs mb-1">Questions Asked</p>
                            <p className="text-gray-300 text-sm">{round.questionsAsked}</p>
                        </div>
                    )}

                    {round.notes && (
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Notes</p>
                            <p className="text-gray-300 text-sm">{round.notes}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )}
</div>

{/* Reminder */}
<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-100 font-semibold">Reminder</h2>
        {details.reminder?.sent && (
            <span className="text-xs px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium">
                Reminder sent ✓
            </span>
        )}
    </div>

    <p className="text-gray-500 text-sm mb-4">
        Set a date to receive an email reminder to follow up on this application.
    </p>

    <div className="flex items-center gap-3">
        <input
            type="date"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
            onClick={handleSetReminder}
            disabled={reminderLoading || !reminderDate}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
            {reminderLoading ? "Saving..." : "Set Reminder"}
        </button>
        {reminderSuccess && (
            <span className="text-emerald-400 text-sm">✓ Saved</span>
        )}
    </div>

    {details.reminder?.date && !details.reminder?.sent && (
        <p className="text-gray-500 text-xs mt-3">
            Reminder scheduled for {new Date(details.reminder.date).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric"
            })}
        </p>
    )}
</div>

{/* Modal */}
{showRoundModal && (
    <AddRoundModal
        appId={appId}
        onClose={() => setShowRoundModal(false)}
        onAdd={(newRound) => setRounds([...rounds, newRound])}
    />
)}
            </div>


             

             
           
        </div>

       

       
        

        
    );
}