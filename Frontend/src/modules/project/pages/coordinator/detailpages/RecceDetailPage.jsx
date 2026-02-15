import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RecceDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 bg-white p-4 border rounded shadow-sm">
				<button
					onClick={() => navigate(-1)}
					className="p-2 border rounded bg-gray-50"
				>
					<ArrowLeft size={18} />
				</button>
				<div>
					<h1 className="font-bold text-lg">Recce Detail</h1>
					<p className="text-xs text-gray-500">Project ID: {id || "N/A"}</p>
				</div>
			</div>

			<div className="bg-white p-4 border rounded shadow-sm text-sm text-gray-600">
				This page is under construction.
			</div>
		</div>
	);
};

export default RecceDetailPage;
