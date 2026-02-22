import { useEffect } from 'react'

const defaults = {
  title: 'SSRK TRAVELS AND SELF DRIVE CARS | Premium Car Rental Service',
  description:
    'Premium self-drive and outstation car rental services with transparent pricing and quick booking.',
  keywords:
    'SSRK TRAVELS AND SELF DRIVE CARS, car rental, self drive pricing, outstation rentals, Narsampet car service',
  image:
    'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',
}

const setMeta = (name, content, property = false) => {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let tag = document.head.querySelector(selector)

  if (!tag) {
    tag = document.createElement('meta')
    if (property) {
      tag.setAttribute('property', name)
    } else {
      tag.setAttribute('name', name)
    }
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

function Seo({ title, description, keywords, image }) {
  useEffect(() => {
    const pageTitle = title || defaults.title
    const pageDescription = description || defaults.description
    const pageKeywords = keywords || defaults.keywords
    const pageImage = image || defaults.image
    const pageUrl = window.location.href

    document.title = pageTitle
    setMeta('description', pageDescription)
    setMeta('keywords', pageKeywords)
    setMeta('og:title', pageTitle, true)
    setMeta('og:description', pageDescription, true)
    setMeta('og:type', 'website', true)
    setMeta('og:image', pageImage, true)
    setMeta('og:url', pageUrl, true)
  }, [description, image, keywords, title])

  return null
}

export default Seo
