import { usePageData } from '@runtime'
import HomeFeatures from '../components/HomeFeatures'
import HomeHero from '../components/HomeHero'

const HomeLayout = () => {
  const { frontmatter } = usePageData()
  return (
    <div>
      <HomeHero hero={frontmatter.hero} />
      <HomeFeatures features={frontmatter.features} />
    </div>
  )
}

export default HomeLayout
