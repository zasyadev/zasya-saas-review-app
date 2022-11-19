import { Skeleton } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ButtonGray, PrimaryButton } from "../../component/common/CustomButton";
import CustomTable from "../../component/common/CustomTable";
import httpService from "../../lib/httpService";
import ToggleButton from "../common/ToggleButton";
import { ReviewToggleList, REVIEW_RECEIVED_KEY } from "../Review/constants";
import { TempateSelectWrapper } from "../Review/TempateSelectWrapper";

function FormView({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [createReviewModal, setCreateReviewModal] = useState(false);
  const [formAssignList, setFormAssignList] = useState([]);

  async function fetchFormAssignList() {
    setLoading(true);
    setFormAssignList([]);

    await httpService
      .get(`/api/form/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setFormAssignList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  }

  useEffect(() => {
    fetchFormAssignList();
  }, []);

  const columns = [
    {
      title: "Review Name",
      dataIndex: "review",
      key: "review",
      // width: 250,
      render: (review) => review.review_name,
    },
    {
      title: "Assign By",
      dataIndex: "review",
      key: "Assign_By",
      render: (review) =>
        review.created.first_name + " " + review.created.last_name,
    },
    {
      title: "Frequency",
      dataIndex: "review",
      key: "frequency",
      render: (review) => review.frequency,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) =>
        status ? (
          <p className="text-green-400 mb-0">Answered</p>
        ) : (
          <p className="text-red-400 mb-0">Pending</p>
        ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          {!record.status ? (
            <PrimaryButton
              withLink={true}
              className=" text-sm"
              linkHref={`/review/id/${record.id}`}
              title={"Attempt"}
            />
          ) : (
            <ButtonGray
              withLink={true}
              className=" text-sm"
              linkHref={`/review/preview/${record.id}`}
              title={"View"}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto max-w-full">
      <div className="grid grid-cols-1 mb-16">
        <div className="flex flex-row items-center justify-between flex-wrap gap-4  mb-4 md:mb-6 ">
          <ToggleButton
            arrayList={ReviewToggleList}
            handleToggle={(activeKey) => {
              if (activeKey !== REVIEW_RECEIVED_KEY) router.push("/review");
            }}
            activeKey={REVIEW_RECEIVED_KEY}
          />

          <PrimaryButton
            withLink={false}
            onClick={() => setCreateReviewModal(true)}
            title={"Create"}
          />
        </div>
        <div className="w-full bg-white rounded-md overflow-hdden shadow-md">
          {loading ? (
            <div className="p-4">
              <Skeleton title={false} active={true} />
            </div>
          ) : (
            <CustomTable
              dataSource={formAssignList}
              columns={columns}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "50", "100", "200", "500"],
                className: "px-2 sm:px-4",
              }}
            />
          )}
        </div>
      </div>
      <TempateSelectWrapper
        createReviewModal={createReviewModal}
        setCreateReviewModal={setCreateReviewModal}
      />
    </div>
  );
}

export default FormView;
