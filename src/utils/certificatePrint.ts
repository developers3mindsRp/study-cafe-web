/** Payload from GET /certificates/course/:courseId — used for client-side print/PDF UX. */

export type CertificatePayload = {
  courseTitle: string;
  studentName: string;
  completionDate: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Opens a printable certificate in a new window (user can Save as PDF from the print dialog).
 */
export function printCertificate(payload: CertificatePayload): void {
  const courseTitle = escapeHtml(payload.courseTitle);
  const studentName = escapeHtml(payload.studentName);
  const completionDate = escapeHtml(payload.completionDate);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Certificate</title>
  <style>
    @page { margin: 20mm; }
    body { font-family: Georgia, serif; margin: 0; color: #0f172a; }
    .frame { border: 4px double #1e3a8a; padding: 32px 40px; max-width: 720px; margin: 0 auto; text-align: center; }
    h1 { font-size: 28px; margin: 0 0 8px; letter-spacing: 0.06em; text-transform: uppercase; color: #1e3a8a; }
    .muted { font-size: 14px; color: #64748b; margin: 24px 0 8px; }
    .name { font-size: 26px; font-weight: bold; color: #09339b; margin: 16px 0; }
    .course { font-size: 18px; margin: 8px 0 28px; }
    .meta { font-size: 13px; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="frame">
    <h1>Certificate of completion</h1>
    <p class="muted">This certifies that</p>
    <p class="name">${studentName}</p>
    <p class="muted">has completed</p>
    <p class="course">${courseTitle}</p>
    <p class="meta">Completed on ${completionDate}</p>
  </div>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.addEventListener("load", () => {
    w.focus();
    w.print();
  });
}
