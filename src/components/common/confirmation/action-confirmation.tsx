"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Spinner from "../spinner/spinner";

interface Props {
  type?: "notify" | "danger";
  icon?: ReactNode;
  header: string;
  subHeader?: string;
  headerAlignment?: "left" | "center" | "right";
  message?: any;
  selectorLabel?: string;
  labelDescription?: string;
  result?: "single" | "multiple";
  resultRequired?: boolean;
  options?: { label: string; value: string }[];
  customInput?: boolean;
  onYes: Function;
  yesText?: string;
  cancelOption?: boolean;
  onNo?: Function;
  noText?: string;
  loading?: boolean;
  children: ReactNode;
  optionalConfirmation?: boolean;
  optionalStatus?: boolean;
  size?: string;
}

export function Confirmation(props: Props) {
  const [inputData, setInputData] = useState("");
  const [radioValue, setRadioValue] = useState<string>();
  const [checkBoxValue, setCheckBoxValue] = useState<string[]>([]);
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState("");

  function getResult() {
    if (props.result === "single") {
      if (props.resultRequired && (radioValue || inputData)) {
        return radioValue ?? inputData;
      } else {
        setError("Please select an item!");
        return -1;
      }
    } else if (props.result === "multiple") {
      if (props.resultRequired && (checkBoxValue.length > 0 || inputData)) {
        if (inputData) {
          setCheckBoxValue([...checkBoxValue, inputData]);
        }
        return checkBoxValue;
      } else {
        setError("Please select at least one item or write your input!");
        return -1;
      }
    }
    return undefined;
  }

  return (
    <>
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <div className="flex flex-col items-center">
              {props.icon && <div className="mb-3">{props.icon}</div>}
              <DialogTitle className="text-lg font-bold">
                {props.header}
              </DialogTitle>
              {props.subHeader && (
                <DialogDescription>{props.subHeader}</DialogDescription>
              )}
            </div>
          </DialogHeader>

          {props.message && (
            <p className="my-3 text-gray-600">{props.message}</p>
          )}

          {/* Single Selection */}
          {props.result === "single" && props.options && (
            <div className="overflow-x-auto mx-2">
              <p className="font-medium">{props.selectorLabel}</p>
              <p className="text-sm text-gray-500">{props.labelDescription}</p>
              <RadioGroup
                value={radioValue}
                onValueChange={setRadioValue}
                className="flex flex-col space-y-2 mt-2"
              >
                {props.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <label htmlFor={option.value}>{option.label}</label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Multiple Selection */}
          {props.result === "multiple" && props.options && (
            <div className="overflow-x-auto mx-2">
              <p className="font-medium">{props.selectorLabel}</p>
              <p className="text-sm text-gray-500">{props.labelDescription}</p>
              <div className="flex flex-col space-y-2 mt-2">
                {props.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      checked={checkBoxValue.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCheckBoxValue([...checkBoxValue, option.value]);
                        } else {
                          setCheckBoxValue(
                            checkBoxValue.filter((v) => v !== option.value)
                          );
                        }
                      }}
                    />
                    <label>{option.label}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Input */}
          {props.customInput && (
            <div>
              <p className="font-medium mt-4">Or other</p>
              <Textarea
                value={inputData}
                rows={4}
                placeholder="Max length: 100 characters"
                maxLength={100}
                onChange={(event) => setInputData(event.target.value)}
              />
            </div>
          )}

          <Separator className="my-4" />

          {/* Error Message */}
          {error && (
            <p className="text-red-500 font-semibold my-2">* {error}</p>
          )}

          {/* Footer */}
          <DialogFooter className="flex justify-end space-x-3">
            {props.cancelOption && (
              <Button
                variant="outline"
                onClick={() => {
                  setOpened(false);
                  props.onNo?.();
                }}
              >
                {props.noText ?? "Cancel"}
              </Button>
            )}
            <Button
              className={`${
                props.type === "danger" ? "bg-red-600" : "bg-blue-600"
              } text-white`}
              onClick={() => {
                const result = getResult();
                if (result !== -1) {
                  setOpened(false);
                  props.onYes(result);
                }
              }}
            >
              {props?.loading && <Spinner />} {props.yesText ?? "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clickable Trigger */}
      <div
        onClick={() => {
          if (props.optionalConfirmation && !props.optionalStatus) {
            props.onYes();
          } else {
            setOpened(true);
          }
        }}
      >
        {props.children}
      </div>
    </>
  );
}
