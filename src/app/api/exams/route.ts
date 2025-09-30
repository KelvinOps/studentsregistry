// app/api/exams/route.ts
import { NextRequest, NextResponse } from "next/server";

// Mock data - replace with actual database queries
const mockExams = [
  {
    id: "1",
    title: "Introduction to Computer Science Final Exam",
    courseCode: "CS101",
    description: "Comprehensive final examination covering all course material",
    examDate: "2025-12-15T09:00:00Z",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    room: "Hall A",
    maxCapacity: 100,
    registrationCount: 45,
    registrationFee: 500,
    registrationDeadline: "2025-12-10T23:59:59Z",
    status: "PUBLISHED",
    examType: "Final",
    departmentId: "1",
    sessionId: "1",
  },
  {
    id: "2",
    title: "Data Structures Mid-term Exam",
    courseCode: "CS201",
    description: "Mid-term assessment for Data Structures course",
    examDate: "2025-11-20T14:00:00Z",
    startTime: "02:00 PM",
    endTime: "04:00 PM",
    room: "Room 305",
    maxCapacity: 50,
    registrationCount: 30,
    registrationFee: 300,
    registrationDeadline: "2025-11-15T23:59:59Z",
    status: "PUBLISHED",
    examType: "Mid-term",
    departmentId: "1",
    sessionId: "1",
  },
  {
    id: "3",
    title: "Database Systems Project",
    courseCode: "CS301",
    description: "Final project presentation and demo",
    examDate: "2025-12-20T10:00:00Z",
    startTime: "10:00 AM",
    endTime: "05:00 PM",
    room: "Lab 2",
    maxCapacity: 30,
    registrationCount: 25,
    registrationFee: 400,
    registrationDeadline: "2025-12-15T23:59:59Z",
    status: "PUBLISHED",
    examType: "Project",
    departmentId: "1",
    sessionId: "1",
  },
  {
    id: "4",
    title: "Engineering Mathematics Final",
    courseCode: "ENG101",
    description: "Final examination for Engineering Mathematics",
    examDate: "2025-12-18T09:00:00Z",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    room: "Hall B",
    maxCapacity: 80,
    registrationCount: 60,
    registrationFee: 500,
    registrationDeadline: "2025-12-12T23:59:59Z",
    status: "PUBLISHED",
    examType: "Final",
    departmentId: "2",
    sessionId: "1",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const department = searchParams.get("department") || "";
    const session = searchParams.get("session") || "";
    const examType = searchParams.get("examType") || "";

    // Filter exams based on query parameters
    let filteredExams = mockExams;

    if (query) {
      filteredExams = filteredExams.filter(
        (exam) =>
          exam.title.toLowerCase().includes(query) ||
          exam.courseCode.toLowerCase().includes(query) ||
          exam.description.toLowerCase().includes(query)
      );
    }

    if (department) {
      filteredExams = filteredExams.filter(
        (exam) => exam.departmentId === department
      );
    }

    if (session) {
      filteredExams = filteredExams.filter((exam) => exam.sessionId === session);
    }

    if (examType) {
      filteredExams = filteredExams.filter((exam) => exam.examType === examType);
    }

    return NextResponse.json(filteredExams, { status: 200 });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching exams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.courseCode || !body.examDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // In production, save to database
    const newExam = {
      id: String(mockExams.length + 1),
      ...body,
      registrationCount: 0,
      status: "DRAFT",
    };

    mockExams.push(newExam);

    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { message: "An error occurred while creating exam" },
      { status: 500 }
    );
  }
}