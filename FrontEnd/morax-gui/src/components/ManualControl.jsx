import React, { useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
function ManualControl({joints, handleChangeJoint }) {
  
  //[ ] hacer que las joint sean variables 
  const jointList = ["J1", "J2", "J3"];

  return (
    <div className="w-[max(330px,20vw)] rounded-lg text-white bg-[#1F1F1F] border border-solid border-[#4A4A4A]">
      <div className="w-full rounded-t-lg bg-[#2B2B2B] py-2 px-5 font-bold text-xl">
        CONTROL ARTICULAR
      </div>

      <div className="flex flex-row gap-4 py-2 px-10 text-[#828282] w-full justify-between">
        {jointList.map((joint) => (
          <div key={joint} className="flex flex-col items-center">
            <h3 className="text-lg text-center">{joint}</h3>
            <div className="flex items-start">
              <input
                type="text"
                className="text-lg mb-3 w-[2.5rem] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                value={joints[joint]}
                onChange={(e) => handleChangeJoint(joint, e.target.value)}
              />
              <span>°</span>
            </div>

            <Slider.Root
              className="relative flex items-center justify-center select-none touch-none h-40 w-8 mb-5"
              min={(joint == "J1")?-180:(joint == "J3")?-135:-135}
              max={(joint == "J1")?180:(joint == "J3")?135:135}
              step={1}
              orientation="vertical"
              onValueChange={(val) => handleChangeJoint(joint, val)}
              value={[joints[joint]]}
            >
              <Slider.Track className="bg-[#2B2B2B] relative rounded-full w-2 h-full mx-auto overflow-hidden hover:cursor-pointer">
                <Slider.Range className="absolute bg-[#00FFFF] rounded-full w-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-4 h-4 bg-[#00FFFF] rounded-full hover:cursor-pointer" />
            </Slider.Root>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManualControl;
