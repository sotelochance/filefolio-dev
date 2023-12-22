import { adminDb } from "@/firebase-admin";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { teamId } = await req.json();

  const ref = adminDb.collection("teams").doc(teamId);

  const bulkWriter = adminDb.bulkWriter();
  const MAX_RETRIES = 5;

  bulkWriter.onWriteError((error: any) => {
    if (error.failedAttempts < MAX_RETRIES) {
      return true;
    } else {
      console.log("Failed to delete team: ", error.documentRef.path);
      return false;
    }
  });

  try {
    await adminDb.recursiveDelete(ref, bulkWriter);
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Promise rejected: ", error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}
