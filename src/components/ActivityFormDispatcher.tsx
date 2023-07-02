import WordAcrivityForm from '@/components/WordActivityForm';
import PhraseActivityForm from '@/components/PhraseActivityForm';
import SlideActivityForm from '@/components/SlideActivityForm';

import type { Module } from "@/types";

type OnSubmit = (module: Module) => void;

type ActivityFormProps = {
  module: Module;
  onSubmit: OnSubmit;
};

export default function ActivityForm(props: ActivityFormProps) {
  switch (props.module.activity?.type) {
    case 'word':
      return <WordAcrivityForm {...props} />
    case 'phrase':
      return <PhraseActivityForm {...props} />
    case 'slide':
      return <SlideActivityForm {...props} />
    default:
      return null
  }
}
