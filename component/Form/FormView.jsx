import { Skeleton } from "antd";
import Link from "next/link";
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
      title: "Assign By",
      dataIndex: "review",
      key: "Assign_By",
      render: (review) =>
        review.created.first_name + " " + review.created.last_name,
    },

    {
      title: "Review Name",
      dataIndex: "review",
      key: "review",
      render: (review) => review.review_name,
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
          <p className="text-green-400">Answered</p>
        ) : (
          <p className="text-red-400">Pending</p>
        ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          {!record.status ? (
            <Link href={`/review/id/${record.id}`} passHref>
              <span
                className="text-primary text-lg  cursor-pointer"
                title="Attempt"
              >
                Attempt
              </span>
            </Link>
          ) : (
            <div>
              <Link href={`/review/preview/${record.id}`} passHref>
                <button className="primary-bg-btn text-white px-2 py-1 rounded-md mx-2">
                  View
                </button>
              </Link>
            </div>
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
          <div className="mb-4 md:mb-0 text-right">
            <PrimaryButton
              withLink={false}
              className="rounded-md"
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
