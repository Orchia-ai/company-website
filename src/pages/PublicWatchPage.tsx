import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { PublicVideoBatchPlayer } from '../features/public-video/PublicVideoBatchPlayer'

export default function PublicWatchPage() {
  const { publicId = '' } = useParams<{ publicId: string }>()
  return (
    <>
      <Helmet>
        <title>Video player · Orchia</title>
        <meta
          name="description"
          content="Live progress and public playback for an Orchia Video Batch."
        />
      </Helmet>
      {publicId ? <PublicVideoBatchPlayer publicId={publicId} /> : null}
    </>
  )
}
