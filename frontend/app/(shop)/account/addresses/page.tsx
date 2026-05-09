export default function AddressesPage() {
  return (
    <div>
      <h2 className="font-heading text-2xl">Addresses</h2>
      <p className="mt-2 text-sm text-secondary">
        Saved shipping and billing addresses for one-tap checkout.
      </p>
      <div className="mt-6 border border-dashed border-border p-10 text-center text-sm text-secondary">
        You don't have any saved addresses yet. Place an order to save your
        shipping details automatically.
      </div>
    </div>
  );
}
