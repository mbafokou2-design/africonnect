import HeroBanner   from '../../components/hero/HeroBanner'
import PostComposer from '../../components/composer/PostComposer'
import Feed         from '../../components/feed/Feed'

export default function Home() {
  return (
    <>
      <HeroBanner />
      {/* Desktop composer — hidden on mobile via CSS */}
      <div className="home-composer-desktop">
        <PostComposer />
      </div>
      <Feed />
    </>
  )
}