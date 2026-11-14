import type { CSSProperties, JSX } from 'react'

export interface IconProps {
  size?: number
  className?: string
  /** any value except 'none' shows the solid version, when the icon has one */
  fill?: string
  /** accepted so call sites stay simple; the artwork has a fixed line weight */
  strokeWidth?: number
  style?: CSSProperties
}

export type LucideIcon = (p: IconProps) => JSX.Element

/**
 * An icon from the app's own set. The PNG is used as a stencil (CSS mask) and
 * painted with the current text colour, so icons follow the theme palette.
 */
export function makeIcon(url: string, solidUrl?: string): LucideIcon {
  return function Icon({ size = 24, className, fill, style }: IconProps) {
    const src = solidUrl && fill && fill !== 'none' ? solidUrl : url
    const mask = `url("${src}")`
    return <span aria-hidden="true" className={className ? 'ic ' + className : 'ic'} style={{ width: size, height: size, WebkitMaskImage: mask, maskImage: mask, ...style }} />
  }
}
