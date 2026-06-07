export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Listing Detail</h1>
      <p className="text-muted-foreground">Listing ID: {params.id}</p>
      <p className="text-muted-foreground">Listing detail page placeholder</p>
    </div>
  );
}
