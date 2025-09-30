// app/api/sessions/route.ts
import { NextResponse } from "next/server";

// Mock academic sessions data
const mockSessions = [
  {
    id: "1",
    name: "2024/2025 Semester 1",
    code: "2024-25-S1",
    startDate: "2024-09-01",
    endDate: "2024-12-31",
    status: "ACTIVE",
    isCurrentSession: true,
  },
  {
    id: "2",
    name: "2024/2025 Semester 2",
    code: "2024-25-S2",
    startDate: "2025-01-01",
    endDate: "2025-04-30",
    status: "UPCOMING",
    isCurrentSession: false,
  },
  {
    id: "3",
    name: "2023/2024 Semester 2",
    code: "2023-24-S2",
    startDate: "2024-01-01",
    endDate: "2024-04-30",
    status: "COMPLETED",
    isCurrentSession: false,
  },
];

export async function GET() {
  try {
    // In production, fetch from database
    return NextResponse.json(mockSessions, { status: 200 });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching sessions" },
      { status: 500 }
    );
  }
}