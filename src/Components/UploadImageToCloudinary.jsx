export const UploadImageToCloudinary = async file => {
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', 'unsigned_preset')
  data.append('cloud_name', 'dv71q60kp')

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/dv71q60kp/image/upload',
    {
      method: 'POST',
      body: data
    }
  )
  const result = await res.json()
  return result.secure_url
}
