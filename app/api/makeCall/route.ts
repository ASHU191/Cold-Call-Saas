import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

const client = twilio(accountSid, authToken)

const generateTwiML = (): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-US">
        Hello! This is an AI cold call demo from your Next.js application. 
        This call was initiated using Twilio's Programmable Voice API. 
        Thank you for testing our system. Have a great day!
    </Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-US">
        Goodbye!
    </Say>
</Response>`
}

export async function POST(request: NextRequest) {
  try {
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error("Twilio credentials missing")
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error. Twilio credentials check karein.",
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { phoneNumber } = body

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number required hai.",
        },
        { status: 400 },
      )
    }

    const cleanedPhoneNumber = phoneNumber.replace(/\s+/g, "").trim()

    if (cleanedPhoneNumber.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid phone number enter karein (kam se kam 10 digits).",
        },
        { status: 400 },
      )
    }

    const twiml = generateTwiML()

    const call = await client.calls.create({
      twiml: twiml,
      to: cleanedPhoneNumber,
      from: twilioPhoneNumber,
      timeout: 30,
      record: false,
    })

    console.log(`Call successful! Call SID: ${call.sid}`)

    return NextResponse.json({
      success: true,
      message: `Call successfully start hui: ${cleanedPhoneNumber}`,
      callSid: call.sid,
    })
  } catch (error: any) {
    console.error("Call error:", error)

    if (error.code) {
      let userMessage = "Call nahi ho saki."

      switch (error.code) {
        case 21211:
          userMessage = "Phone number format galat hai."
          break
        case 21214:
          userMessage = "Phone number ya caller ID invalid hai."
          break
        case 21217:
          userMessage = "Phone number reachable nahi hai."
          break
        case 21218:
          userMessage = "Phone number format galat hai."
          break
        case 21401:
          userMessage = "Twilio credentials galat hain."
          break
        case 21403:
          userMessage = "Twilio account permissions check karein."
          break
        case 21404:
          userMessage = "Twilio phone number nahi mila."
          break
        default:
          userMessage = `Twilio error: ${error.message}`
      }

      return NextResponse.json(
        {
          success: false,
          message: userMessage,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error. Phir try karein.",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: "POST method use karein calls ke liye." }, { status: 405 })
}
