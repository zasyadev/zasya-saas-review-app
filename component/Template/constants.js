export const TemplateStepsArray = [
  {
    id: 0,
    key: "template_title",
    title: "Template Title",
  },
  {
    id: 1,
    key: "template_question",
    title: "Create Your Questions",
  },
  {
    id: 2,
    key: "template_preview",
    title: "Preview And Launch",
  },
];

export const MY_TEMPLATE_KEY = "My Template";
export const DEFAULT_TEMPLATE_KEY = "Default Template";

export const TemplateToggleList = [
  {
    label: MY_TEMPLATE_KEY,
  },
  {
    label: DEFAULT_TEMPLATE_KEY,
  },
];

export const DefaultMotionVarient = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.5,
      delayChildren: 0.5,
    },
  },
};
