import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import User1 from "../../assets/images/User1.png";
import { ApplaudIconSmall } from "../../assets/Icon/icons";

function AllAplaud({ user }) {
  const [applaud, setApplaud] = useState([]);
  const [applaudData, setApplaudData] = useState({});
  const [sortApplaudList, setSortApplaudList] = useState({});

  async function fetchApplaudData() {
    setApplaud([]);
    if (user?.id) {
      await fetch("/api/applaud/all/" + user.id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            setApplaud(response.data);
            console.log(response.data);
            if (response?.data?.length > 0) {
              applaudcount(response.data);
              sortApplaud(response.data);
            }
          }
        })

        .catch((err) => {
          console.log(err);
        });
    }
  }
  const applaudcount = (data) => {
    if (data.length > 0) {
      let res = data?.reduce(function (obj, key) {
        obj[key.user.first_name] = obj[key.user.first_name] || [];
        obj[key.user.first_name].push(key);
        return obj;
      }, {});

      setApplaudData(res);
    } else setApplaudData([]);
  };

  const sortApplaud = (data) => {
    if (data.length > 0) {
      let res = data?.reduce(function (obj, key) {
        obj[key.user.first_name] = obj[key.user.first_name] || [];
        obj[key.user.first_name].push(key);
        return obj;
      }, {});
      const sortable = Object.fromEntries(
        Object.entries(res).sort(([, a], [, b]) => b.length - a.length)
      );
      setSortApplaudList(sortable);
      console.log(sortable, "sortable");
    }
  };

  useEffect(() => {
    fetchApplaudData();
  }, []);

  return (
    <>
      {/* <div className="bg-white rounded-md overflow-hidden shadow-md "> */}

      <Row gutter={[16, 16]}>
        {Object.entries(sortApplaudList).length > 0 ? (
          Object.entries(sortApplaudList).map(([key, value], idx) => {
            return (
              <>
                <Col xs={12} md={8}>
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
                            <p className="mb-2 primary-color-blue font-medium md:text-sm">
                              {key}
                            </p>
                            <p className="flex">
                              <ApplaudIconSmall />
                              <span className="pl-2 md:text-sm font-medium text-gray-500">
                                {value.length}
                              </span>
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
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
      {/* </div> */}
    </>
  );
}

export default AllAplaud;
