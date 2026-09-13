import { AdminFrame } from "@/components/admin/admin-frame";
import { ApplicationDetail } from "@/components/admin/application-detail";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AdminFrame>
      <ApplicationDetail id={id} />
    </AdminFrame>
  );
}
