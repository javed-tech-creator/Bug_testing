import Section from "../../../components/project-list/project-modules/racce/Section"
import ProductRecce from "../../../components/project-list/project-modules/racce/ProductRecce"
import ImageCard from "../../../components/project-list/project-modules/racce/ImageCard"
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom"
import ReviewModal from "../../../components/project-list/project-modules/racce/ReviewModal"
import { useState } from "react";

export default function RecceDetails() {
    const [openReview, setOpenReview] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const navigate = useNavigate()
    
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
                <button className="text-xl cursor-pointer" onClick={() => navigate(-1)}>
                    <Icons.ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-semibold">Recce Details</h1>
            </div>

            {/* Executive */}
            <Section title="Recce Executive">
                <div className="flex justify-between items-center ">
                    <div className="flex items-center gap-4">
                        <img
                            src="https://i.pravatar.cc/100?img=12"
                            alt="Rajesh Kumar"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-lg font-semibold">Rajesh Kumar</h2>
                            <div className="flex gap-4 mt-2 text-sm">
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md">
                                    📞 0987654321
                                </span>
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md">
                                    ✉️ rahulverma.partners@gmail.com
                                </span>
                            </div>
                        </div>
                    </div>

                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                        Recce Conducted On: October 15, 2024
                    </span>
                </div>
            </Section>

            {/* Site Images */}
            <Section title="Site Images (Raw Recce Images)">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ImageCard 
                        label="Main Facade View" 
                        imageSrc="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&h=500&fit=crop"
                        onClick={() => setSelectedImage("https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=800&fit=crop")} 
                    />
                    <ImageCard 
                        label="Lobby Reception Wall" 
                        imageSrc="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&h=500&fit=crop"
                        onClick={() => setSelectedImage("https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop")} 
                    />
                    <ImageCard 
                        label="Entrance Hall" 
                        imageSrc="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop"
                        onClick={() => setSelectedImage("https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop")} 
                    />
                    <ImageCard 
                        label="Signage Details" 
                        imageSrc="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=500&fit=crop"
                        onClick={() => setSelectedImage("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop")} 
                    />
                </div>
            </Section>

            {/* Product Sections */}
            <ProductRecce title="1. Main Facade Signage" />
            <ProductRecce title="2. Reception Backdrop Logo" />

            {openReview && <ReviewModal onClose={() => setOpenReview(false)} />}

            {/* Image Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl max-h-[90vh] p-4 animate-zoom-in">
                        <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all cursor-pointer"
                        >
                            <Icons.X size={24} />
                        </button>
                        <img 
                            src={selectedImage} 
                            alt="Full size" 
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

        </div>
    )
}