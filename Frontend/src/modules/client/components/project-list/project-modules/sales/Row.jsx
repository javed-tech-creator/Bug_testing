export default function Row({ no, name, unit }) {
  return (
    <tr className="border-b border-gray-300">
      <td className="p-3 border-r border-gray-300">{no}</td>
      <td className="p-3 border-r border-gray-300">{name}</td>
      <td className="p-3">{unit}</td>
    </tr>
  )
}
