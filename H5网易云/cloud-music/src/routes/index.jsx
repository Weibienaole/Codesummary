import React, { lazy, Suspense } from 'react'
import { Redirect } from 'react-router-dom'

import Home from '../application/Home'

const RecommendComponent = lazy(() => import('../application/Recommend'))
const RankComponent = lazy(() => import('../application/Rank'))
const AlbumComponent = lazy(() => import('../application/Album'))
const SingerComponent = lazy(() => import('../application/Singer'))
const SingersComponent = lazy(() => import('../application/Singers'))
const SearchComponent = lazy(() => import('../application/Search'))

const SequenceComponent = (Component) => (props) => {
  return (
    <Suspense fallback={'loading...'}>
      <Component {...props}></Component>
    </Suspense>
  )
}

const routes = [
  {
    path: '/',
    component: Home,
    routes: [
      {
        path: '/',
        exact: true,
        render: () => <Redirect to={'/recommend'} />
      },
      {
        path: '/recommend',
        component: SequenceComponent(RecommendComponent),
        routes: [
          {
            path: '/recommend/:id',
            component: SequenceComponent(AlbumComponent)
          }
        ]
      },
      {
        path: '/singers',
        component: SequenceComponent(SingersComponent),
        key: 'singers',
        routes: [
          {
            path: '/singers/:id',
            component: SequenceComponent(SingerComponent)
          }
        ]
      },
      {
        path: '/rank',
        component: SequenceComponent(RankComponent),
        routes: [
          {
            path: '/rank/:id',
            component: SequenceComponent(AlbumComponent)
          }
        ]
      },
      {
        path: '/search',
        component: SequenceComponent(SearchComponent),
        exact: true,
        key: 'search'
      },
      {
        path: '/album/:id',
        exact: true,
        key: 'album',
        component: SequenceComponent(AlbumComponent)
      }
    ]
  }
]

export default routes
