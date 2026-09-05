import { Helmet } from 'react-helmet-async'
import { PublicProjectCreator } from '../features/public-video/PublicProjectCreator'

export default function PublicCreatePage() {
  return (
    <>
      <Helmet>
        <title>Create a video · Orchia</title>
        <meta
          name="description"
          content="Turn an idea, product, or business story into a social video with automatic production. Create, follow progress, and download without signing in."
        />
      </Helmet>
      <PublicProjectCreator />
    </>
  )
}
