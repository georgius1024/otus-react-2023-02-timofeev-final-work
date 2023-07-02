import WordAcrivityForm from '@/pages/Module/components/WordActivityForm';
import PhraseActivityForm from '@/pages/Module/components/PhraseActivityForm';
import SlideActivityForm from '@/pages/Module/components/SlideActivityForm';

import type { Module, Activity, WordActivity, PhraseActivity, SlideActivity } from "@/types";
type OnSubmit = (module: Module) => void;

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
    const name = `${activity.type} "${activityToken}"`
    props.onSubmit({ ...props.module, name, activity })
  }
  if (!props.module.activity) {
    return null
  }
  const formProps = { activity: props.module.activity, onSubmit: submitActivity }
  switch (props.module.activity.type) {
    case 'word':
      return <WordAcrivityForm {...formProps} />
    case 'phrase':
      return <PhraseActivityForm {...formProps} />
    case 'slide':
      return <SlideActivityForm {...formProps} />
    default:
      return null
  }
}
