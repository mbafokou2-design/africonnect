import HeroBanner   from '../../components/hero/HeroBanner'
import PostComposer from '../../components/composer/PostComposer'
import Feed         from '../../components/feed/Feed'

export default function Home({ composerOpen, onComposerClose }) {
  return (
    <>
      <HeroBanner />
      <PostComposer forceOpen={composerOpen} onClose={onComposerClose} />
      <Feed />
    </>
  )
}