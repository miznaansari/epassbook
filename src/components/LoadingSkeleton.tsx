import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <>
    <div className="">
    <div className=" m-4  rounded-md border border-blue-300 p-4">
      <div className="flex animate-pulse items-center space-x-4">
        <div className="h-13 w-13 rounded bg-gray-300"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 rounded bg-gray-300"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-gray-300"></div>
              <div className="col-span-1 h-2 rounded bg-gray-300"></div>
            </div>
            <div className="h-2 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="flex">
  <div className=" w-1/2">
    <div className="mx-auto  ml-4 mr-2 max-w-sm rounded-md border border-blue-300 p-4">
      <div className="flex animate-pulse space-x-4">
      <div className="h-13 w-13 rounded bg-gray-300"></div>

        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 rounded bg-gray-300"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-gray-300"></div>
              <div className="col-span-1 h-2 rounded bg-gray-300"></div>
            </div>
            <div className="h-2 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  </div>   <div className=" w-1/2">
    <div className="mx-auto  mr-4 ml-2 max-w-sm rounded-md border border-blue-300 p-4">
      <div className="flex animate-pulse space-x-4">
      <div className="h-13 w-13 rounded bg-gray-300"></div>

        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 rounded bg-gray-300"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-gray-300"></div>
              <div className="col-span-1 h-2 rounded bg-gray-300"></div>
            </div>
            <div className="h-2 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  </>
  );
};

export default LoadingSkeleton;
