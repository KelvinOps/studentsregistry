// ============================================
// 1. app/api/auth/user/route.ts (NEW FILE)
// ============================================
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check for user in request headers (sent from client)
    const userHeader = request.headers.get('x-user-data');
    
    if (userHeader) {
      try {
        const user = JSON.parse(userHeader);
        return NextResponse.json(user, { status: 200 });
      } catch {
        return NextResponse.json(null, { status: 200 });
      }
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(null, { status: 200 });
  }
}
