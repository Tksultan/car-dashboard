import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  const id = Number.parseInt(params.id)
  const listing = global.listings?.find((l) => l.id === id)

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 })
  }

  return NextResponse.json(listing)
}

export async function PUT(request, { params }) {
  try {
    const id = Number.parseInt(params.id)
    const updates = await request.json()

    if (!global.listings) {
      return NextResponse.json({ error: "Data not initialized" }, { status: 500 })
    }

    const listingIndex = global.listings.findIndex((l) => l.id === id)

    if (listingIndex === -1) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    const oldListing = { ...global.listings[listingIndex] }
    global.listings[listingIndex] = { ...global.listings[listingIndex], ...updates }

    // Add to audit log
    if (!global.auditLog) global.auditLog = []
    global.auditLog.push({
      id: global.auditLog.length + 1,
      listingId: id,
      action: "updated",
      adminUser: updates.adminUser || "Unknown Admin",
      timestamp: new Date().toISOString(),
      changes: updates,
      oldValues: oldListing,
    })

    return NextResponse.json(global.listings[listingIndex])
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    if (!params?.id || isNaN(Number(params.id))) {
      return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 })
    }

    const id = Number.parseInt(params.id)
    const { status, adminUser } = await request.json()

    if (!global.listings) {
      return NextResponse.json({ error: "Data not initialized" }, { status: 500 })
    }

    const listingIndex = global.listings.findIndex((l) => l.id === id)

    if (listingIndex === -1) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    const oldStatus = global.listings[listingIndex].status
    global.listings[listingIndex].status = status

    if (!global.auditLog) global.auditLog = []
    global.auditLog.push({
      id: global.auditLog.length + 1,
      listingId: id,
      action: status,
      adminUser: adminUser || "Unknown Admin",
      timestamp: new Date().toISOString(),
      oldStatus,
      newStatus: status,
    })

    console.log(`Listing ${id} status changed from ${oldStatus} to ${status}`)

    return NextResponse.json(global.listings[listingIndex])
  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json({ error: "Failed to update listing status" }, { status: 500 })
  }
}
