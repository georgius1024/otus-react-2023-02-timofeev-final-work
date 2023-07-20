import WordActivityForm from '@/pages/Module/components/WordActivityForm';
import PhraseActivityForm from '@/pages/Module/components/PhraseActivityForm';
import SlideActivityForm from '@/pages/Module/components/SlideActivityForm';
import omit from "lodash.omit";

import type { Module, Activity, WordActivity, PhraseActivity, SlideActivity } from "@/types";
type OnSubmit = (module: Module) => void;

function ucfirst(str: string) {
  const [first, ...rest] = str
  return [first.toUpperCase(), ...rest].join('')
}
type ActivityFormProps = {
  module: Module;
  onSubmit: OnSubmit;
};

export default function ActivityForm(props: ActivityFormProps) {
  const submitActivity = (activity: Activity): void => {
    const activityToken = (() => {
      switch (activity.type) {
        case 'word':
          return (activity as WordActivity).word
        case 'phrase':
          return (activity as PhraseActivity).phrase
        case 'slide':
          return (activity as SlideActivity).header
      }
    })()
    // @ts-ignore
    const enabled = activity['enabled'] ?? true
    const name = `${ucfirst(activity.type)} "${activityToken}"`
    props.onSubmit({ ...props.module, enabled, name, activity: omit(activity, 'enabled') as Activity })
  }
  if (!props.module.activity) {
    return null
  }
  const formProps = { activity: props.module.activity, onSubmit: submitActivity }
  const formDomKey = [props.module?.id, props.module?.parent, props.module?.type, 'key'].filter(Boolean).join('-')
  switch (props.module.activity.type) {
    case 'word':
      return <WordActivityForm {...formProps} key={formDomKey} />
    case 'phrase':
      return <PhraseActivityForm {...formProps} key={formDomKey} />
    case 'slide':
      return <SlideActivityForm {...formProps} key={formDomKey} />
    default:
      return null
  }
}
