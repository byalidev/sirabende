import { NextResponse } from "next/server";
import { getRequestActor } from "../../../server/requests/actor";
import { createReport, ReportDomainError } from "../../../server/reports/repository";
import { ReportValidationError, validateReportInput } from "../../../server/reports/validation";

export async function POST(request: Request) {
  try {
    const input = validateReportInput(await request.json());
    const actor = await getRequestActor();
    const report = await createReport(actor.id, input.targetType, input.targetId, input.reason, input.description);
    return NextResponse.json({ report: { ...report, createdAt: report.createdAt.toISOString() } }, { status: 201 });
  } catch (error) {
    if (error instanceof ReportValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof ReportDomainError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("Report creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Şikayet gönderilirken bir hata oluştu." }, { status: 500 });
  }
}
