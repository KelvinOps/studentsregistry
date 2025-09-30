// ============================================
// 3. app/api/students/me/route.ts (NEW FILE)
// ============================================
import { NextRequest, NextResponse } from "next/server";

interface Student {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  department: string;
  enrollmentDate: string;
}

// Mock student data matching our users
const mockStudents: Student[] = [
  {
    id: "s1",
    userId: "3",
    firstName: "Wanjiku",
    lastName: "Kamau",
    email: "wanjiku.kamau@student.ac.ke",
    studentId: "STU001",
    department: "Computer Science",
    enrollmentDate: "2024-01-15",
  },
  {
    id: "s2",
    userId: "4",
    firstName: "Omondi",
    lastName: "Otieno",
    email: "omondi.otieno@student.ac.ke",
    studentId: "STU002",
    department: "Engineering",
    enrollmentDate: "2024-01-15",
  },
  {
    id: "s3",
    userId: "5",
    firstName: "Akinyi",
    lastName: "Odhiambo",
    email: "akinyi.odhiambo@student.ac.ke",
    studentId: "STU003",
    department: "Business",
    enrollmentDate: "2024-01-15",
  },
  {
    id: "s4",
    userId: "6",
    firstName: "Njoroge",
    lastName: "Mwangi",
    email: "njoroge.mwangi@student.ac.ke",
    studentId: "STU004",
    department: "Computer Science",
    enrollmentDate: "2024-01-15",
  },
  {
    id: "s5",
    userId: "7",
    firstName: "Chemutai",
    lastName: "Kiprop",
    email: "chemutai.kiprop@student.ac.ke",
    studentId: "STU005",
    department: "Medicine",
    enrollmentDate: "2024-01-15",
  },
  {
    id: "s6",
    userId: "8",
    firstName: "Mutua",
    lastName: "Kioko",
    email: "mutua.kioko@student.ac.ke",
    studentId: "STU006",
    department: "Engineering",
    enrollmentDate: "2024-01-15",
  },
  {
    id: "s7",
    userId: "9",
    firstName: "Wairimu",
    lastName: "Githinji",
    email: "wairimu.githinji@student.ac.ke",
    studentId: "STU007",
    department: "Law",
    enrollmentDate: "2024-01-15",
  },
  {
    id: "s8",
    userId: "10",
    firstName: "Kibet",
    lastName: "Rotich",
    email: "kibet.rotich@student.ac.ke",
    studentId: "STU008",
    department: "Computer Science",
    enrollmentDate: "2024-01-15",
  },
];

function getCurrentUserId(request: NextRequest): string | null {
  try {
    const userHeader = request.headers.get('x-user-data');
    if (userHeader) {
      const user = JSON.parse(userHeader);
      return user.id;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const student = mockStudents.find((s) => s.userId === userId);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching student data" },
      { status: 500 }
    );
  }
}