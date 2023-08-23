import RouteService from './routeService'
import { describe, expect, test } from 'vitest'
import path from 'path'

describe('routeService', async () => {
  const testDir = path.join(__dirname, 'fixtures')
  const routeService = new RouteService(testDir)
  await routeService.init()

  test('conventional route file by structure', async () => {
    const routeMate = routeService.getRouteMeta().map((route) => ({
      ...route,
      absolutePath: route.absolutePath.replace(testDir, 'TEST_DIR')
    }))
    expect(routeMate).toMatchInlineSnapshot(`
      [
        {
          "absolutePath": "TEST_DIR/b.mdx",
          "routePath": "/b.mdx",
        },
        {
          "absolutePath": "TEST_DIR/guide/a.mdx",
          "routePath": "/guide/a.mdx",
        },
      ]
    `)
  })

  test('generate route code', async () => {
    const routeCode = routeService
      .generateRoutesCode()
      .replaceAll(testDir, 'TEST_DIR')
    expect(routeCode).toMatchInlineSnapshot(`
      "
            import React from 'react'
            import loadable from '@loadable/component'

            import Route0 from 'TEST_DIR/b.mdx'
      import Route1 from 'TEST_DIR/guide/a.mdx'

            export const routes = [
              { path: '/b', element: React.createElement(Route0) } ,
      { path: '/guide/a', element: React.createElement(Route1) } 
            ]
          "
    `)
  })
})
