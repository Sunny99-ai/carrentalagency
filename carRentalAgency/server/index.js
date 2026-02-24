import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import { Pingram } from 'pingram'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: '.env.server.local' })
dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || process.env.SERVER_PORT || 4000)
const MONGO_URI = process.env.MONGODB_URI
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const PINGRAM_SMS_ENABLED = String(process.env.PINGRAM_SMS_ENABLED || 'false').toLowerCase() === 'true'
const PINGRAM_API_KEY = process.env.PINGRAM_API_KEY || ''
const PINGRAM_BASE_URL = process.env.PINGRAM_BASE_URL || 'https://api.pingram.io'
const PINGRAM_EVENT_TYPE = process.env.PINGRAM_EVENT_TYPE || 'you_got_a_new_booking'
const PINGRAM_TO_ID = process.env.PINGRAM_TO_ID || ''
const PINGRAM_TO_NUMBER = process.env.PINGRAM_TO_NUMBER || ''

if (!MONGO_URI) {
  // eslint-disable-next-line no-console
  console.error('MONGODB_URI missing in env')
  process.exit(1)
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  // eslint-disable-next-line no-console
  console.error('Cloudinary credentials missing in env')
  process.exit(1)
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

const pingramClient = PINGRAM_API_KEY
  ? new Pingram({
    apiKey: PINGRAM_API_KEY,
    baseUrl: PINGRAM_BASE_URL,
  })
  : null

function buildBookingSmsMessage(booking) {
  const lines = [
    'New booking received',
    `ID: ${booking._id}`,
    `Name: ${booking.name || '-'}`,
    `Phone: ${booking.phone || '-'}`,
    `Trip: ${booking.tripType || '-'}`,
    `Pickup: ${booking.pickupLocation || '-'}`,
    `Date/Time: ${booking.date || '-'} ${booking.time || ''}`.trim(),
    `Car: ${booking.carType || '-'}`,
    `Amount: Rs ${booking.finalAmount ?? '-'}`,
    `Pay: ${booking.paymentStatus || '-'}`,
  ]

  if (booking.tripType === 'Self Drive') {
    lines.push(`Hours/KM: ${booking.selfDriveHours || '-'} / ${booking.selfDriveKm || '-'}`)
  } else {
    lines.push(`Drop: ${booking.dropLocation || '-'}`)
    lines.push(`KM/Days: ${booking.outstationKm || booking.billedKm || '-'} / ${booking.outstationDays || '-'}`)
  }

  return lines.join('\n')
}

async function sendPingramSmsAlert(booking) {
  if (!PINGRAM_SMS_ENABLED) return
  if (!PINGRAM_API_KEY || !PINGRAM_TO_NUMBER || !PINGRAM_TO_ID || !pingramClient) {
    // eslint-disable-next-line no-console
    console.warn('Pingram SMS skipped: missing Pingram env configuration')
    return
  }
  await pingramClient.send({
    type: PINGRAM_EVENT_TYPE,
    to: {
      id: PINGRAM_TO_ID,
      number: PINGRAM_TO_NUMBER,
    },
    sms: {
      message: buildBookingSmsMessage(booking),
    },
  })
}

const allowedOrigins = CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
if (!allowedOrigins.includes('http://localhost:5173')) allowedOrigins.push('http://localhost:5173')
if (!allowedOrigins.includes('http://localhost:5174')) allowedOrigins.push('http://localhost:5174')

const isLocalhostOrigin = (origin) => /^https?:\/\/localhost:\d+$/.test(origin)
const isVercelOrigin = (origin) => /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)?\.vercel\.app$/i.test(origin)

const isOriginAllowed = (origin) => {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true
  if (isLocalhostOrigin(origin)) return true
  if (isVercelOrigin(origin)) return true
  return false
}

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS origin not allowed'))
    }
  },
  credentials: true,
}

app.use(
  cors(corsOptions),
)
app.options(/.*/, cors(corsOptions))
app.use(express.json({ limit: '20mb' }))

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    pickupLocation: { type: String, required: true, trim: true },
    dropLocation: { type: String, default: '', trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    tripType: { type: String, enum: ['Self Drive', 'Outstation'], required: true },
    carType: { type: String, enum: ['5 Seater', '7 Seater'], required: true },
    acType: { type: String, enum: ['A/C', 'Non A/C'], default: 'A/C' },
    outstationKm: { type: String, default: '' },
    outstationDays: { type: String, default: '' },
    selfDriveHours: { type: String, default: '' },
    selfDriveKm: { type: String, default: '' },
    finalAmount: { type: Number, default: null },
    paymentOption: { type: String, enum: ['full', 'advance'], default: 'full' },
    paidAmount: { type: Number, default: null },
    remainingAmount: { type: Number, default: null },
    billedKm: { type: Number, default: null },
    paymentStatus: {
      type: String,
      enum: ['pending', 'under_verification', 'verified', 'failed'],
      default: 'pending',
    },
    paymentScreenshotUrl: { type: String, default: '' },
    paymentScreenshotPublicId: { type: String, default: '' },
    paymentScreenshotUploadedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
)

const paymentProofSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, trim: true },
    paymentScreenshotUrl: { type: String, required: true },
    paymentScreenshotPublicId: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: ['under_verification', 'verified', 'failed'],
      default: 'under_verification',
    },
  },
  { timestamps: true, versionKey: false },
)

const pricingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true, versionKey: false },
)

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema)
const PaymentProof = mongoose.models.PaymentProof || mongoose.model('PaymentProof', paymentProofSchema)
const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema)

const isDataImage = (value) => typeof value === 'string' && value.startsWith('data:image/')
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

async function uploadToCloudinary(dataImage, bookingId = '') {
  const result = await cloudinary.uploader.upload(dataImage, {
    folder: 'ssrk/payment-screenshots',
    public_id: bookingId ? `booking-${bookingId}-${Date.now()}` : `proof-${Date.now()}`,
    resource_type: 'image',
  })
  return { url: result.secure_url, publicId: result.public_id }
}

async function loadDefaultPricing() {
  const pricingFile = path.join(__dirname, '..', 'src', 'data', 'pricing.json')
  const file = await readFile(pricingFile, 'utf-8')
  const sanitized = file.replace(/^\uFEFF/, '').trim()
  try {
    return JSON.parse(sanitized)
  } catch (error) {
    throw new Error(`Invalid pricing.json format: ${error.message}`)
  }
}

function withAvailability(pricingData) {
  const current = pricingData || {}
  const currentAvailability = current.availability || {}

  return {
    ...current,
    availability: {
      selfDrive: {
        isAvailable: currentAvailability.selfDrive?.isAvailable ?? true,
        carsAvailable: currentAvailability.selfDrive?.carsAvailable ?? '',
      },
      outstation: {
        isAvailable: currentAvailability.outstation?.isAvailable ?? true,
        carsAvailable: currentAvailability.outstation?.carsAvailable ?? '',
      },
    },
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean()
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' })
  }
})

app.get('/api/pricing', async (req, res) => {
  try {
    const pricingDoc = await Pricing.findOne({ key: 'main' }).lean()
    if (!pricingDoc) {
      const seeded = await Pricing.create({
        key: 'main',
        data: withAvailability(await loadDefaultPricing()),
      })
      return res.json(seeded.data)
    }
    return res.json(withAvailability(pricingDoc.data))
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch pricing', error: error.message })
  }
})

app.put('/api/pricing', async (req, res) => {
  try {
    const nextPricing = withAvailability(req.body)
    if (!nextPricing?.selfDrive || !nextPricing?.outstation) {
      return res.status(400).json({ message: 'Invalid pricing payload' })
    }
    const updated = await Pricing.findOneAndUpdate(
      { key: 'main' },
      { data: nextPricing },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean()
    return res.json(updated.data)
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update pricing', error: error.message })
  }
})

app.get('/api/bookings/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking ID' })
    }
    const booking = await Booking.findById(req.params.id).lean()
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    return res.json(booking)
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
})

app.patch('/api/bookings/:id/payment-status', async (req, res) => {
  try {
    const { id } = req.params
    const { paymentStatus } = req.body
    const allowedStatus = ['verified', 'failed']

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' })
    }

    if (!allowedStatus.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' })
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true },
    ).lean()

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    await PaymentProof.findOneAndUpdate(
      { bookingId: String(id) },
      { paymentStatus },
      { sort: { createdAt: -1 } },
    )

    return res.json(updatedBooking)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update payment status', error: error.message })
  }
})

app.post('/api/bookings', async (req, res) => {
  try {
    const paymentScreenshotDataUrl = req.body.paymentScreenshotDataUrl || ''
    const hasPaymentScreenshot = Boolean(paymentScreenshotDataUrl)

    if (hasPaymentScreenshot && !isDataImage(paymentScreenshotDataUrl)) {
      return res.status(400).json({ message: 'Invalid image format' })
    }

    let uploadedImage = null
    if (hasPaymentScreenshot) {
      uploadedImage = await uploadToCloudinary(paymentScreenshotDataUrl)
    }

    const booking = await Booking.create({
      ...req.body,
      dropLocation: req.body.dropLocation || '',
      acType: req.body.acType || 'A/C',
      paymentStatus: hasPaymentScreenshot ? 'under_verification' : 'pending',
      paymentScreenshotUploadedAt: hasPaymentScreenshot ? new Date() : null,
      paymentScreenshotUrl: uploadedImage ? uploadedImage.url : '',
      paymentScreenshotPublicId: uploadedImage ? uploadedImage.publicId : '',
    })

    if (uploadedImage) {
      await PaymentProof.create({
        bookingId: String(booking._id),
        paymentScreenshotUrl: uploadedImage.url,
        paymentScreenshotPublicId: uploadedImage.publicId,
      })
    }

    sendPingramSmsAlert(booking.toObject()).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Pingram SMS failed:', error.message)
    })

    return res.status(201).json(booking.toObject())
  } catch (error) {
    return res.status(400).json({
      message: 'Failed to save booking',
      error: error.message,
      details: error?.errors ? Object.keys(error.errors) : [],
    })
  }
})

app.post('/api/bookings/:id/payment-screenshot', async (req, res) => {
  try {
    const { id } = req.params
    const { paymentScreenshotDataUrl } = req.body

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' })
    }
    if (!isDataImage(paymentScreenshotDataUrl)) {
      return res.status(400).json({ message: 'Invalid image format' })
    }

    const booking = await Booking.findById(id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const uploadedImage = await uploadToCloudinary(paymentScreenshotDataUrl, id)

    booking.paymentScreenshotUrl = uploadedImage.url
    booking.paymentScreenshotPublicId = uploadedImage.publicId
    booking.paymentStatus = 'under_verification'
    booking.paymentScreenshotUploadedAt = new Date()
    await booking.save()

    await PaymentProof.create({
      bookingId: String(id),
      paymentScreenshotUrl: uploadedImage.url,
      paymentScreenshotPublicId: uploadedImage.publicId,
    })

    return res.json(booking.toObject())
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to upload screenshot',
      error: error.message,
    })
  }
})

async function start() {
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(MONGO_URI)
    const pricingDoc = await Pricing.findOne({ key: 'main' })
    if (!pricingDoc) {
      await Pricing.create({
        key: 'main',
        data: withAvailability(await loadDefaultPricing()),
      })
    }
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

start()
