import PostCard from './PostCard'
import feedPosts from '../../data/feedData'
import './Feed.css'

export default function Feed() {
  // Future: replace feedPosts with data from API
  // const [posts, setPosts] = useState([])
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_BASE_URL}/feed`)
  //     .then(r => r.json()).then(setPosts)
  // }, [])

  return (
    <div className="feed">
      {feedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}