import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { Col, Row } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import CloseIcon from "../../assets/images/close-line.svg";
import DeleteIcon from "../../assets/images/delete.svg";
import EyeIcon from "../../assets/images/eye.svg";
import RadioGroup from "@material-ui/core/RadioGroup";

const QuestionComponent = ({
  type,
  idx,
  removeElement,
  defineType,
  questionText,
  options,
  open,
  showAsQuestion,
  handleExpand,
  addOption,
  handleQuestionValue,
  handleOptionValue,
  removeOption,
  lowerLabel,
  higherLabel,
  handleScaleOptionValue,
}) => {
  const range = (min, max) =>
    [...Array(max - min + 1).keys()].map((i) => i + min);

  return open ? (
    <div
      className=" border-l-8 rounded-l-md border-cyan-500 shadow-lg mt-8"
      key={idx + "questions"}
    >
      <div>
        <div className="w-full flex flex-col items-start px-4 py-5 ">
          <Row gutter={[8]} className="w-full">
            <Col md={16} xs={16}>
              <div className="flex justify-between w-full">
                <Typography style={{ marginTop: "20px" }}>
                  {idx + 1}.
                </Typography>
                <TextField
                  fullWidth={true}
                  placeholder="Question Text"
                  value={questionText}
                  rows={2}
                  rowsMax={20}
                  variant="filled"
                  onChange={(e) => {
                    handleQuestionValue(e.target.value, idx);
                  }}
                />
              </div>
            </Col>
            <Col md={8} xs={8}>
              <Select
                value={type}
                onChange={(e) => defineType(e.target.value, idx)}
                label="Type"
                variant="filled"
                className="w-full"
              >
                <MenuItem value={"input"}>Input Box</MenuItem>
                <MenuItem value={"checkbox"}>CheckBox</MenuItem>
                <MenuItem value={"textarea"}>TextArea</MenuItem>
                <MenuItem value={"scale"}>Linear Scale</MenuItem>
              </Select>
            </Col>
          </Row>

          <div className="mt-5 mb-2 w-full">
            {type === "input" && (
              <TextField
                fullWidth={true}
                placeholder="Short Text "
                rows={1}
                disabled
              />
            )}
            {type === "checkbox" && (
              <>
                {options.map((op, j) => (
                  <div key={j}>
                    <div className="flex flex-row -ml-4 justify-between py-2">
                      <Radio disabled />
                      <TextField
                        fullWidth={true}
                        placeholder="Option Text"
                        multiline={true}
                        value={op.optionText}
                        onChange={(e) => {
                          handleOptionValue(e.target.value, idx, j);
                        }}
                      />
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          removeOption(idx, j);
                        }}
                      >
                        <Image
                          src={CloseIcon}
                          alt="Close "
                          width={20}
                          height={20}
                        />
                      </IconButton>
                    </div>
                  </div>
                ))}
                {options.length < 5 ? (
                  <div>
                    <FormControlLabel
                      disabled
                      control={<Radio />}
                      label={
                        <Button
                          size="small"
                          onClick={() => {
                            addOption(idx);
                          }}
                          style={{
                            textTransform: "none",
                          }}
                        >
                          Add Option
                        </Button>
                      }
                    />
                  </div>
                ) : (
                  ""
                )}
              </>
            )}

            {type === "textarea" && (
              <TextField
                fullWidth={true}
                placeholder="Long Description Text "
                rows={1}
                disabled
              />
            )}
            {type === "scale" && (
              <>
                <div className="flex items-center">
                  <Select
                    value={lowerLabel ?? 0}
                    onChange={(e) => {
                      handleScaleOptionValue(e.target.value, idx, "lowerLabel");
                    }}
                  >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                  </Select>

                  <p className="mx-4">To </p>

                  <Select
                    value={higherLabel ?? 5}
                    onChange={(e) => {
                      handleScaleOptionValue(e.target.value, idx, "highLabel");
                    }}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                  </Select>
                </div>
                {options.length > 1 && (
                  <>
                    {" "}
                    <div className="flex flex-row  items-center py-2">
                      <p className="mr-4">{lowerLabel ?? 0}</p>
                      <TextField
                        placeholder="Scale Text"
                        multiline={true}
                        className="w-1/2"
                        onChange={(e) => {
                          handleOptionValue(e.target.value, idx, 0);
                        }}
                        value={options[0].optionText}
                      />
                    </div>
                    <div className="flex flex-row  items-center py-2">
                      <p className="mr-4">{higherLabel ?? 5}</p>
                      <TextField
                        placeholder="Scale Text"
                        multiline={true}
                        className="w-1/2"
                        onChange={(e) => {
                          handleOptionValue(e.target.value, idx, 1);
                        }}
                        value={options[1].optionText}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="mt-4 w-full border-t-2 px-4 py-2">
            <p className="text-right mt-1">
              {" "}
              <span
                onClick={() => showAsQuestion(idx)}
                className="cursor-pointer w-8 pr-2 border-r-2"
              >
                <Image src={EyeIcon} alt="Delete" width={20} height={20} />
              </span>
              <span
                onClick={() => removeElement(idx)}
                className="cursor-pointer mx-2 w-8 pr-2"
              >
                <Image src={DeleteIcon} alt="Delete" width={20} height={20} />
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="shadow-lg mt-8  px-2 cursor-pointer"
      onClick={() => handleExpand(idx)}
      key={idx + "close"}
    >
      <div className="flex flex-col items-start ml-4 py-5">
        <Typography variant="subtitle1" className="ml-0">
          {idx + 1}. {questionText}
        </Typography>

        {options?.length > 0 &&
          type === "checkbox" &&
          options?.map((op, j) => (
            <div key={j}>
              <div style={{ display: "flex" }}>
                <FormControlLabel
                  disabled
                  control={<Radio className="mr-2" />}
                  label={
                    <Typography style={{ color: "#555555" }}>
                      {op.optionText}
                    </Typography>
                  }
                />
              </div>
            </div>
          ))}
        {type == "input" || type === "textarea" ? (
          <TextField
            fullWidth={true}
            placeholder={type == "input" ? "Short Text" : "Long Text"}
            rows={1}
            disabled
          />
        ) : null}

        {type === "scale" && options?.length > 1 && (
          <div className="flex items-baseline w-full justify-around">
            <p>{options[0]?.optionText}</p>
            <RadioGroup name="scale" className="mx-3 flex justify-center" row>
              {higherLabel &&
                lowerLabel > -1 &&
                range.length > 0 &&
                range(lowerLabel, higherLabel).map((rg, index) => (
                  <FormControlLabel
                    value={rg}
                    control={<Radio />}
                    label={rg}
                    labelPlacement="top"
                    key={index + "range"}
                  />
                ))}
            </RadioGroup>
            <p>{options[1]?.optionText}</p>
          </div>
        )}
      </div>
      {/* <div>
        <div className="w-full flex flex-col items-start ml-4 pt-4 pb-5 ">
          <h4 className="mb-5 text-xl">{questionText}</h4>
           <Radio.Group>
            {options?.map((option, i) => (
              <Radio
                key={i + "rdoption"}
                className="w-full"
                value={option.optionText}
              >
                {option.optionText}
              </Radio>
            ))}
          </Radio.Group> 
        </div>
      </div> */}
    </div>
  );
};

export default QuestionComponent;
