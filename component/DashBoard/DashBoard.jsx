import React, { useState, useEffect } from "react";

function DashBoard({ user }) {
  const [dashBoardData, setDashboardData] = useState({});

  async function fetchDashboardData() {
    // setLoading(true);
    setDashboardData([]);
    await fetch("/api/dashboard/" + user.id, { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setDashboardData(response.data);
        }
        // setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setDashboardData([]);
      });
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="screen px-3 md:px-8 mt-14">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 mb-4 ">
            <div className="px-4 mb-10">
              <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
                <div className="flex flex-wrap border-b border-gray-200 ">
                  <div className="bg-gradient-to-tr from-pink-500 to-pink-700 -mt-10 mb-4 rounded-xl text-white grid items-center w-24 h-24 py-4 px-4 justify-center shadow-lg-pink ">
                    <span className="material-icons text-white text-3xl leading-none">
                      Review
                    </span>
                  </div>
                  <div className="w-full pl-4 max-w-full flex-grow flex-1 mb-2 text-right ">
                    <h5 className="text-gray-500 font-light tracking-wide text-base mb-1">
                      Review Created
                    </h5>
                    <span className="text-3xl text-gray-900">
                      {dashBoardData.reviewCreated ?? 0}
                    </span>
                  </div>
                </div>
                {/* <div className="text-sm text-gray-700 pt-4 flex items-center  justify-between">
                  <span className="text-green-500 ml-1 mr-2">3.48</span>
                  <span className="font-light whitespace-nowrap">
                    Since last month
                  </span>
                </div> */}
              </div>
            </div>
            <div className="px-4 mb-10">
              <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
                <div className="flex flex-wrap border-b border-gray-200 ">
                  <div className="bg-gradient-to-tr from-orange-500 to-orange-700 -mt-10 mb-4 rounded-xl text-white grid items-center w-24 h-24 py-4 px-4 justify-center shadow-lg-orange ">
                    <span className="material-icons text-white text-3xl leading-none">
                      Review
                    </span>
                  </div>
                  <div className="w-full pl-4 max-w-full flex-grow flex-1 mb-2 text-right ">
                    <h5 className="text-gray-500 font-light tracking-wide text-base mb-1">
                      Review Answered
                    </h5>
                    <span className="text-3xl text-gray-900">
                      {dashBoardData.reviewAnswered ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 mb-10">
              <div className="w-full bg-white rounded-xl overflow-hdden shadow-md p-4 ">
                <div className="flex flex-wrap border-b border-gray-200 ">
                  <div className="bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white grid items-center w-24 h-24 py-4 px-4 justify-center shadow-lg-purple ">
                    <span className="material-icons text-white text-3xl leading-none">
                      Users
                    </span>
                  </div>
                  <div className="w-full pl-4 max-w-full flex-grow flex-1 mb-2 text-right ">
                    <h5 className="text-gray-500 font-light tracking-wide text-base mb-1">
                      Users
                    </h5>
                    <span className="text-3xl text-gray-900">
                      {dashBoardData.userData ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard;
