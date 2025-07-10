import { NextResponse } from "next/server"
import {
  listings as initialListings,
  auditLog as initialAuditLog,
} from "@/app/data/listingsData"

global.listings = global.listings || [...initialListings]
global.auditLog = global.auditLog || [...initialAuditLog]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page")) || 1
  const limit = Number.parseInt(searchParams.get("limit")) || 10
  const status = searchParams.get("status")
  const search = searchParams.get("search")

  let filteredListings = [...global.listings]

  if (status && status !== "all") {
    filteredListings = filteredListings.filter(
      (listing) => listing.status === status
    )
  }

  if (search) {
    filteredListings = filteredListings.filter((listing) =>
      [listing.title, listing.description, listing.location]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }


  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedListings = filteredListings.slice(startIndex, endIndex)


  let statSource = [...global.listings]
  if (search) {
    statSource = statSource.filter((listing) =>
      [listing.title, listing.description, listing.location]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }

  const stats = {
    pending: statSource.filter((l) => l.status === "pending").length,
    approved: statSource.filter((l) => l.status === "approved").length,
    rejected: statSource.filter((l) => l.status === "rejected").length,
  }

  return NextResponse.json({
    listings: paginatedListings,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredListings.length / limit),
      totalItems: filteredListings.length,
      itemsPerPage: limit,
    },
    stats,
  })
}

export async function POST(request) {
  try {
    const newListing = await request.json()
    const id =
      global.listings.length > 0
        ? Math.max(...global.listings.map((l) => l.id)) + 1
        : 1

    const listing = {
      id,
      ...newListing,
      submittedAt: new Date().toISOString(),
      status: "pending",
    }

    global.listings.push(listing)

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/listings:", error)
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    )
  }
}
