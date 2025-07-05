"use client"

import type React from "react"

import { useState } from "react"
import { Phone, Loader2, CheckCircle, XCircle, Users, Clock, TrendingUp } from "lucide-react"

interface CallResponse {
  success: boolean
  message: string
  callSid?: string
}

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [callStatus, setCallStatus] = useState<CallResponse | null>(null)
  const [callHistory, setCallHistory] = useState<
    Array<{
      number: string
      status: string
      time: string
      callSid?: string
    }>
  >([])

  const handleMakeCall = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic phone number validation
    if (!phoneNumber.trim()) {
      setCallStatus({
        success: false,
        message: "Please enter a phone number",
      })
      return
    }

    // Simple phone number format validation
    const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/
    if (!phoneRegex.test(phoneNumber)) {
      setCallStatus({
        success: false,
        message: "Please enter a valid phone number (e.g., +1234567890)",
      })
      return
    }

    setIsLoading(true)
    setCallStatus(null)

    try {
      const response = await fetch("/api/makeCall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      })

      const data: CallResponse = await response.json()
      setCallStatus(data)

      // Add to call history
      const newCall = {
        number: phoneNumber.trim(),
        status: data.success ? "Success" : "Failed",
        time: new Date().toLocaleTimeString(),
        callSid: data.callSid,
      }
      setCallHistory((prev) => [newCall, ...prev.slice(0, 9)]) // Keep last 10 calls
    } catch (error) {
      setCallStatus({
        success: false,
        message: "Failed to make call. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setPhoneNumber("")
    setCallStatus(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Cold Calling System</h1>
                <p className="text-sm text-gray-600">Automated calling ke liye</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Total Calls: {callHistory.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">
                  Success: {callHistory.filter((call) => call.status === "Success").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calling Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Make Cold Call</h2>
                <p className="text-gray-600">Phone number enter karke call start karein</p>
              </div>

              <form onSubmit={handleMakeCall} className="space-y-6">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Country code ke saath enter karein (jaise +92 Pakistan ke liye)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Making Call...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-6 h-6" />
                      <span>Make Call</span>
                    </>
                  )}
                </button>
              </form>

              {callStatus && (
                <div
                  className={`mt-8 p-6 rounded-xl ${
                    callStatus.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {callStatus.success ? (
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${callStatus.success ? "text-green-800" : "text-red-800"}`}>
                        {callStatus.success ? "Call Initiated Successfully!" : "Call Failed"}
                      </h3>
                      <p className={`text-sm mt-1 ${callStatus.success ? "text-green-700" : "text-red-700"}`}>
                        {callStatus.message}
                      </p>
                      {callStatus.callSid && (
                        <p className="text-xs text-green-600 mt-2 font-mono">Call ID: {callStatus.callSid}</p>
                      )}
                    </div>
                  </div>

                  <button onClick={resetForm} className="mt-4 text-sm text-gray-600 hover:text-gray-800 underline">
                    Make Another Call
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Call History Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Clock className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Calls</h3>
              </div>

              {callHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Abhi tak koi call nahi hui</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {callHistory.map((call, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 text-sm">{call.number}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            call.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {call.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{call.time}</span>
                        {call.callSid && <span className="font-mono">{call.callSid.slice(-8)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 mt-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Call Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Calls:</span>
                  <span className="font-bold">{callHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Successful:</span>
                  <span className="font-bold text-green-200">
                    {callHistory.filter((call) => call.status === "Success").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Failed:</span>
                  <span className="font-bold text-red-200">
                    {callHistory.filter((call) => call.status === "Failed").length}
                  </span>
                </div>
                {callHistory.length > 0 && (
                  <div className="flex justify-between pt-2 border-t border-white/20">
                    <span>Success Rate:</span>
                    <span className="font-bold">
                      {Math.round(
                        (callHistory.filter((call) => call.status === "Success").length / callHistory.length) * 100,
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Script Preview */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Call Script</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              <strong>AI Voice:</strong> "Hello! This is an AI cold call demo from your Next.js application. This call
              was initiated using Twilio's Programmable Voice API. Thank you for testing our system. Have a great day!
              Goodbye!"
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-3">Yeh message automatically play hoga jab call connect hogi</p>
        </div>
      </div>
    </div>
  )
}
