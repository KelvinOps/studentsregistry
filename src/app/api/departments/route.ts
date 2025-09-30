// app/api/departments/route.ts
import { NextResponse } from "next/server";

// Mock departments data
const mockDepartments = [
  {
    id: "1",
    name: "Computer Science",
    code: "CS",
    description: "Department of Computer Science and Information Technology",
    head: "Dr. John Smith",
    isActive: true,
  },
  {
    id: "2",
    name: "Engineering",
    code: "ENG",
    description: "Department of Engineering",
    head: "Dr. Jane Doe",
    isActive: true,
  },
  {
    id: "3",
    name: "Business Administration",
    code: "BA",
    description: "Department of Business and Management",
    head: "Prof. Michael Johnson",
    isActive: true,
  },
  {
    id: "4",
    name: "Mathematics",
    code: "MATH",
    description: "Department of Mathematics and Statistics",
    head: "Dr. Sarah Williams",
    isActive: true,
  },
];

export async function GET() {
  try {
    // In production, fetch from database
    return NextResponse.json(mockDepartments, { status: 200 });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching departments" },
      { status: 500 }
    );
  }
}