import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import User1 from "../../assets/images/User1.png";
import { ApplaudIconSmall } from "../../assets/Icon/icons";

function AllAplaud({ user }) {
  const [sortApplaudList, setSortApplaudList] = useState({});
  const [allApplaud, setAllApplaud] = useState([]);
  const [teamMember, setTeamMember] = useState({});

  async function fetchApplaudData() {
    if (user?.id) {
      await fetch("/api/applaud/all/" + user.id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            setAllApplaud(response.data);
          }
        })

        .catch((err) => {
          console.log(err);
        });
    }
  }

  async function fetchMembersData() {
    await fetch("/api/team/" + user.id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          setTeamMember(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // const filterTeamMember = (data) => {
  //   console.log(data, "data");
  //   if (allApplaud.length > 0) {
  //     let filterdata = allApplaud.filter((item) => {
  //       return data.find((a) => {
  //         return a.user_id === item.user_id ? a : null;
  //       });
  //     });
  //     console.log(filterdata, "filterdata");

  //     let filteredApplaud = filterdata.reduce(function (obj, key) {
  //       obj[key.user.first_name] = obj[key.user.first_name] || [];
  //       obj[key.user.first_name].push(key);
  //       return obj;
  //     }, {});
  //     console.log(filteredApplaud, "fjysh");
  //   }
  // };

  const filterTeamMember = (teamMember, allApplaud) => {
    if (allApplaud.length > 0) {
      let filterdata = allApplaud.filter(({ user_id: id1 }) =>
        teamMember.some(({ user_id: id2 }) => id2 === id1)
      );
      let leftOutMember = teamMember.filter(
        ({ user_id: id1 }) =>
          !allApplaud.some(({ user_id: id2 }) => id2 === id1)
      );

      let results = filterdata?.reduce(function (obj, key) {
        obj[key.user.first_name] = obj[key.user.first_name] || [];
        obj[key.user.first_name].push(key);
        return obj;
      }, {});
      let leftOutResults = leftOutMember?.reduce(function (obj, key) {
        obj[key.user.first_name] = obj[key.user.first_name] || [];

        return obj;
      }, {});

      let obj = { ...results, ...leftOutResults };

      const sortable = Object.fromEntries(
        Object.entries(obj).sort(([, a], [, b]) => b.length - a.length)
      );

      setSortApplaudList(sortable);
    }
  };

  useEffect(() => {
    fetchApplaudData();
    fetchMembersData();
  }, []);
  useEffect(() => {
    if (teamMember.length && allApplaud.length)
      filterTeamMember(teamMember, allApplaud);
  }, [teamMember.length, allApplaud.length]);

  return (
    <>
      {/* <div className="bg-white rounded-md overflow-hidden shadow-md "> */}

      <Row gutter={[16, 16]}>
        {Object.keys(sortApplaudList).length > 0 ? (
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
                                {value?.length}
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
