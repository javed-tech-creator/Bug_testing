import React from 'react'
import ProductionProfileDropdown from './ProductionProfileDropdown'

const ProductionNavbar = () => {
  return (
  <header className="bg-white z-50 shadow-sm border-b fixed w-screen border-gray-200 px-6 py-[0.80rem] flex items-center justify-end">
      {/* Right Section */}
      <div className="flex items-center gap-1 ml-auto relative">
        <ProductionProfileDropdown />
      </div>
    </header>  )
}

export default ProductionNavbar