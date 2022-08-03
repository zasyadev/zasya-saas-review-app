import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import User1 from "../../assets/images/User1.png";
import { ApplaudGiven, ApplaudIconSmall } from "../../assets/Icon/icons";

function AllAplaud({ user }) {
  const [allApplaud, setAllApplaud] = useState([]);

  async function fetchApplaudData() {
    setAllApplaud([]);
    if (user?.id) {
      await fetch("/api/applaud/all/" + user.id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            let data = response?.data?.sort(
              (a, b) =>
                b[Object.keys(b)]?.taken?.length -
                a[Object.keys(a)]?.taken?.length
            );
            setAllApplaud(data);
          }
        })

        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    fetchApplaudData();
  }, []);

  return (
    <>
      <Row gutter={[16, 16]}>
        {allApplaud.length > 0 ? (
          allApplaud.map((item, idx) => {
            return (
              <>
                {Object.entries(item).map(([key, value]) => {
                  return (
                    <Col xs={24} sm={12} md={8}>
                      <div className="bg-white rounded-md overflow-hidden shadow-md mx-4 my-3 py-3 px-1">
                        <Row justify="center">
                          <Col xs={10} md={10}>
                            <div className=" flex justify-center">
                              <Image src={User1} alt="user" />
                            </div>
                          </Col>

                          <Col xs={14} md={14}>
                            <div className="flex justify-between items-center">
                              <div className="md:py-2 md:px-3">
                                <div>
                                  <p className="mb-2 primary-color-blue font-medium md:text-sm">
                                    {key}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="flex" title="Applaud Taken">
                                    <div className="flex ">
                                      <ApplaudIconSmall />
                                    </div>
                                    <div className="flex items-end pl-2 md:text-sm font-medium text-gray-500">
                                      {value?.taken?.length}
                                    </div>
                                  </p>
                                  <p
                                    className="flex mx-3"
                                    title="Applaud Given"
                                  >
                                    <div className="flex">
                                      <ApplaudGiven />
                                    </div>
                                    <div className="flex items-end pl-2 md:text-sm font-medium text-gray-500">
                                      {value?.given?.length}
                                    </div>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  );
                })}
              </>
            );
          })
        ) : (
          <Col xs={24} md={24}>
            <div className="bg-white rounded-md overflow-hidden shadow-md mx-4 my-3 py-3 px-1">
              <div className="flex justify-center items-center h-48">
                <div className="text-center  ">No Applaud Found</div>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
}

export default AllAplaud;
