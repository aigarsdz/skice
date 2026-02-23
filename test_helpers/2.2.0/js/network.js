export async function importPlainText(url) {
  try {
    const response = await fetch(url)
    const textResponse = await response.text()

    return textResponse
  } catch (error) {
    console.error(error)

    return ''
  }
}
