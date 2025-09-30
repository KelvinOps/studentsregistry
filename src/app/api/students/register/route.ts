// app/api/students/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Helper function to generate student number
function generateStudentNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `STU${year}${random}`;
}

// Helper function to save uploaded files
async function saveFile(file: File, category: string): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', category);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Return relative path for database storage
    return `/uploads/${category}/${filename}`;
  } catch (error) {
    console.error('File save error:', error);
    throw new Error(`Failed to save ${category} file`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const studentName = formData.get('studentName') as string;
    const birthDate = formData.get('birthDate') as string;
    const gender = formData.get('gender') as string;
    const nationality = formData.get('nationality') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const email = formData.get('email') as string;
    const county = formData.get('county') as string;
    const subCounty = formData.get('subCounty') as string;
    const birthCertNo = formData.get('birthCertNo') as string;
    const studentType = formData.get('studentType') as string;
    const departmentId = formData.get('departmentId') as string;
    const programme = formData.get('programme') as string;
    const classYear = formData.get('class') as string;
    const session = formData.get('session') as string;
    const kcpeIndex = formData.get('kcpeIndex') as string | null;
    const kcseIndex = formData.get('kcseIndex') as string | null;
    const previousInstitution = formData.get('previousInstitution') as string | null;

    // Validate required fields
    if (!studentName || !email || !phoneNumber || !departmentId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists (mock check - replace with actual DB query)
    // In production, query your database here
    const emailExists = false; // Replace with: await prisma.student.findUnique({ where: { email } })
    
    if (emailExists) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Handle file uploads
    const documents: Record<string, string> = {};

    const birthCertFile = formData.get('birthCertificate') as File | null;
    if (birthCertFile && birthCertFile.size > 0) {
      documents.birthCertificate = await saveFile(birthCertFile, 'birth-certificates');
    }

    const kcseFile = formData.get('kcseCertificate') as File | null;
    if (kcseFile && kcseFile.size > 0) {
      documents.kcseCertificate = await saveFile(kcseFile, 'kcse-certificates');
    }

    const transcriptsFile = formData.get('transcripts') as File | null;
    if (transcriptsFile && transcriptsFile.size > 0) {
      documents.transcripts = await saveFile(transcriptsFile, 'transcripts');
    }

    const passportPhotoFile = formData.get('passportPhoto') as File | null;
    if (!passportPhotoFile || passportPhotoFile.size === 0) {
      return NextResponse.json(
        { message: "Passport photo is required" },
        { status: 400 }
      );
    }
    documents.passportPhoto = await saveFile(passportPhotoFile, 'passport-photos');

    // Generate student number
    const studentNo = generateStudentNumber();

    // Create student record
    // In production, save to database using Prisma or your ORM
    const studentData = {
      id: `student-${Date.now()}`,
      studentNo,
      studentName,
      email,
      phoneNumber,
      birthDate: new Date(birthDate),
      gender,
      nationality,
      county,
      subCounty,
      birthCertNo,
      studentType,
      departmentId,
      programme,
      class: classYear,
      session,
      kcpeIndex,
      kcseIndex,
      previousInstitution,
      documents,
      status: 'PENDING_APPROVAL',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Replace with actual database insert
    // Example with Prisma:
    // const student = await prisma.student.create({
    //   data: {
    //     studentNo,
    //     studentName,
    //     email,
    //     phoneNumber,
    //     birthDate: new Date(birthDate),
    //     gender,
    //     nationality,
    //     county,
    //     subCounty,
    //     birthCertNo,
    //     studentType,
    //     departmentId,
    //     programme,
    //     class: classYear,
    //     session,
    //     kcpeIndex,
    //     kcseIndex,
    //     previousInstitution,
    //     documents: documents,
    //   }
    // });

    // Save to a JSON file for now (temporary solution - remove in production)
    try {
      const dataDir = join(process.cwd(), 'data');
      await mkdir(dataDir, { recursive: true });
      
      const studentsFile = join(dataDir, 'students.json');
      let students = [];
      
      try {
        const { readFile } = await import('fs/promises');
        const existingData = await readFile(studentsFile, 'utf-8');
        students = JSON.parse(existingData);
      } catch {
        // File doesn't exist yet, that's okay
      }
      
      students.push(studentData);
      await writeFile(studentsFile, JSON.stringify(students, null, 2));
    } catch (error) {
      console.error('Error saving to JSON file:', error);
      // Continue anyway - the files are saved
    }

    // Send confirmation email (optional - implement email service)
    // await sendConfirmationEmail(email, studentNo);

    return NextResponse.json(
      {
        message: "Registration successful! Your application is pending approval.",
        studentNo,
        student: {
          id: studentData.id,
          studentNo,
          studentName,
          email,
          status: 'PENDING_APPROVAL',
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : "Registration failed. Please try again.",
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { message: "Method not allowed. Use POST to register a student." },
    { status: 405 }
  );
}