"use client"
import { useState, useEffect } from "react"

export default function AuditTrail() {
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchAuditLogs()
  }, [currentPage])

  const fetchAuditLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/audit?page=${currentPage}&limit=20`)
      const data = await response.json()
      setAuditLogs(data.logs)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "updated":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="px-4 py-3 border-b">
        <h2 className="font-medium text-gray-900">Audit Trail ({pagination.totalItems || 0})</h2>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                  {log.action}
                </span>
                <span className="text-sm">Listing #{log.listingId}</span>
                <span className="text-sm text-gray-600">by {log.adminUser}</span>
              </div>
              <div className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm cursor-pointer hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
