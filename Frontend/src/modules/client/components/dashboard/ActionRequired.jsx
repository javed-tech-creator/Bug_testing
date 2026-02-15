import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

export default function ActionRequired() {
  const navigate = useNavigate()
  
  const [visibleCount, setVisibleCount] = useState(3)

  const allNotifications = [
    {
      id: 1,
      title: "Design waiting for approval",
      subtitle: "HQ Signage",
      time: "2h ago",
      action: "Review",
      priority: "high",
      isNew: true,
      route: "/client/project-list/project/24/design"
    },
    {
      id: 2,
      title: "Mockup waiting for approval",
      subtitle: "Retail Store",
      time: "5h ago",
      action: "Review",
      priority: "high",
      isNew: true,
      route: "/client/project-list/project/24/mockup"
    },
    {
      id: 3,
      title: "Payment due: Invoice #4023",
      subtitle: "Due Today",
      time: "1d ago",
      action: "Pay Now",
      priority: "medium",
      isNew: false,
      route: "/client/project-list/project/24/quotation"
    },
    {
      id: 4,
      title: "Production phase completed",
      subtitle: "Office Complex",
      time: "1d ago",
      action: "View",
      priority: "medium",
      isNew: false,
      route: "/client/project-list/project/24/production"
    },
    {
      id: 5,
      title: "Installation scheduled",
      subtitle: "Retail Store",
      time: "2d ago",
      action: "Check",
      priority: "high",
      isNew: false,
      route: "/client/project-list/project/24/installation"
    },
    {
      id: 6,
      title: "Recce report submitted",
      subtitle: "New Project",
      time: "3d ago",
      action: "Review",
      priority: "medium",
      isNew: false,
      route: "/client/project-list/project/24/recce"
    },
    {
      id: 7,
      title: "Sales inquiry received",
      subtitle: "Potential Client",
      time: "4d ago",
      action: "Respond",
      priority: "high",
      isNew: false,
      route: "/client/project-list/project/24/sales"
    },
    {
      id: 8,
      title: "Quote revision requested",
      subtitle: "Corporate Office",
      time: "5d ago",
      action: "Update",
      priority: "medium",
      isNew: false,
      route: "/client/project-list/project/24/quotation"
    }
  ]

  const loadMoreNotifications = () => {
    setVisibleCount(prev => Math.min(prev + 3, allNotifications.length))
  }

  const visibleNotifications = allNotifications.slice(0, visibleCount)
  const hasMore = visibleCount < allNotifications.length

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col shadow-sm">
      {/* Header matching the screenshot */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold text-base">Action Required</span>
        </div>
        <span className="bg-white/25 text-white px-2.5 py-0.5 rounded-full text-sm font-semibold min-w-[28px] text-center">
          {allNotifications.length}
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-2">
          {visibleNotifications.map((notification) => (
            <ActionItem
              key={notification.id}
              title={notification.title}
              subtitle={notification.subtitle}
              time={notification.time}
              action={notification.action}
              priority={notification.priority}
              isNew={notification.isNew}
              onClick={() => navigate(notification.route)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-3 border-t border-gray-100 flex-shrink-0">
        {hasMore ? (
          <button 
            onClick={loadMoreNotifications}
            className="w-full border-2 border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Load More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-xs opacity-75">({allNotifications.length - visibleCount} more)</span>
          </button>
        ) : (
          <p className="text-center text-sm text-gray-400">
            All notifications loaded
          </p>
        )}
      </div>
    </div>
  )
}

function ActionItem({ title, subtitle, time, action, priority, isNew, onClick }) {
  const priorityStyles = {
    high: {
      border: "border-l-4 border-l-red-500",
      button: "bg-red-600 hover:bg-red-700 text-white"
    },
    medium: {
      border: "border-l-4 border-l-orange-500",
      button: "bg-orange-600 hover:bg-orange-700 text-white"
    }
  }

  const style = priorityStyles[priority]

  return (
    <div 
      className={`relative bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer ${style.border}`}
      onClick={onClick}
    >
      {/* New Badge */}
      {isNew && (
        <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm z-20">
          New
        </span>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{subtitle}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {time}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        className={`text-sm px-4 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 cursor-pointer ${style.button}`}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        {action}
      </button>
    </div>
  )
}