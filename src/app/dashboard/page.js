"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { useNotification } from "../context/NotificationContext"
import ListingTable from "../components/ListingTable"
import EditListingModal from "../components/EditListingModal"
import AuditTrail from "../components/AuditTrail"

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const { addNotification } = useNotification()
  const router = useRouter()

  const [listings, setListings] = useState([])
  const [pagination, setPagination] = useState({})
  const [loadingListings, setLoadingListings] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingListing, setEditingListing] = useState(null)
  const [showAuditTrail, setShowAuditTrail] = useState(false)
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 }) // 🆕

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const fetchListings = useCallback(async () => {
    setLoadingListings(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/listings?${params}`)
      const data = await response.json()

      setListings(data.listings)
      setPagination(data.pagination)
      setStats(data.stats || { pending: 0, approved: 0, rejected: 0 }) // ✅ Use stats from backend
    } catch (error) {
      addNotification("Failed to fetch listings", "error")
    } finally {
      setLoadingListings(false)
    }
  }, [currentPage, statusFilter, searchTerm, addNotification])

  useEffect(() => {
    if (user) {
      fetchListings()
    }
  }, [user, fetchListings])

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          adminUser: user.name,
        }),
      })

      if (response.ok) {
        addNotification(`Listing ${newStatus} successfully`, "success")
        fetchListings()
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      addNotification("Failed to update listing status", "error")
    }
  }

  const handleEditListing = (listing) => {
    setEditingListing(listing)
  }

  const handleSaveEdit = async (updatedListing) => {
    try {
      const statusChanged = updatedListing.status !== editingListing.status

      const response = await fetch(`/api/listings/${updatedListing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedListing,
          adminUser: user.name,
          statusChanged,
        }),
      })

      if (response.ok) {
        addNotification("Listing updated successfully", "success")
        setEditingListing(null)
        fetchListings()
      } else {
        throw new Error("Failed to update listing")
      }
    } catch (error) {
      addNotification("Failed to update listing", "error")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Car Rental Admin</h1>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAuditTrail(!showAuditTrail)}
                className="p-2 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700"
              >
                {showAuditTrail ? "Hide Audit" : "Show Audit"}
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {showAuditTrail ? (
          <AuditTrail />
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search listings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Listings */}
            <ListingTable
              listings={listings}
              loading={loadingListings}
              onStatusChange={handleStatusChange}
              onEdit={handleEditListing}
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingListing && (
        <EditListingModal
          listing={editingListing}
          onSave={handleSaveEdit}
          onClose={() => setEditingListing(null)}
        />
      )}
    </div>
  )
}
