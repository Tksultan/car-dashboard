"use client"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function EditListingModal({ listing, onSave, onClose }) {
  const [imgSrc, setImgSrc] = useState(listing.images?.[0] || "/images/carimage.png");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    features: [],
    status: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        price: listing.price || "",
        location: listing.location || "",
        features: listing.features || [],
        status: listing.status || "pending",
      })
    }
  }, [listing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await onSave({
        ...listing,
        ...formData,
        price: Number.parseFloat(formData.price),
      })
    } finally {
      setSaving(false)
    }
  }

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    })
  }

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({ ...formData, features: newFeatures })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header section */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Edit Listing</h2>
          <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* pop up content section */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">


          {/* Images  of car */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <div className="grid grid-cols-3 gap-2">
            <Image
            className="h-full w-full lg:w-45 rounded object-cover"
            src={imgSrc}
            alt={listing.title}
            width={100}
            height={64}
            onError={() => setImgSrc("/images/carimage.png")}
          />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Features adding option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Feature"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="px-3 py-2 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700"
              >
                Add Feature
              </button>
            </div>
          </div>

          {/* saving buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
