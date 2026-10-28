'use client'
import { useTranslation } from 'react-i18next'
import { useInlineCopy } from '@/i18n/inline-copy'
import { NavigationRow, OverviewRow, Section } from './NavigationPrimitives'
import { PersonalizationShelfIcon, ResourcesShelfIcon } from './ShelfIcons'
import {
  DASHBOARD_GROUPS,
  PERSONALIZATION_GROUPS,
  visibleGroups,
  type DashboardGroup,
} from '@/components/space/dashboard-groups'
import { useCapabilityFilter } from '@/features/capabilities/useCapabilityCatalog'
import { navVisibleUnderPolicy } from './nav-entries'

function Shelf({ groups, titled }: { groups: DashboardGroup[]; titled: boolean }) {
  const tr = useInlineCopy()
  const available = useCapabilityFilter()
  return visibleGroups(groups, available).map(group => {
    const rows = group.items.map(row => (
      <NavigationRow key={row.key} href={row.href} label={tr(row.title)} icon={row.icon} />
    ))
    return titled ? (
      <Section key={group.label.en} title={tr(group.label)}>
        {rows}
      </Section>
    ) : (
      <div key={group.label.en} className="dt-navigation-section">
        {rows}
      </div>
    )
  })
}

/** The workspace's materials. */
export function ResourcesNavigation() {
  const { t } = useTranslation()
  return (
    <>
      <OverviewRow href="/space" label={t('navigation.allResources')} icon={ResourcesShelfIcon} />
      <Shelf groups={DASHBOARD_GROUPS} titled />
    </>
  )
}

/** What travels with the account into every workspace. */
export function PersonalizationNavigation({ allowedSurfaces }: { allowedSurfaces: readonly string[] | null }) {
  const { t } = useTranslation()
  const groups = PERSONALIZATION_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => item.href !== '/agents' || navVisibleUnderPolicy(item.href, allowedSurfaces)),
  }))
  return (
    <>
      <OverviewRow href="/personalization" label={t('navigation.allPersonalization')} icon={PersonalizationShelfIcon} />
      <Shelf groups={groups} titled={false} />
    </>
  )
}
