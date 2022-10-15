import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { ButtonGray, PrimaryButton } from "../../component/common/CustomButton";
import CustomTable from "../../component/common/CustomTable";
import httpService from "../../lib/httpService";
import { TempateSelectWrapper } from "../Review/TempateSelectWrapper";

function FormView({ user }) {
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
        <div className="md:flex items-center justify-between mb-4 md:mb-6">
          <div className="flex w-auto">
            <PrimaryButton
              withLink={false}
              className="rounded-r-none rounded-l-md rounded-md w-1/2 md:w-fit "
              title={"Received"}
            />
            <ButtonGray
              withLink={true}
              className="rounded-r-md rounded-l-none w-1/2 md:w-fit "
              linkHref="/review"
              title={"Created"}
            />
          </div>
          <div className="mb-4 md:mb-0 text-right mt-2 md:mt-0">
            <PrimaryButton
              withLink={false}
              onClick={() => setCreateReviewModal(true)}
              title={"Create"}
            />
          </div>
        </div>
        <div className="w-full bg-white rounded-md overflow-hdden shadow-md">
          <div className="px-4 ">
            {loading ? (
              <Skeleton
                title={false}
                active={true}
                width={[200]}
                className="mt-4"
                rows={3}
              />
            ) : (
              <CustomTable
                dataSource={formAssignList}
                columns={columns}
                rowKey="form_view"
              />
            )}
          </div>
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
