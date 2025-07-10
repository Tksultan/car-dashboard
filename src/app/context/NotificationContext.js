"use client"
import { createContext, useContext, useState } from "react"

const NotificationContext = createContext()

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type = "info") => {
    const id = Date.now()
    const notification = { id, message, type }

    setNotifications((prev) => [...prev, notification])

    // for removing notification after 5 seconds  
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

function NotificationContainer({ notifications, onRemove }) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
                ? "bg-red-500 text-white"
                : notification.type === "warning"
                  ? "bg-yellow-500 text-white"
                  : "bg-blue-500 text-white"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{notification.message}</span>
            <button onClick={() => onRemove(notification.id)} className="ml-2 text-white hover:text-gray-200">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
