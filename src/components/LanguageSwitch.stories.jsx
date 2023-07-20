import LanguageSwitch from "./LanguageSwitch"
export default {
  component: LanguageSwitch,
  title: 'LanguageSwitch',
  argTypes: {
    onSelect: {
      table: {
        disable: true,
      },
    },
  },  
  };


export const En = {
  args: {
    current: 'en'
  },
  component: <LanguageSwitch current="en"/>
};

export const Ru = {
  args: {
    current: 'ru'
  },
  component: <LanguageSwitch current="ru"/>
};