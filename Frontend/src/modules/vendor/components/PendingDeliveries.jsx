const PendingDeliveries = ({ deliveries }) => (
  <div className="bg-white shadow rounded-xl p-4 mt-6">
    <h2 className="text-lg font-semibold mb-4">Pending Deliveries</h2>
    <ul className="divide-y">
      {deliveries.map((d, i) => (
        <li key={i} className="py-2 flex justify-between">
          <span>{d.productName}</span>
          <span className="text-sm text-yellow-600 font-medium">Pending</span>
        </li>
      ))}
    </ul>
  </div>
);

export default PendingDeliveries;


