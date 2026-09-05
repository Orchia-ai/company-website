import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { PublicAgentPlayer } from '../features/public-video/PublicAgentPlayer'

export default function PublicResultPage() {
  const { publicId = '' } = useParams<{ publicId: string }>()
  return (
    <>
      <Helmet>
        <title>Final Player · Orchia</title>
        <meta
          name="description"
          content="Live progress and final playback for a public Orchia Agent project."
        />
      </Helmet>
      {publicId ? <PublicAgentPlayer publicId={publicId} /> : null}
    </>
  )
}
