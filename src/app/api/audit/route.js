import { NextResponse } from "next/server"
import { auditLog as initialAuditLog } from "@/app/data/auditLogData"

global.auditLog = global.auditLog || [...initialAuditLog]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page")) || 1
  const limit = Number.parseInt(searchParams.get("limit")) || 20

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedLog = global.auditLog.slice(startIndex, endIndex)

  return NextResponse.json({
    logs: [...paginatedLog].reverse(),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(global.auditLog.length / limit),
      totalItems: global.auditLog.length,
      itemsPerPage: limit,
    },
  })
}
