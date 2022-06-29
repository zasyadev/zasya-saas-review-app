import { Typography } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";

const AnswerViewComponent = ({
  type,
  idx,
  id,
  questionText,
  option,
  handleAnswerChange,
  lowerLabel,
  higherLabel,
}) => {
  // const range = (min, max) =>
  //   [...Array(max - min + 1).keys()].map((i) => i + min);

  return (
    <>
      <div className=" py-2  ">
        <div className="px-8  mb-1">
          <p className="text-sm text-blue-900  font-semibold ">
            {" "}
            Question {idx + 1}.
          </p>
          <p className="text-sm"> {questionText}</p>
        </div>

        <div className="px-8 border-b-2 border-gray-100 ">
          <p className="text-sm text-blue-900  font-semibold ">Answer</p>
          {type === "checkbox" || type === "scale" ? (
            <div className="flex mb-2">
              <p className="text-sm">{option}</p>
              {/* <RadioGroup
              name="checkbox_option"
              // onChange={(e) => handleAnswerChange(id, e.target.value)}
              value={option}
            >
              <FormControlLabel
                control={<Radio className="mr-2" />}
                label={option}
                value={option}
              />
            </RadioGroup> */}
            </div>
          ) : null}
          {type == "input" || type === "textarea" ? (
            <TextField
              fullWidth={true}
              placeholder={type == "input" ? "Short Text" : "Long Text"}
              rows={1}
              value={option}
              disabled
            />
          ) : null}
        </div>
      </div>
      {/* <div className="  px-2 cursor-pointer" key={idx + "que"}>
        <div className="flex flex-col items-start ml-4 py-5 ">
          <Typography variant="subtitle1" className="ml-0">
            {idx + 1}. {questionText}
          </Typography>

          <div className="text-base my-3">Answer</div>

          {type === "checkbox" || type === "scale" ? (
            <div>
              <div className="flex">
                <RadioGroup
                  name="checkbox_option"
                  // onChange={(e) => handleAnswerChange(id, e.target.value)}
                  value={option}
                >
                  <FormControlLabel
                    control={<Radio className="mr-2" />}
                    label={option}
                    value={option}
                  />
                </RadioGroup>
              </div>
            </div>
          ) : null}
          {type == "input" || type === "textarea" ? (
            <TextField
              fullWidth={true}
              placeholder={type == "input" ? "Short Text" : "Long Text"}
              rows={1}
              value={option}
              disabled
            />
          ) : null}  */}

      {/* {type === "scale" (
          <div className="flex items-baseline w-full justify-around">
            <p>{options[0]?.optionText}</p>
            <RadioGroup
              name="scale"
              className="mx-3 flex justify-center"
              row
              onChange={(e) => handleAnswerChange(id, e.target.value)}
            >
              {Number(options[0]?.higherLabel) &&
                Number(options[0]?.lowerLabel) > -1 &&
                range.length > 0 &&
                range(
                  Number(options[0]?.lowerLabel),
                  Number(options[0]?.higherLabel)
                ).map((rg, index) => {
                  return (
                    <FormControlLabel
                      value={rg.toString()}
                      control={<Radio />}
                      label={rg}
                      labelPlacement="top"
                      key={index + "range"}
                    />
                  );
                })}
            </RadioGroup>
            <p>{options[1]?.optionText}</p>
          </div>
        )} */}
      {/* </div>
      </div> */}
    </>
  );
};

export default AnswerViewComponent;
