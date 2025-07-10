"use client"
import { memo, useState} from "react"
import Image from "next/image"


const ListingRow = memo(function ListingRow({ listing, onStatusChange, onEdit }) {
  const [imgSrc, setImgSrc] = useState(listing.images?.[0] || "/images/carimage.png");

  
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Image
            className="h-full w-full lg:w-45 rounded object-cover"
            src={imgSrc}
            alt={listing.title}
            width={100}
            height={64}
            onError={() => setImgSrc("/images/carimage.png")}
          />
          <div>
            <div className="font-medium text-gray-900 text-sm sm:text-base">{listing.title}</div>
            <div className="text-xs text-gray-500">{listing.location}</div>

            {/*for showing description & price only for mobile */}
            <div className="block md:hidden mt-1 text-xs text-gray-600">{listing.description}</div>
            <div className="block md:hidden font-bold text-green-600">${listing.price}/day</div>

            {/* Show submitted info only on small devices */}
            <div className="block lg:hidden mt-1 text-xs text-gray-500">{listing.submittedBy}</div>
            <div className="block lg:hidden text-xs text-gray-400">
              {new Date(listing.submittedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </td>

      {/* Hidden on mobile */}
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="text-sm text-gray-900">{listing.description}</div>
        <div className="font-bold text-green-600">${listing.price}/day</div>
      </td>

      {/* Hidden on mobile and md */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="text-sm">{listing.submittedBy}</div>
        <div className="text-xs text-gray-500">{new Date(listing.submittedAt).toLocaleDateString()}</div>
      </td>

      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(listing.status)}`}>
          {listing.status}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {listing.status === "pending" && (
            <>
              <button
                onClick={() => onStatusChange(listing.id, "approved")}
                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => onStatusChange(listing.id, "rejected")}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Reject
              </button>
            </>
          )}
          <button
            onClick={() => onEdit(listing)}
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  )
})


export default function ListingTable({
  listings,
  loading,
  onStatusChange,
  onEdit,
  pagination,
  currentPage,
  onPageChange,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="px-4 py-3 border-b">
        <h2 className="font-medium text-gray-900">Listings ({pagination.totalItems || 0})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                Submitted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listings.map((listing) => (
              <ListingRow
                key={listing.id}
                listing={listing}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
