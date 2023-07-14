import "@/components/Placeholder.scss"

type PlaceholderProps = {
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
  mr?: boolean
};

export default function Placeholder(props: PlaceholderProps) {
  const propsToCss = (value?: number | string, auto = 'auto'): string => {

    if (typeof value === 'number') {
      return `${value}px`
    }
    if (typeof value === 'string') {
      return value
    }
    return auto
  }
  const style = {
    width: propsToCss(props.width),
    height: propsToCss(props.height, '48px'),
    borderRadius: props.rounded ? '100px' : '0',
    marginRight: props.mr ? '32px' : '0'
  }

  return <div className="placeholder-componemnt-class" style = {style} />
}