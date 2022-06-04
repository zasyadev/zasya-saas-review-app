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
import React from "react";
import CloseIcon from "../../assets/images/close-line.svg";
import DeleteIcon from "../../assets/images/delete.svg";
import EyeIcon from "../../assets/images/eye.svg";

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
}) => {
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
                {/* <Input
                  placeholder={questionText + " " + Number(idx + 1)}
                  defaultValue={questionText}
                  onChange={(e) => {
                    handleQuestionValue(e.target.value, idx);
                  }}
                /> */}
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
              {/* <InputLabel id="demo-simple-select-standard-label">
                Type
              </InputLabel> */}
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
                {/* <MenuItem value={"selectbox"}>Selectbox</MenuItem> */}
              </Select>
              {/* <Select
                placeholder="Select Type"
                value={type}
                onChange={(e) => formTypeonChange(e)}
              >
                <Select.Option value={"input"}>Input Box</Select.Option>
                <Select.Option value={"checkbox"}>CheckBox</Select.Option>
                <Select.Option value={"textarea"}>TextArea</Select.Option>
                <Select.Option value={"selectbox"}>Selectbox</Select.Option>
              </Select> */}
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
                            marginLeft: "-5px",
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
            {/* 
            {type === "selectbox" && (
              <Select className="w-1/2">
                <Select.Option placeholder="Options">Options</Select.Option>
              </Select>
            )}  */}
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
