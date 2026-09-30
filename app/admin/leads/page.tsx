import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen bg-lavender px-6 py-10 md:px-12">
      <div className="mx-auto max-w-6xl">
        <AdminNav active="leads" />

        <div className="mt-6">
          <h1 className="font-display text-2xl font-extrabold text-ink">Leads</h1>
          <p className="mt-1 text-sm text-slate">
            {leads.length} submission{leads.length === 1 ? "" : "s"} — every user who
            completed step 2 and step 3.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-panel border border-lavenderLine bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-lavender text-slate">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Date</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Reg number</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Car</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Memorable Info</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Option selected</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Redirected to</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate">
                    No submissions yet.
                  </td>
                </tr>
              )}
              {leads.map((lead: any) => (
                <tr key={lead.id} className="admin-row-line text-ink">
                  <td className="whitespace-nowrap px-4 py-3 text-slate">
                    {new Date(lead.createdAt).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {lead.regNumber || <span className="text-slate">—</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="flex items-center gap-2">
                      {lead.carImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={lead.carImageUrl}
                          alt=""
                          className="h-7 w-11 rounded object-cover"
                        />
                      ) : (
                        <span className="flex h-7 w-11 items-center justify-center rounded bg-lavender text-slate">
                          🚗
                        </span>
                      )}
                      {lead.carMake} {lead.carModel}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-slate-800">
                    {lead.memorableInfo || <span className="text-slate">—</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.optionLabel}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate">
                    <a
                      href={lead.redirectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {lead.redirectUrl}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}