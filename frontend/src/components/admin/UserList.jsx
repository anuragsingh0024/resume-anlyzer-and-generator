import React, { useEffect, useState } from "react";
import {
  Trash2,
  Mail,
  Calendar,
  FileText,
  Users,
  Search,
  Filter,
} from "lucide-react";
import axiosInstance from "../../services/axiosInstance.js";
import Loader from "../templates/Loader.jsx";
import toast from "react-hot-toast";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [countOfResumeByUser, setCountOfResumeByUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // 'all', '1m', '3m', 'custom'
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/get-all-users");
      if (response.status != 200) {
        toast.error(response?.data?.message || "something went wrong");
        console.log(
          "error while fetching all users: ",
          response?.data?.message,
        );
      }
      setUsers(response?.data?.users);
    } catch (err) {
      toast.error(err?.response?.data?.message || "something went wrong");
      console.log("err while fetching users: ", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirm) return;
    try {
      setIsDeletingUser(true);
      const response = await axiosInstance.delete(`/admin/delete-user/`, {
        data: { userId },
      });
      if (response.status !== 200) {
        toast.error(response?.data?.message || "something went wrong");
        console.log("error while deleting user: ", response?.data?.message);
      }
      toast.success(response?.data?.message || "User deleted successfully");
      fetchAllUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "something went wrong");
      console.log("err while deleting user: ", err.message);
    } finally {
      setIsDeletingUser(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    // Search Filter
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Date Filter
    if (dateFilter === "all") return true;

    const joinDate = new Date(u.createdAt);
    const today = new Date();

    if (dateFilter === "1m") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      return joinDate >= oneMonthAgo;
    }

    if (dateFilter === "3m") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      return joinDate >= threeMonthsAgo;
    }

    if (dateFilter === "custom") {
      if (!customStartDate && !customEndDate) return true;

      let isValid = true;
      if (customStartDate) {
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        if (joinDate < start) isValid = false;
      }
      if (customEndDate) {
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        if (joinDate > end) isValid = false;
      }
      return isValid;
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-2xl font-bold text-text-primary">
            User Directory
          </h3>
          <p className="text-text-secondary mt-1">
            Manage and view all registered users.
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full bg-surface border border-border-muted/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto bg-surface border border-border-muted/30 rounded-xl px-3 py-2.5">
            <Filter size={16} className="text-text-secondary" />
            <select
              className="bg-transparent text-sm text-text-primary focus:outline-none w-full sm:w-auto cursor-pointer"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                if (e.target.value !== "custom") {
                  setCustomStartDate("");
                  setCustomEndDate("");
                }
              }}
            >
              <option value="all" className="bg-background text-text-primary">
                All Time
              </option>
              <option value="1m" className="bg-background text-text-primary">
                Last 1 Month
              </option>
              <option value="3m" className="bg-background text-text-primary">
                Last 3 Months
              </option>
              <option
                value="custom"
                className="bg-background text-text-primary"
              >
                Custom Date
              </option>
            </select>
          </div>

          {dateFilter === "custom" && (
            <div className="flex items-center gap-2 w-full sm:w-auto animate-in fade-in zoom-in-95 duration-200">
              <input
                type="date"
                className="bg-surface border border-border-muted/30 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
              <span className="text-text-secondary text-sm">to</span>
              <input
                type="date"
                className="bg-surface border border-border-muted/30 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {users?.length === 0 ? (
        <div className="glass-card p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Users size={32} />
          </div>
          <h4 className="text-xl font-bold mb-2">No Users Found</h4>
          <p className="text-text-secondary">
            There are currently no users registered in the system.
          </p>
        </div>
      ) : filteredUsers?.length === 0 ? (
        <div className="glass-card p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Search size={32} />
          </div>
          <h4 className="text-xl font-bold mb-2">
            No Results Match Your Search
          </h4>
          <p className="text-text-secondary">
            Try adjusting your search terms or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((u, i) => (
            <div
              key={i}
              className="bg-surface rounded-2xl border border-border-muted/30 hover:border-primary/50 transition-all duration-300 p-6 flex flex-col group relative overflow-hidden shadow-lg hover:shadow-primary/5 z-10"
            >
              {/* decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-500"></div>

              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-bold text-xl border border-primary/20 shadow-inner">
                    {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-lg leading-tight group-hover:text-primary transition-colors">
                      {u.name}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-grow bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Mail size={16} className="text-primary/70 shrink-0" />
                  <span className="truncate">{u.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Calendar size={16} className="text-primary/70 shrink-0" />
                  <span>
                    Joined:{" "}
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <FileText size={16} className="text-primary/70 shrink-0" />
                  <span>
                    Resumes Uploaded:{" "}
                    <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md ml-1">
                      3
                    </span>
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border-muted/30 flex justify-end">
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  disabled={isDeletingUser}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-red-500/10 hover:bg-red-500/20 border cursor-pointer border-transparent hover:border-red-500/30 text-red-400"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
