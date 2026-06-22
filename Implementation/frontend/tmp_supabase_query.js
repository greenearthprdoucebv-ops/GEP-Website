const { createClient } = require('supabase-js')
const url = 'https://ivecmpbgbmzrufefblda.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2ZWNtcGJnYm16cnVmZWZibGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMjAyNzEsImV4cCI6MjA5NzY5NjI3MX0.FMZFVF3e3mSJXV-73AUqBGxY0zpd7MFsBLWqotongNQ'
const supabase = createClient(url, key)

;(async () => {
  try {
    const { data, error, status } = await supabase.from('home_products').select('*')
    console.log('status', status)
    if (error) console.error('error', error)
    console.log('data', JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('caught', err)
  }
})()
