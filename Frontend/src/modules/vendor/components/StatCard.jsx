import {Link} from 'react-router-dom'
const StatCard = ({ title, value, icon,url }) => (


  
<Link
to={url}
 className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 hover:border-blue-200">
  <div className="bg-gradient-to-br from-indigo-100 to-blue-200 text-indigo-700 p-4 rounded-full text-2xl shadow-inner flex items-center justify-center w-12 h-12">
    {icon}
  </div>
  <div>
    <h4 className="text-sm text-gray-500 uppercase tracking-wider">{title}</h4>
    <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
  </div>
</Link>


);

export default StatCard;
