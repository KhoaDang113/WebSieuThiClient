"use client"

import { Bell, Trash2 } from "lucide-react"
import { useNotification } from "./NotificationContext"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { useState } from "react"

export function NotificationDrawer() {
  const { notificationHistory, clearHistory } = useNotification()
  const [isOpen, setIsOpen] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-50 to-emerald-50",
          border: "border-l-4 border-green-500",
          iconBg: "bg-green-100",
          title: "text-green-900",
          message: "text-green-700",
        }
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-50 to-rose-50",
          border: "border-l-4 border-red-500",
          iconBg: "bg-red-100",
          title: "text-red-900",
          message: "text-red-700",
        }
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
          border: "border-l-4 border-yellow-500",
          iconBg: "bg-yellow-100",
          title: "text-yellow-900",
          message: "text-yellow-700",
        }
      case "info":
        return {
          bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
          border: "border-l-4 border-blue-500",
          iconBg: "bg-blue-100",
          title: "text-blue-900",
          message: "text-blue-700",
        }
      default:
        return {
          bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
          border: "border-l-4 border-blue-500",
          iconBg: "bg-blue-100",
          title: "text-blue-900",
          message: "text-blue-700",
        }
    }
  }

  const formatTime = (id: string) => {
    // Extract timestamp from notification id
    const timestamp = parseInt(id.split("-")[1])
    if (isNaN(timestamp)) return ""
    
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} ngày trước`
    if (hours > 0) return `${hours} giờ trước`
    if (minutes > 0) return `${minutes} phút trước`
    return "Vừa xong"
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full bg-[#008236] hover:bg-green-700 text-white transition-all duration-200 hover:scale-105"
        >
          <Bell className="w-5 h-5" />
          {notificationHistory.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
              {notificationHistory.length > 99 ? "99+" : notificationHistory.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <SheetTitle className="text-xl font-bold text-gray-900">
                Thông báo
              </SheetTitle>
            </div>
            {notificationHistory.length > 0 && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-500">
                  {notificationHistory.length} thông báo
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa tất cả</span>
                </Button>
              </div>
            )}
          </SheetHeader>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {notificationHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <Bell className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-600 mb-1">
                  Chưa có thông báo nào
                </p>
                <p className="text-sm text-gray-400">
                  Các thông báo mới sẽ xuất hiện ở đây
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notificationHistory.map((notification) => {
                  const styles = getStyles(notification.type)
                  return (
                    <div
                      key={notification.id}
                      className={`
                        ${styles.bg}
                        ${styles.border}
                        rounded-xl p-4
                        cursor-pointer
                        hover:shadow-lg hover:scale-[1.02]
                        transition-all duration-200 ease-in-out
                        border-t border-r border-b border-gray-200/50
                        backdrop-blur-sm
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon với background đẹp */}
                        <div className={`flex-shrink-0 ${styles.iconBg} rounded-full p-2.5`}>
                          {getIcon(notification.type)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-base ${styles.title} leading-tight mb-1.5`}>
                            {notification.title}
                          </h4>
                          {notification.message && (
                            <p className={`text-sm ${styles.message} leading-relaxed mb-2`}>
                              {notification.message}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <p className="text-xs text-gray-500 font-medium">
                              {formatTime(notification.id)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
