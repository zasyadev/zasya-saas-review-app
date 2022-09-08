import {
  CheckboxIcon,
  DislikeIcon,
  LikeIcon,
  ScaleIcon,
  TextIcon,
} from "../../../assets/icons";
import { StarOutlined } from "@ant-design/icons";

export const INPUT_TYPE = "input";
export const TEXTAREA_TYPE = "textarea";
export const MULTIPLECHOICE_TYPE = "checkbox";
export const SCALE_TYPE = "scale";
export const YESNO_TYPE = "yesno";
export const RATING_TYPE = "rating";
export const checkInputOrTextarea = (type) =>
  [INPUT_TYPE, TEXTAREA_TYPE].includes(type);

export const QuestionTypeList = [
  {
    title: "Text",
    Icon: () => <TextIcon />,
    type: INPUT_TYPE,
  },
  {
    title: "Paragraph",
    Icon: () => <TextIcon />,
    type: TEXTAREA_TYPE,
  },

  {
    title: "Multiple Choice",
    Icon: () => <CheckboxIcon />,
    type: MULTIPLECHOICE_TYPE,
  },

  {
    title: "Opinion Scale",
    Icon: () => <ScaleIcon />,
    type: SCALE_TYPE,
  },
  {
    title: "Yes or No",
    Icon: () => (
      <div className=" mr-3">
        <p className="mb-0">
          <LikeIcon />
        </p>
        <p className="mt-1 mb-0">
          <DislikeIcon />
        </p>
      </div>
    ),
    type: YESNO_TYPE,
  },

  {
    title: "Rating",
    Icon: () => <StarOutlined />,
    type: RATING_TYPE,
  },
];
