export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  amazon_url: string
  category: string
  images: string[]
  features: string[]
  tag: string | null
  color: string
  emoji: string
  rating: number
  review_count: number
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export type Subscriber = {
  id: string
  email: string
  source: string
  discount_sent: boolean
  created_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string
  tag: string
  read_time: string
  is_published: boolean
  published_at: string
  created_at: string
}