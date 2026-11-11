'use client'

import Link from 'next/link'
import { CaretRight } from '@phosphor-icons/react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

const SITE_URL = 'https://thrivers.pk'

export default function Breadcrumb({
  items,
  className = '',
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`scrollbar-hide w-full overflow-x-auto ${className}`}
    >
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-xs text-gray-500 md:gap-2 md:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5 md:gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded-sm transition-colors hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={
                    isLast
                      ? 'max-w-[45vw] truncate font-medium text-gray-900 md:max-w-[420px]'
                      : ''
                  }
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <CaretRight
                  size={12}
                  weight="light"
                  aria-hidden="true"
                  className="shrink-0 text-gray-400"
                />
              )}
            </li>
          )
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  )
}
