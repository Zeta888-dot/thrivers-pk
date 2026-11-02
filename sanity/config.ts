import { defineConfig } from 'sanity'
import { structureTool, type StructureBuilder, type StructureResolver } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { BasketIcon, EarthGlobeIcon, HomeIcon, PackageIcon, TagIcon, ThLargeIcon } from '@sanity/icons'
import { schemaTypes } from './schemas'

const originFilter = (origin: 'thrivers' | 'chitral_special') =>
  `coalesce(origin, "thrivers") == "${origin}"`

const categoryOrdering = [
  { field: 'order', direction: 'asc' as const },
  { field: 'name', direction: 'asc' as const },
]

const lineGroup = (
  S: StructureBuilder,
  title: string,
  origin: 'thrivers' | 'chitral_special',
  icon: typeof PackageIcon
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.list()
        .title(title)
        .items([
          S.listItem()
            .title('Products')
            .icon(PackageIcon)
            .child(
              S.documentTypeList('product')
                .title(`${title} · Products`)
                .filter(originFilter(origin))
            ),
          S.listItem()
            .title('Categories')
            .icon(TagIcon)
            .child(
              S.documentTypeList('category')
                .title(`${title} · Categories`)
                .filter(originFilter(origin))
                .defaultOrdering(categoryOrdering)
            ),
        ])
    )

const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      lineGroup(S, 'Thrivers Products', 'thrivers', PackageIcon),
      lineGroup(S, 'Chitral Special', 'chitral_special', EarthGlobeIcon),
      S.divider(),
      S.listItem()
        .title('Hero')
        .icon(HomeIcon)
        .child(S.documentTypeList('hero').title('Hero')),
      S.listItem()
        .title('Orders')
        .icon(BasketIcon)
        .child(S.documentTypeList('order').title('Orders')),
      S.divider(),
      S.listItem()
        .title('All Products')
        .icon(ThLargeIcon)
        .child(S.documentTypeList('product').title('All Products')),
      S.listItem()
        .title('All Categories')
        .icon(TagIcon)
        .child(
          S.documentTypeList('category')
            .title('All Categories')
            .defaultOrdering(categoryOrdering)
        ),
    ])

export default defineConfig({
  name: 'default',
  title: 'Thrivers PK',
  projectId: 'l9jivley',
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
